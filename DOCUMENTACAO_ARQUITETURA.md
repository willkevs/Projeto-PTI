# Livro Circular — arquitetura e jornada da PoC

## Objetivo

Ajudar pessoas da comunidade a colocar livros em circulação por meio de doações e vendas, facilitando o encontro entre quem anuncia um exemplar e quem deseja recebê-lo.

## Jornada principal: Maria, doadora de livros

1. Maria entra no site e cria sua conta com nome, e-mail, senha e CEP.
2. Acessa a área autenticada e escolhe anunciar um livro.
3. Seleciona doação ou venda, preenche título, autor, categoria e estado de conservação.
4. Anexa uma foto obrigatória para demonstrar a condição real do exemplar.
5. Informa o CEP de origem, o peso e as dimensões aproximadas do pacote.
6. O backend valida os dados, salva a imagem e grava o anúncio no SQLite.
7. O livro aparece no catálogo para usuários autenticados.
8. Uma pessoa interessada inicia uma conversa com a anunciante.
9. Para doações, as pessoas podem consultar opções ilustrativas de envio ou uma cotação real se a equipe configurar o Melhor Envio. Para vendas, usam o chat para negociar preço e entrega.

## Componentes

- **Frontend web:** HTML, CSS e JavaScript em `wwwroot`.
- **Backend:** ASP.NET Core Web API em C#.
- **Autenticação:** ASP.NET Core Identity, com senha armazenada por hash e cookie HttpOnly.
- **Persistência:** Entity Framework Core e SQLite.
- **Mensagens:** SignalR com histórico persistido no banco e endpoint REST de contingência.
- **CEP:** ViaCEP para resolver cidade e UF.
- **Frete:** Melhor Envio opcional para cotação real; sem token, simulação acadêmica explicitamente rotulada.

## Dados armazenados

- Usuários: nome, e-mail, CEP, hash de senha e data de criação.
- Livros: dados bibliográficos, tipo do anúncio, preço quando for venda, conservação, CEP, medidas, peso, caminho da foto, dono, status e data.
- Conversas: livro relacionado, anunciante, pessoa interessada e datas.
- Mensagens: conversa, remetente, conteúdo e data/hora.

## Delimitação da prova de conceito

O centro da PoC continua sendo validar a jornada de cadastro e disponibilização de um livro. Contas, busca, chat e frete complementam a demonstração do ciclo comunitário, mas o sistema não processa pagamentos, não compra etiquetas e não realiza autenticação de endereço. O envio e o pagamento são combinados entre os usuários.

## Revisita do projeto e definição da PoC (2ª etapa)

> Texto-base preparado a partir da documentação existente. **O grupo deve conferir e ajustar com suas próprias palavras antes de entregar.**

**Projeto revisitado:** plataforma comunitária para doar, vender e encontrar livros, com cadastro, anúncios com foto, busca, chat e orientação de envio.

**Onde está o maior risco?** Em provar que a jornada central funciona de ponta a ponta com dados reais: uma pessoa se cadastra com segurança, anuncia um livro com a foto obrigatória do estado de conservação (arquivo validado, salvo e exibido) e outra pessoa consegue encontrá-lo e conversar. Pagamento, etiqueta de envio e verificação de endereço são integrações pesadas e **não** são necessárias para provar o conceito.

**PoC escolhida (jornada única):** _"Maria cria sua conta, anuncia um livro para doação ou venda com foto, e o livro aparece no catálogo para pessoas autenticadas."_ Conversa e simulação de frete entram como complemento para mostrar o ciclo comunitário.

**Critério de sucesso da PoC:** uma pessoa nova consegue, em menos de 3 minutos e sem ajuda, criar a conta, publicar um livro com foto e ver o anúncio no catálogo; uma segunda conta consegue iniciar a conversa.

**Fora do escopo (decisão consciente):** pagamento, compra de etiqueta, confirmação de e-mail, recuperação de senha, moderação de conteúdo e aplicativo nativo.

**Melhoria de experiência incluída na PoC:** a família Circular (três livros-pet) guia a pessoa nas telas de acesso e de anúncio, reforçando o tom comunitário e acolhedor do produto e tornando o formulário menos intimidador.

## Decisões técnicas e riscos previstos

| Tema | Decisão | Risco previsto e mitigação |
|---|---|---|
| Banco | SQLite com `EnsureCreated` | Não há versionamento de esquema: ao mudar modelos, recriar o `.db` (dev). Evoluir para migrations antes de produção. |
| Datas | Gravadas em UTC; conversor garante `Kind=Utc` | Evita horário deslocado no navegador. |
| Senhas | ASP.NET Core Identity (hash) + bloqueio após 5 falhas + limite por IP | Ajustar limites conforme o uso real. |
| Imagens | Validação de extensão **e** assinatura do arquivo; limite de 5 MB | Em produção, mover para armazenamento externo e antivírus. |
| Conversas | Índice único (livro + interessado) e tratamento de clique duplo | Evita conversas duplicadas. |
| Chat | SignalR com alternativa por consulta periódica | Se o CDN do SignalR falhar, o chat segue funcionando com atraso de até 3,5 s. |
| Frontend | JavaScript puro, sem framework | Simples de rodar; se o projeto crescer, considerar componentização. |
