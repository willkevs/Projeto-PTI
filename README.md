# Livro Circular — Aplicação Web Full Stack

Projeto Integrador de Análise e Desenvolvimento de Sistemas (Senac EAD — TADS/TSI) · **2ª etapa: Prova de Conceito (PoC)**.
Aplicação web para conectar pessoas que desejam doar ou vender livros a leitores da comunidade.

> **Integrantes do grupo:** _Igor Rodrigues da Silva, José Carlos Pereira, Marcelo Rizzetto Gumiero, Pablo Henrique dos Santos Reis e William Kevin Buarque Pereira
_

## Sumário

1. [Prova de conceito: o que foi escolhido](#prova-de-conceito-o-que-foi-escolhido)
2. [Escopo implementado](#escopo-implementado)
3. [A família Circular (interação com o usuário)](#a-família-circular-interação-com-o-usuário)
4. [Tecnologias](#tecnologias)
5. [Como executar (passo a passo)](#como-executar-passo-a-passo)
6. [Como testar o fluxo principal](#como-testar-o-fluxo-principal)
7. [Estrutura de pastas](#estrutura-de-pastas)
8. [Cotação de envio: simulação x valor real](#cotação-de-envio-simulação-x-valor-real)
9. [Endpoints principais](#endpoints-principais)
10. [Problemas comuns](#problemas-comuns)
11. [Observações e limites desta PoC](#observações-e-limites-desta-poc)
12. [Documentos da entrega](#documentos-da-entrega)

## Prova de conceito: o que foi escolhido

A PoC valida **uma única jornada**: _Maria, doadora de livros, cria a conta, anuncia um livro com foto obrigatória e o livro aparece no catálogo para outras pessoas._ Conta, busca, chat e simulação de frete complementam a demonstração do ciclo comunitário. A justificativa da escolha e o que ficou de fora estão em [`DOCUMENTACAO_ARQUITETURA.md`](DOCUMENTACAO_ARQUITETURA.md).

## Escopo implementado

- Cadastro e login obrigatórios para acessar a área interna.
- Cadastro de contas com nome, e-mail, senha e CEP.
- Cadastro de anúncios de doação ou venda.
- Foto obrigatória do estado de conservação do livro (JPG, PNG ou WEBP, até 5 MB).
- Validação dos campos, do preço de anúncios de venda e das imagens enviadas (no navegador e no servidor).
- Banco SQLite para contas, anúncios, conversas e mensagens.
- Catálogo com busca e filtros por categoria e tipo de anúncio.
- Chat persistente entre interessado e anunciante, com SignalR e alternativa de consulta periódica.
- Simulador de envio de doações por CEP de origem/destino.
- Integração opcional com a API de cotação do Melhor Envio quando a equipe configurar um token próprio.
- Proteções: senha com hash (Identity), cookie HttpOnly, bloqueio após 5 tentativas erradas, limite de tentativas por minuto em login/cadastro e validação do conteúdo real da imagem.
- Layout responsivo: computador, notebook, tablet e celular.

### Versão 2 (LGPD, equipe, contratos e devoluções)

- **Privacidade (LGPD):** Termos de Uso e Política de Privacidade com caixa de aceite obrigatória e **registro do aceite** (versão, data/hora, hash do IP); declaração de **18+** (a plataforma não coleta dados de crianças); **consentimento de marketing separado**, opcional e desmarcado; link de descadastro por token; exportar dados e excluir/anonimizar a conta; tabela de **retenção por tipo de dado** (`docs/RETENCAO_DADOS.md`) aplicada por rotina automática.
- **Cookies:** aviso com **Aceitar** e **Recusar** de mesmo destaque; nada de terceiros (Google Fonts e SignalR via CDN) é carregado antes do consentimento.
- **Equipe com hierarquia fixa:** Administrador > Desenvolvedor > Colaborador > Membro. O painel **Equipe** só aparece para quem tem papel; a API valida o papel no servidor.
- **Vendedores x doadores:** quem paga o frete (vendedor/comprador/retirada em mãos; doador/donatário/retirada), prazo de postagem, aceitar propostas (venda) e recado (doação).
- **Contratos prontos por escrito** (venda e doação) com **assinatura eletrônica simples** (nome digitado + senha + data/hora + hash do documento). As partes só informam os dados da negociação e assinam.
- **Devoluções (vendas):** arrependimento de **7 dias** e 30 dias para livro diferente/danificado, com **evidências obrigatórias** (1 a 5 fotos + declaração), resposta do vendedor, mediação da equipe e **reembolso com comprovante obrigatório**.
- **Avaliações verificadas** para livros doados **e** vendidos (só quem concluiu a negociação, uma vez por pessoa).
- **Denúncias e moderação:** denúncia crítica (menores/ilegal) oculta o anúncio na hora, preserva a prova e gera dossiê para o Administrador encaminhar **manualmente** às autoridades.
- **Incidentes de segurança:** registro com prazo de **3 dias úteis** para comunicar a ANPD (`docs/PLANO_RESPOSTA_INCIDENTES.md`).
- **Notificações em vários aparelhos** (SignalR para todos os aparelhos conectados) sobre chat, pedidos, contratos, envio e devoluções.
- **Acessibilidade:** link "pular para o conteúdo", foco visível, navegação por teclado, texto alternativo, contraste revisado e opção "Reduzir animações".
- **Hospedagem gratuita:** `Dockerfile`, `render.yaml` e guia em [`docs/HOSPEDAGEM.md`](docs/HOSPEDAGEM.md) (Render + Neon/Supabase). **O deploy precisa ser feito pelo grupo**, com as contas de vocês.

> Os textos legais e os contratos são **modelos-base feitos com IA** e **precisam de revisão de advogado(a)**. Preencha os campos entre colchetes (`[NOME DO GRUPO / RESPONSÁVEL]`, `[E-MAIL DE SUPORTE]`, `[E-MAIL DO ENCARREGADO (DPO)]`, `[CIDADE/UF DO FORO]`) em `wwwroot/legal/`.

## A família Circular (interação com o usuário)

Três livros-pet com olhos animados e braços/pernas de palito acompanham o usuário:

| Personagem | Papel |
|---|---|
| **Tomás** (dourado, o maior) | Cobre os olhos, mas espia a senha pelos dedos |
| **Lia** (terracota) | Põe a mão na testa e se inclina para tentar ver |
| **Pipo** (verde-claro, o menor) | Pula para tentar enxergar |

- **Login e cadastro:** os livros olham para o campo em foco e tentam ver a senha. Ao clicar em **mostrar/ocultar**, reagem (surpresa ao mostrar, tristeza ao esconder). Também reagem a senhas diferentes, senha fraca, erro de login e conta criada.
- **Anunciar livro:** reagem à escolha de doar/vender, conservação, categoria, título digitado, foto enviada e à publicação (confete).
- **Mouse e toque:** clicar faz o livro pular e falar; arrastar levanta o livro, que cai e volta andando para a estante.
- **Transições de página:** animação simples de entrada (fade + subida) entre telas; quem ativa "reduzir movimento" no sistema não vê animações.
- Código em `wwwroot/js/pets.js` e `wwwroot/css/pets.css`. Se esses arquivos falharem, o site continua funcionando normalmente.

![Antes e depois](docs/antes-depois.png)

## Tecnologias

- C# / ASP.NET Core Web API (.NET 10 LTS)
- ASP.NET Core Identity com autenticação por cookie
- Entity Framework Core + SQLite (local) ou PostgreSQL online (Neon/Supabase)
- SignalR para mensagens em tempo real
- HTML5, CSS3 e JavaScript puro no frontend (sem frameworks)
- ViaCEP para validar e localizar CEPs

A interface é servida pelo próprio ASP.NET Core em `wwwroot`. Por isso, frontend e backend usam a mesma origem e não precisam de CORS durante a execução local.

## Como executar (passo a passo)

### 1. Instalar (uma única vez)

1. **.NET 10 SDK:** https://dotnet.microsoft.com/pt-br/download/dotnet/10.0
2. **Visual Studio Code:** https://code.visualstudio.com/ (com a extensão **C# Dev Kit**)
3. **Git:** https://git-scm.com/downloads (somente se for baixar o projeto do GitHub)

### 2. Baixar o projeto

- **Pelo GitHub:** `git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git` e depois `cd NOME-DO-REPOSITORIO`
- **Pelo ZIP:** extraia o arquivo e abra a pasta `LivroCircular_Completo` no VS Code.

### 3. Rodar

Abra **Terminal > Novo Terminal** dentro da pasta do projeto (onde está o arquivo `LivroCircular.Web.csproj`) e execute:

```powershell
dotnet --version      # o primeiro número deve ser 10
dotnet restore        # baixa os pacotes (precisa de internet na primeira vez)
dotnet watch run      # compila e inicia o servidor
```

(`dotnet run` também funciona; o `watch` recarrega sozinho quando você altera arquivos.)

### 4. Abrir no navegador

Abra **https://localhost:7284** (a porta também aparece no terminal: _Now listening on_). Se o navegador avisar sobre o certificado local, execute **uma vez**:

```powershell
dotnet dev-certs https --trust
```

Feche e abra o navegador novamente. Para parar o servidor: **Ctrl + C** no terminal.

> O banco `App_Data/livro-circular.db` é criado sozinho na primeira execução (as fotos ficam **dentro do banco**). Não apague `App_Data` se quiser manter os cadastros.
>
> **Atenção (versão 2):** o banco mudou. Se você já rodou a versão anterior, **pare o servidor e apague `App_Data/livro-circular.db`** antes de rodar de novo, senão aparecerão erros de tabela/coluna inexistente.

### 5. Criar o primeiro Administrador (opcional, para ver o painel Equipe)

Defina o e-mail e a senha por _User Secrets_ (não coloque senha no código):

```powershell
dotnet user-secrets init
dotnet user-secrets set "Admin:Email" "admin@exemplo.com"
dotnet user-secrets set "Admin:InitialPassword" "TroqueEstaSenha123"
```

Ao iniciar, a conta é criada com o papel **Administrador**. Ele muda o papel dos demais em **Equipe > Usuários**.

## Como testar o fluxo principal

1. Abra o site e crie uma conta com nome, e-mail, senha (8+ caracteres, com maiúscula, minúscula e número) e CEP válido. Clique em **mostrar** na senha e veja a reação dos livros.
2. Entre em **Anunciar livro**.
3. Escolha **Quero doar** ou **Quero vender**. Para venda, informe o preço.
4. Informe título, autor, categoria, conservação, CEP de origem, peso e medidas.
5. Selecione uma foto real do livro. A foto é obrigatória.
6. Publique o anúncio e confirme que ele aparece no catálogo.
7. Crie uma segunda conta em outro navegador ou janela anônima.
8. Com a segunda conta, encontre o anúncio e clique em **Conversar** ou **Negociar**.
9. Envie mensagens nas duas contas. O histórico fica salvo no SQLite.
10. Para doações, clique em **Ver envio** ou **Calcular envio** no chat e informe o CEP de destino.
11. Com a segunda conta, clique em **Negociar** no chat e informe o CEP de destino. Na primeira conta, abra **Negociações**, aceite e **assine** (nome completo + senha). Assine também com a segunda conta.
12. A vendedora registra o envio; a compradora confirma o recebimento. Em vendas, a compradora pode **pedir devolução** (foto + declaração obrigatórias) dentro de 7 dias (arrependimento) ou 30 dias.
13. Depois da entrega, as duas partes podem **avaliar** a negociação (vale também para doações).
14. Use o sino de notificações para acompanhar cada passo, inclusive em outro aparelho logado na mesma conta.

## Estrutura de pastas

```
LivroCircular_Completo/
├── Controllers/        APIs REST (auth, privacidade, livros, negociações, devoluções, avaliações, denúncias, notificações, equipe...)
├── DTOs/               Contratos de entrada/saída das APIs
├── Data/               AppDbContext (Entity Framework + SQLite)
├── Hubs/               ChatHub (SignalR)
├── Models/             Entidades do banco (usuário, livro, conversa, mensagem)
├── Services/           Contratos, notificações, auditoria, retenção, arquivos, ViaCEP, frete
├── Properties/         launchSettings.json (portas e ambiente)
├── wwwroot/            Frontend
│   ├── index.html
│   ├── css/            site.css (tema), pets.css, extras.css, legal.css, v2.css
│   ├── js/             app.js (aplicação), v2.js (LGPD, contratos, equipe), pets.js (família Circular)
│   └── legal/          Termos, privacidade, cookies, devolução, moderação, retenção, acessibilidade
├── docs/               Imagens e material de apoio da entrega
├── .github/workflows/  Verificação automática de build (GitHub Actions)
├── Program.cs          Configuração do servidor
├── Dockerfile · render.yaml   Hospedagem gratuita (veja docs/HOSPEDAGEM.md)
├── CONTRATO_API.md · DOCUMENTACAO_ARQUITETURA.md · GUIA_GITHUB.md · ENTREGA_CHECKLIST.md · LICENCAS_TERCEIROS.md
└── README.md
```

## Cotação de envio: simulação x valor real

Sem credenciais, a aplicação apresenta duas opções de **simulação acadêmica** (econômica e prioritária). A fórmula considera peso e se os CEPs pertencem ao mesmo estado, à mesma região ou a regiões diferentes. Os valores são ilustrativos, não são preço oficial, prazo garantido nem cotação de transportadora.

Para consultar preços reais, a equipe precisa criar uma aplicação/conta no Melhor Envio, realizar o fluxo de autorização e configurar um token válido. A documentação da API exige CEP de origem, CEP de destino e dados de produtos/volumes; o cabeçalho `User-Agent` também é obrigatório.

Configure o token fora do código-fonte, por exemplo com User Secrets:

```powershell
dotnet user-secrets init
dotnet user-secrets set "Shipping:Token" "COLOQUE_SEU_TOKEN_AQUI"
dotnet user-secrets set "Shipping:BaseUrl" "https://sandbox.melhorenvio.com.br"
dotnet user-secrets set "Shipping:UserAgent" "LivroCircular/1.0 (contato: email-real-da-equipe)"
```

Para produção, só altere `Shipping:BaseUrl` para o ambiente de produção depois de concluir testes e autorização da integração. **Nunca coloque token em `appsettings.json`, JavaScript ou GitHub.**

Links oficiais:
- Cotação de fretes do Melhor Envio: https://docs.melhorenvio.com.br/docs/cotacao-de-fretes
- Referência de cálculo: https://docs.melhorenvio.com.br/reference/calculo-de-fretes-por-produtos
- ViaCEP: https://viacep.com.br/
- Política de suporte .NET: https://dotnet.microsoft.com/pt-br/platform/support/policy/dotnet-core

## Endpoints principais

| Método | Rota | Ação |
|---|---|---|
| POST | `/api/auth/register` | Criar conta e entrar |
| POST | `/api/auth/login` | Entrar |
| GET | `/api/auth/me` | Consultar conta atual |
| POST | `/api/auth/logout` | Sair |
| GET | `/api/livros` | Listar anúncios disponíveis |
| POST | `/api/livros` | Criar anúncio (multipart/form-data; foto obrigatória) |
| PATCH | `/api/livros/{id}/status` | Encerrar anúncio próprio |
| POST | `/api/conversas` | Iniciar conversa com anunciante |
| GET | `/api/conversas` | Listar conversas |
| GET | `/api/conversas/{id}/mensagens` | Consultar histórico |
| POST | `/api/conversas/{id}/mensagens` | Enviar mensagem (fallback) |
| SignalR | `/hubs/chat` | Chat em tempo real |
| POST | `/api/fretes/{bookId}/cotacao` | Cotar/simular envio de doação |
| GET | `/api/cep/{cep}` | Consultar CEP |
| POST/GET | `/api/negociacoes`, `/{id}/aceitar`, `/{id}/assinar`, `/{id}/enviar`, `/{id}/receber`, `/{id}/devolucao` | Negociação, contrato, assinatura, envio e devolução |
| GET/POST | `/api/devolucoes` e `/{id}/resposta`, `/reembolso`, `/confirmar` | Devoluções com evidência |
| POST/GET | `/api/avaliacoes` | Avaliações verificadas |
| POST | `/api/denuncias` | Denunciar conteúdo |
| GET/POST | `/api/notificacoes` | Notificações (também via SignalR) |
| * | `/api/privacidade/...` | Cookies, consentimentos, exportar, excluir conta, descadastro |
| * | `/api/admin/...` | Área da equipe (por papel) |

Contrato completo da versão 2: [`docs/API_V2.md`](docs/API_V2.md).

## Problemas comuns

| Sintoma | Solução |
|---|---|
| `dotnet` não é reconhecido | Instale o .NET 10 SDK e **feche e abra** o terminal/VS Code. |
| `dotnet --version` mostra 8 ou 9 | Instale o SDK 10; o projeto é `net10.0`. |
| Navegador avisa "conexão não é particular" | Rode `dotnet dev-certs https --trust` e reinicie o navegador. |
| "Address already in use" (porta ocupada) | Feche o outro `dotnet` em execução (Ctrl + C) ou mude a porta em `Properties/launchSettings.json`. |
| Página abre sem estilo/letras diferentes | Sem internet as fontes do Google não carregam; o site funciona com a fonte padrão. |
| Chat sem tempo real | Sem internet o SignalR (CDN) não carrega; o chat continua funcionando por consulta periódica (até 3,5 s de atraso). |
| Erro de banco após mudar os modelos (ou ao atualizar para a versão 2) | Pare o servidor e apague `App_Data/livro-circular.db` (será recriado). |
| "Muitas tentativas" no login | Aguarde alguns minutos (proteção contra adivinhação de senha). |

## Observações e limites desta PoC

- O cadastro de usuário é real no banco, mas não há confirmação de e-mail nem recuperação de senha nesta versão acadêmica.
- O chat é restrito às duas pessoas participantes da conversa. Pagamento e compra de etiqueta de envio não são realizados pela plataforma; as partes combinam esses detalhes entre si.
- A foto principal do livro é obrigatória. O sistema aceita um arquivo por anúncio nesta versão.
- O banco é criado com `EnsureCreated` para facilitar a PoC. Para evolução do projeto, recomenda-se migrations versionadas.
- **Nenhum e-mail é enviado nesta versão** (sem confirmação de e-mail nem recuperação de senha). O link de descadastro e o rodapé de e-mail estão prontos no backend para quando um provedor de e-mail for integrado.
- **Não há varredura automática de imagens por IA** (exige serviço contratado). A proteção de menores usa 18+, denúncias e revisão humana. Não há envio automático de dados a autoridades: o Administrador revisa e encaminha.
- **Pagamentos e reembolsos não passam pela plataforma**: as partes combinam, e o reembolso exige comprovante anexado.
- **Planos pagos/assinaturas não existem**; os Termos já registram as regras para o futuro (cancelar no mesmo lugar, aviso de renovação, sem taxa oculta).
- O servidor gratuito dorme após alguns minutos sem acesso, e o disco é temporário (por isso as fotos ficam no banco).
- Este código **não foi compilado nem executado em um ambiente .NET pelo assistente**; rode `dotnet build` e o fluxo do README antes de entregar.
- Antes de uso real: revisão jurídica dos textos, proteção CSRF adicional, backup do banco e migrations.

## Documentos da entrega

- [`DOCUMENTACAO_ARQUITETURA.md`](DOCUMENTACAO_ARQUITETURA.md) — revisita e definição da PoC, jornada, componentes e dados.
- [`CONTRATO_API.md`](CONTRATO_API.md) — contrato resumido da API.
- `docs/telas/` — prints das telas (cadastro com cookies, proposta, contrato, devolução com evidência, notificações, celular e tablet).
- [`docs/API_V2.md`](docs/API_V2.md) — contrato da API da versão 2.
- [`docs/HOSPEDAGEM.md`](docs/HOSPEDAGEM.md) — hospedagem gratuita e bancos online.
- [`docs/RETENCAO_DADOS.md`](docs/RETENCAO_DADOS.md) — por quanto tempo cada dado é guardado.
- [`docs/PLANO_RESPOSTA_INCIDENTES.md`](docs/PLANO_RESPOSTA_INCIDENTES.md) — vazamento de dados e prazo de 3 dias úteis à ANPD.
- [`docs/PROTOCOLO_DENUNCIAS_E_AUTORIDADES.md`](docs/PROTOCOLO_DENUNCIAS_E_AUTORIDADES.md) — denúncias e encaminhamento a autoridades.
- [`LICENCAS_TERCEIROS.md`](LICENCAS_TERCEIROS.md) — licenças de fontes, bibliotecas e imagens.
- [`GUIA_GITHUB.md`](GUIA_GITHUB.md) — como publicar no GitHub e adicionar os integrantes.
- [`ENTREGA_CHECKLIST.md`](ENTREGA_CHECKLIST.md) — conferência da rubrica e roteiro do vídeo de 1 minuto.
