# Contrato de integração — Livro Circular

Este documento define a combinação de campos entre o frontend e o backend em C# para que os dois lados funcionem juntos.

## Rotas necessárias

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/api/livros` | Listar os livros cadastrados |
| POST | `/api/livros` | Cadastrar um livro para doação |

## Corpo esperado no POST

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

Campos obrigatórios: `titulo`, `autor`, `categoria`, `estadoConservacao` e `nomeDoador`.

A API deve validar os campos novamente no servidor (a validação do navegador não substitui a validação do backend), salvar no SQLite e definir `status = "Disponível para retirada"` no cadastro inicial.

## Exemplo de resposta do GET

```json
[
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
]
```

O frontend aceita os nomes das propriedades em camelCase ou PascalCase. O GET pode responder com o array direto ou com `{ "items": [...] }`, `{ "data": [...] }` ou `{ "livros": [...] }`.

## CORS

Como a interface pode ser executada pelo Live Server em uma origem diferente da API, a API ASP.NET Core deve liberar a origem usada no desenvolvimento, por exemplo `http://127.0.0.1:5500` ou `http://localhost:5500`. Em produção, liberar apenas as origens oficiais do projeto.
