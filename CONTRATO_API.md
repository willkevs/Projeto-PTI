# Contrato resumido da API — Livro Circular

> **Versão 2:** novas rotas (negociações, contratos, devoluções, avaliações, denúncias, notificações, privacidade e equipe) estão em [`docs/API_V2.md`](docs/API_V2.md). `acceptTerms` e `confirmAdult` são obrigatórios no cadastro; o CEP de origem dos livros vem mascarado (`12345***`) para quem não é o dono; as fotos ficam no banco e são servidas em `/api/arquivos/{id}`.

Todas as rotas `/api/livros`, `/api/conversas`, `/api/fretes` e `/api/cep` exigem cookie de autenticação obtido em `/api/auth/register` ou `/api/auth/login`.

## Cadastro

`POST /api/auth/register` — JSON:
```json
{
  "fullName": "Maria da Silva",
  "email": "maria@example.com",
  "password": "Senha123",
  "postalCode": "01001000",
  "acceptTerms": true,
  "confirmAdult": true,
  "marketingOptIn": false
}
```

`POST /api/auth/login` — JSON:
```json
{ "email": "maria@example.com", "password": "Senha123" }
```

## Criar livro

`POST /api/livros` — `multipart/form-data`:

- `Title`, `Author`, `Category`, `Condition` (obrigatórios)
- `ListingType`: `Donation` ou `Sale`
- `Price`: obrigatório para `Sale`; ignorado para `Donation`
- `PostalCodeOrigin`, `WeightGrams`, `WidthCm`, `HeightCm`, `LengthCm`
- `Description` (opcional)
- `Image` (obrigatório; JPEG/PNG/WEBP até 5 MB)

## Conversas

`POST /api/conversas`:
```json
{ "bookId": "GUID-DO-ANUNCIO" }
```

`POST /api/conversas/{id}/mensagens`:
```json
{ "content": "Olá! Tenho interesse no livro." }
```

SignalR: `/hubs/chat`. Métodos do cliente: `JoinConversation(conversationId)` e `SendMessage(conversationId, content)`. Evento recebido: `ReceiveMessage`.

## Envio

`POST /api/fretes/{bookId}/cotacao`:
```json
{ "destinationPostalCode": "20040020" }
```

O backend usa CEP de origem salvo no anúncio, medidas e peso. Se houver `Shipping:Token`, tenta Melhor Envio; sem token, retorna duas opções explicitamente identificadas como simulação.
