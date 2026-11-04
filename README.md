# Livro Circular — Frontend da PoC

Interface web da Prova de Conceito do projeto integrador Livro Circular. O foco é a jornada da Maria, doadora de livros: cadastrar um exemplar e disponibilizá-lo no catálogo comunitário.

## Tecnologias

- HTML5: estrutura semântica da página.
- CSS3: identidade visual responsiva.
- JavaScript: validação do formulário, busca/filtro e comunicação HTTP com a API.
- ASP.NET Core Web API (backend futuro): endpoints `GET /api/livros` e `POST /api/livros`.

## Abrir a interface

1. Extraia a pasta.
2. Abra a pasta no Visual Studio Code.
3. Execute `index.html` com a extensão **Live Server** (ou sirva a pasta por um servidor HTTP local).
4. O arquivo `config.js` começa com `DEMO_MODE: true`. Nesse modo, os livros cadastrados ficam no `localStorage` do navegador, permitindo demonstrar o fluxo mesmo antes da API existir.

## Conectar ao backend ASP.NET Core

Quando a API estiver pronta:

1. Execute o backend e copie a URL HTTP/HTTPS mostrada no terminal ou em `Properties/launchSettings.json`.
2. Abra `config.js` e altere `API_BASE_URL` para essa URL. Exemplo ilustrativo: `https://localhost:7001` — use a URL real do seu projeto, não copie o exemplo sem conferir.
3. Altere `DEMO_MODE` para `false`.
4. Configure CORS no backend para permitir a origem do Live Server (normalmente `http://127.0.0.1:5500` ou `http://localhost:5500`).
5. Garanta que o backend exponha os endpoints abaixo e aceite os mesmos campos JSON.

### Contrato esperado da API

`POST /api/livros` — recebe:

```json
{
  "titulo": "O Pequeno Príncipe",
  "autor": "Antoine de Saint-Exupéry",
  "categoria": "Literatura",
  "estadoConservacao": "Muito bom",
  "nomeDoador": "Maria",
  "descricao": "Exemplar bem conservado."
}
```

O backend deve validar os campos obrigatórios, persistir o registro no banco e definir o status inicial como **Disponível para retirada**. É recomendado retornar o livro criado com `201 Created`.

`GET /api/livros` — retorna uma lista JSON com os livros cadastrados. Cada item deve conter, no mínimo:

```json
{
  "id": 1,
  "titulo": "O Pequeno Príncipe",
  "autor": "Antoine de Saint-Exupéry",
  "categoria": "Literatura",
  "estadoConservacao": "Muito bom",
  "nomeDoador": "Maria",
  "descricao": "Exemplar bem conservado.",
  "status": "Disponível para retirada",
  "dataCadastro": "2026-11-04T15:00:00Z"
}
```

Os nomes de propriedades podem ser retornados em camelCase ou PascalCase; o frontend trata ambos. O JSON da consulta pode ser um array direto ou um objeto com `items`, `data` ou `livros` contendo a lista.

## Escopo da PoC

**Incluído:** apresentação da proposta, formulário de cadastro, validação no navegador, envio de cadastro, leitura do catálogo, busca e filtro por categoria.

**Ainda não incluído:** autenticação real, solicitação/reserva de retirada, chat entre doador e leitor, logística, notificações e painel administrativo. Esses recursos podem ser planejados para versões futuras, sem ampliar a PoC além do necessário.

## Observações

- O modo de demonstração não é banco de dados do sistema: ele salva somente no navegador atual. Para persistência compartilhada, conecte a API e o banco de dados.
- Não há autenticação nesta versão. O nome informado identifica a doação apenas para fins de protótipo.
- O layout usa fontes do Google Fonts quando há internet; se estiver offline, o navegador usa fontes alternativas instaladas.
