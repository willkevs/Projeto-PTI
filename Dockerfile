# Livro Circular — imagem para hospedagem (Render, Fly.io, Railway etc.)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY LivroCircular.Web.csproj ./
# UsePostgres=true compila o suporte a PostgreSQL (Neon, Supabase). Para só SQLite: --build-arg USE_POSTGRES=false
ARG USE_POSTGRES=true
RUN dotnet restore -p:UsePostgres=$USE_POSTGRES
COPY . .
RUN dotnet publish -c Release -o /app/publish --no-restore -p:UsePostgres=$USE_POSTGRES

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_FORWARDEDHEADERS_ENABLED=true \
    Hosting__BehindProxy=true
EXPOSE 8080
ENTRYPOINT ["dotnet", "LivroCircular.Web.dll"]
