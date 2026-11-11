# Licenças de terceiros e origem dos materiais

> Conferência feita pelo grupo de desenvolvimento em 2026-11-10. Licenças podem mudar: reconfirme nas páginas oficiais antes de uso comercial.

## Fontes (tipografia)

| Fonte | Licença | Como é usada |
|---|---|---|
| DM Sans | SIL Open Font License 1.1 | Carregada do Google Fonts **somente após o consentimento de cookies** do usuário; sem consentimento, o site usa fontes do sistema. |
| Playfair Display | SIL Open Font License 1.1 | Igual à anterior. |

A licença OFL permite uso, inclusive comercial, sem pagar, desde que a licença acompanhe a fonte (o Google Fonts já a distribui).

## Bibliotecas e frameworks

| Item | Licença | Uso |
|---|---|---|
| .NET / ASP.NET Core / Identity / SignalR | MIT | Backend |
| Entity Framework Core (+ provedor SQLite) | MIT | Acesso a dados |
| Npgsql.EntityFrameworkCore.PostgreSQL | PostgreSQL License (permissiva) | Opcional: PostgreSQL online |
| @microsoft/signalr (cliente JS, via jsDelivr) | MIT | Chat em tempo real; só é carregado após consentimento, com *fallback* para consulta periódica |
| Playwright (apenas testes locais, não vai ao site) | Apache-2.0 | Testes automatizados |

O frontend usa apenas HTML, CSS e JavaScript próprios, sem frameworks de terceiros embutidos.

## Imagens, ilustrações e marcas

- **Personagens (Tomás, Lia e Pipo), ícones e ilustrações:** criados pelo grupo/pelo assistente de IA para este projeto, em SVG feito à mão no código. Não copiam personagens, marcas ou obras de terceiros.
- **Fotos dos livros:** enviadas pelos próprios usuários, que declaram ter o direito de usá-las (Termos de Uso, item 5 e 14).
- **Logotipos de clientes ou de terceiros:** **nenhum é usado**. O logotipo "livro circular" é do próprio projeto. Não inclua logos de empresas, faculdade ou clientes sem autorização escrita.

## Serviços externos usados pela aplicação

| Serviço | Para quê | Observação |
|---|---|---|
| ViaCEP | Consultar cidade/UF pelo CEP | Serviço público; recebe só o CEP consultado |
| Melhor Envio (opcional) | Cotação real de frete | Só com token configurado pela equipe; sem token o site mostra simulação |
| Render / Neon / Supabase (opcionais) | Hospedagem e banco de dados | Veja `docs/HOSPEDAGEM.md`; planos gratuitos têm limites |

## Textos legais

As páginas em `wwwroot/legal/`, os contratos gerados e `docs/*.md` foram redigidos com auxílio de IA como **modelo-base** e **precisam ser revisados por advogado(a)** antes de uso real.
