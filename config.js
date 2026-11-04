/*
 * CONFIGURAÇÃO DO FRONTEND
 *
 * Para desenvolver a interface sem o backend, mantenha DEMO_MODE = true.
 * Os livros de demonstração ficam salvos no localStorage deste navegador.
 *
 * Quando a API ASP.NET Core estiver pronta:
 * 1. Altere DEMO_MODE para false.
 * 2. Informe a URL HTTP/HTTPS real exibida ao executar a API com `dotnet run`.
 * 3. Habilite CORS no backend para a origem usada pelo Live Server.
 */
window.LIVRO_CIRCULAR_CONFIG = {
  DEMO_MODE: true,
  API_BASE_URL: "https://localhost:7001"
};
