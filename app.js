(() => {
  "use strict";

  const config = window.LIVRO_CIRCULAR_CONFIG || { DEMO_MODE: true, API_BASE_URL: "https://localhost:7001" };
  const STORAGE_KEY = "livroCircular.livros.v1";
  const form = document.getElementById("book-form");
  const submitButton = document.getElementById("submit-button");
  const feedback = document.getElementById("form-feedback");
  const catalogFeedback = document.getElementById("catalog-feedback");
  const catalogGrid = document.getElementById("catalog-grid");
  const bookCount = document.getElementById("book-count");
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("filter-category");
  const toast = document.getElementById("toast");

  let books = [];
  let toastTimer;

  const escapeText = (value) => String(value ?? "").trim();
  const normalize = (value) => String(value ?? "").toLocaleLowerCase("pt-BR");
  const createId = () => (window.crypto && typeof window.crypto.randomUUID === "function")
    ? window.crypto.randomUUID()
    : `livro-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = `toast toast-${type} is-visible`;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3800);
  }

  function setFeedback(message, type = "success") {
    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;
  }

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.innerHTML = isLoading
      ? '<span class="button-spinner" aria-hidden="true"></span> Salvando...'
      : 'Disponibilizar livro <span aria-hidden="true">→</span>';
  }

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach((element) => { element.textContent = ""; });
    document.querySelectorAll(".field input, .field select, .field textarea").forEach((element) => element.classList.remove("invalid"));
  }

  function validate(data) {
    clearErrors();
    let valid = true;
    const required = [
      ["titulo", "Informe o título do livro."],
      ["autor", "Informe o nome do autor."],
      ["categoria", "Selecione uma categoria."],
      ["estadoConservacao", "Selecione o estado de conservação."],
      ["nomeDoador", "Informe seu nome para identificar a doação."]
    ];

    for (const [field, message] of required) {
      if (!data[field]) {
        const input = document.getElementById(field);
        const error = document.getElementById(`${field}-error`);
        input.classList.add("invalid");
        error.textContent = message;
        valid = false;
      }
    }

    if (data.titulo.length > 120 || data.autor.length > 100 || data.nomeDoador.length > 80) valid = false;
    return valid;
  }

  function readForm() {
    const formData = new FormData(form);
    return {
      titulo: escapeText(formData.get("titulo")),
      autor: escapeText(formData.get("autor")),
      categoria: escapeText(formData.get("categoria")),
      estadoConservacao: escapeText(formData.get("estadoConservacao")),
      nomeDoador: escapeText(formData.get("nomeDoador")),
      descricao: escapeText(formData.get("descricao"))
    };
  }

  function readDemoBooks() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch (error) {
      console.error("Não foi possível ler os livros locais:", error);
      return [];
    }
  }

  function writeDemoBooks(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function normalizeBook(book) {
    return {
      id: book.id ?? book.Id ?? createId(),
      titulo: book.titulo ?? book.Titulo ?? "Livro sem título",
      autor: book.autor ?? book.Autor ?? "Autor não informado",
      categoria: book.categoria ?? book.Categoria ?? "Outros",
      estadoConservacao: book.estadoConservacao ?? book.EstadoConservacao ?? book.estado ?? "Não informado",
      nomeDoador: book.nomeDoador ?? book.NomeDoador ?? book.doador ?? book.Doador ?? "Comunidade",
      descricao: book.descricao ?? book.Descricao ?? "",
      status: book.status ?? book.Status ?? "Disponível para retirada",
      dataCadastro: book.dataCadastro ?? book.DataCadastro ?? new Date().toISOString()
    };
  }

  async function apiRequest(path, options = {}) {
    const baseUrl = String(config.API_BASE_URL || "").replace(/\/$/, "");
    if (!baseUrl) throw new Error("Configure a URL da API no arquivo config.js.");
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      let detail = `A API respondeu com erro (${response.status}).`;
      try {
        const body = await response.json();
        detail = body.message || body.title || body.detail || detail;
      } catch (_) { /* Resposta sem JSON. */ }
      throw new Error(detail);
    }

    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async function loadBooks() {
    catalogFeedback.textContent = "";
    if (config.DEMO_MODE) {
      books = readDemoBooks().map(normalizeBook);
    } else {
      try {
        const result = await apiRequest("/api/livros");
        const list = Array.isArray(result) ? result : (result?.items || result?.data || result?.livros || []);
        books = list.map(normalizeBook);
      } catch (error) {
        books = [];
        catalogFeedback.textContent = `Não foi possível carregar o catálogo. ${error.message} Verifique se a API está em execução e se o CORS está configurado.`;
        catalogFeedback.classList.add("error");
      }
    }
    renderCatalog();
  }

  async function saveBook(data) {
    const payload = { ...data };
    if (config.DEMO_MODE) {
      const newBook = normalizeBook({
        ...payload,
        id: createId(),
        status: "Disponível para retirada",
        dataCadastro: new Date().toISOString()
      });
      const current = readDemoBooks();
      current.unshift(newBook);
      writeDemoBooks(current);
      return newBook;
    }

    const result = await apiRequest("/api/livros", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return normalizeBook(result || { ...payload, status: "Disponível para retirada" });
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createBookCard(book) {
    const article = createElement("article", "book-card");
    const top = createElement("div", "book-card-top");
    const cover = createElement("div", `book-cover cover-${(book.categoria || "outros").toLowerCase().replace(/[^a-z0-9]/g, "-")}`);
    const coverIcon = createElement("span", "cover-icon", "✧");
    const category = createElement("span", "book-category", book.categoria);
    cover.append(coverIcon, category);

    const status = createElement("span", "availability-badge", book.status || "Disponível para retirada");
    top.append(cover, status);

    const body = createElement("div", "book-card-body");
    const title = createElement("h3", "book-title", book.titulo);
    const author = createElement("p", "book-author", `por ${book.autor}`);
    const divider = createElement("div", "book-divider");
    const details = createElement("div", "book-details");
    const condition = createElement("span", "detail-chip", `Conservação: ${book.estadoConservacao}`);
    const donor = createElement("p", "book-donor", `Doado por ${book.nomeDoador}`);
    details.append(condition, donor);
    body.append(title, author, divider, details);
    if (book.descricao) body.append(createElement("p", "book-description", book.descricao));
    article.append(top, body);
    return article;
  }

  function renderCatalog() {
    const query = normalize(searchInput.value);
    const category = categoryFilter.value;
    const filtered = books.filter((book) => {
      const matchesQuery = normalize(book.titulo).includes(query) || normalize(book.autor).includes(query);
      const matchesCategory = !category || book.categoria === category;
      return matchesQuery && matchesCategory;
    });

    bookCount.textContent = String(books.length);
    catalogGrid.replaceChildren();

    if (!filtered.length) {
      const empty = createElement("div", "catalog-empty");
      const icon = createElement("span", "empty-icon", books.length ? "⌕" : "📚");
      const heading = createElement("h3", "", books.length ? "Nenhum livro encontrado" : "O catálogo está começando");
      const message = createElement("p", "", books.length ? "Tente alterar a busca ou o filtro de categoria." : "Assim que um livro for cadastrado, ele aparecerá aqui.");
      empty.append(icon, heading, message);
      if (!books.length) {
        const link = createElement("a", "text-link", "Cadastre o primeiro livro →");
        link.href = "#doar";
        empty.append(link);
      }
      catalogGrid.append(empty);
      return;
    }

    filtered.forEach((book) => catalogGrid.append(createBookCard(book)));
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFeedback("");
    const data = readForm();
    if (!validate(data)) {
      setFeedback("Confira os campos destacados antes de continuar.", "error");
      return;
    }

    setLoading(true);
    try {
      const saved = await saveBook(data);
      form.reset();
      clearErrors();
      setFeedback(`Livro “${saved.titulo}” cadastrado com sucesso! Ele já está disponível no catálogo.`, "success");
      showToast("Doação cadastrada. Obrigado por compartilhar!", "success");
      await loadBooks();
      document.getElementById("catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("Erro ao cadastrar livro:", error);
      setFeedback(`Não foi possível cadastrar o livro. ${error.message}`, "error");
      showToast("Não foi possível salvar a doação.", "error");
    } finally {
      setLoading(false);
    }
  });

  searchInput.addEventListener("input", renderCatalog);
  categoryFilter.addEventListener("change", renderCatalog);

  document.querySelectorAll(".field input, .field select, .field textarea").forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("invalid");
      const error = document.getElementById(`${input.id}-error`);
      if (error) error.textContent = "";
    });
    input.addEventListener("change", () => {
      input.classList.remove("invalid");
      const error = document.getElementById(`${input.id}-error`);
      if (error) error.textContent = "";
    });
  });

  document.documentElement.dataset.mode = config.DEMO_MODE ? "demo" : "api";
  loadBooks();
})();
