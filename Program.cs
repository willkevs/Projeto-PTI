using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using LivroCircular.Data;
using LivroCircular.Hubs;
using LivroCircular.Models;
using LivroCircular.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 30 * 1024 * 1024;
});

// ---------- Banco de dados: SQLite (padrão, local) ou PostgreSQL (Neon, Supabase etc.) ----------
// Troque com a variável Database__Provider=Postgres e ConnectionStrings__DefaultConnection.
// Para PostgreSQL, compile com:  dotnet build -p:UsePostgres=true   (veja docs/HOSPEDAGEM.md)
var databaseProvider = builder.Configuration["Database:Provider"] ?? "Sqlite";
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=App_Data/livro-circular.db";
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (databaseProvider.Equals("Postgres", StringComparison.OrdinalIgnoreCase))
    {
#if POSTGRES
        options.UseNpgsql(connectionString);
#else
        throw new InvalidOperationException(
            "Database:Provider=Postgres exige compilar com -p:UsePostgres=true (veja docs/HOSPEDAGEM.md).");
#endif
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

var keysPath = builder.Configuration["DataProtection:KeysPath"];
var dataProtection = builder.Services.AddDataProtection().SetApplicationName("LivroCircular");
if (!string.IsNullOrWhiteSpace(keysPath)) dataProtection.PersistKeysToFileSystem(new DirectoryInfo(keysPath));

builder.Services.AddIdentityCore<ApplicationUser>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>()
.AddErrorDescriber<PortugueseIdentityErrorDescriber>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "LivroCircular.Auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
        options.SlidingExpiration = true;
        options.Events = new CookieAuthenticationEvents
        {
            // A cada requisição confere se a conta ainda existe/não está suspensa e atualiza os papéis.
            OnValidatePrincipal = async context =>
            {
                var userId = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();
                var user = userId is null ? null : await userManager.FindByIdAsync(userId);
                if (user is null || user.IsSuspended || user.DeletedAtUtc is not null)
                {
                    context.RejectPrincipal();
                    await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                    return;
                }
                context.ReplacePrincipal(await PrincipalFactory.BuildAsync(userManager, user));
            },
            OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            },
            OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(Roles.PolicyStaff, policy => policy.RequireRole(Roles.Admin, Roles.Developer, Roles.Collaborator));
    options.AddPolicy(Roles.PolicyAdmin, policy => policy.RequireRole(Roles.Admin));
    options.AddPolicy(Roles.PolicyModeration, policy => policy.RequireRole(Roles.Admin, Roles.Collaborator));
    options.AddPolicy(Roles.PolicyTechnical, policy => policy.RequireRole(Roles.Admin, Roles.Developer));
});

// Limite de tentativas por endereço IP em login/cadastro/assinatura (reduz tentativas de adivinhar senhas).
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsJsonAsync(
            new { message = "Muitas tentativas em pouco tempo. Aguarde um minuto e tente novamente." }, cancellationToken);
    };
    options.AddPolicy("auth", httpContext => RateLimitPartition.GetFixedWindowLimiter(
        httpContext.Connection.RemoteIpAddress?.ToString() ?? "desconhecido",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 20, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
});

builder.Services.AddControllers().AddJsonOptions(options =>
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddSignalR().AddJsonProtocol(options =>
    options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<AuditService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<FileStoreService>();
builder.Services.AddScoped<ReturnService>();
builder.Services.AddScoped<RetentionService>();
builder.Services.AddSingleton<UnsubscribeService>();
builder.Services.AddHostedService<RetentionBackgroundService>();

builder.Services.AddHttpClient<ViaCepService>(client =>
{
    client.BaseAddress = new Uri("https://viacep.com.br/");
    client.Timeout = TimeSpan.FromSeconds(8);
    client.DefaultRequestHeaders.UserAgent.ParseAdd("LivroCircular/1.0");
});
builder.Services.AddHttpClient<ShippingQuoteService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(15);
});

var app = builder.Build();

Directory.CreateDirectory(Path.Combine(app.Environment.ContentRootPath, "App_Data"));

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = services.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
    await SeedAsync(services, app.Configuration, app.Logger);
}

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/erro.html");
    app.UseHsts();
}

app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    await next();
});

// Atrás do proxy da hospedagem (Render etc.) o HTTPS é terminado fora do app: defina Hosting__BehindProxy=true.
if (!app.Configuration.GetValue<bool>("Hosting:BehindProxy")) app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat").RequireAuthorization();
app.MapFallbackToFile("index.html");

app.Run();

static async Task SeedAsync(IServiceProvider services, IConfiguration configuration, ILogger logger)
{
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    foreach (var role in Roles.All)
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));

    // O primeiro Administrador vem de configuração (segredo/variável de ambiente), nunca do código.
    var email = configuration["Admin:Email"]?.Trim().ToLowerInvariant();
    var password = configuration["Admin:InitialPassword"];
    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
    {
        logger.LogInformation("Admin:Email/Admin:InitialPassword não definidos: nenhum Administrador foi criado.");
        return;
    }

    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var user = await userManager.FindByEmailAsync(email);
    if (user is null)
    {
        user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FullName = configuration["Admin:Name"] ?? "Administrador",
            PostalCode = "01001000",
            AdultConfirmed = true,
            EmailConfirmed = true
        };
        var created = await userManager.CreateAsync(user, password);
        if (!created.Succeeded)
        {
            logger.LogError("Não foi possível criar o Administrador: {Errors}", string.Join(" ", created.Errors.Select(e => e.Description)));
            return;
        }
    }
    if (!await userManager.IsInRoleAsync(user, Roles.Admin))
        await userManager.AddToRoleAsync(user, Roles.Admin);
}

public partial class Program { }
