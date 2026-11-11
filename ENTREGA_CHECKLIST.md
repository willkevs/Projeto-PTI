# Checklist da 2ª entrega — Projeto Integrador (PoC)

**Prazo:** 23/11/2026 até 23h59 (horário de Brasília). Não deixe para a última hora.
Pontuação conforme a rubrica do enunciado: **10,0 pontos**.

## 1. Conferência da rubrica

| # | Item da rubrica | Pontos (total / parcial) | Onde está comprovado neste projeto | Pronto? |
|---|---|---|---|---|
| 1 | Revisitar o projeto e **definir a PoC** (revisita justificada) | 1,0 / 0,5 | `DOCUMENTACAO_ARQUITETURA.md` → "Revisita do projeto e definição da PoC". **O grupo deve ler e ajustar com as próprias palavras.** | ☐ |
| 2 | **Preparação do ambiente** (stack definida, servidor pronto, repositórios) | 2,0 / 1,0 | Stack no README (.NET 10, SQLite, JS puro); `LivroCircular.Web.csproj`; `Properties/launchSettings.json`; `.github/workflows/build.yml` (build automático no GitHub) | ☐ |
| 3 | **Frontend** funcional (interface + UX da jornada escolhida) | 2,0 / 1,0 | `wwwroot/` — telas de acesso, catálogo, anunciar livro, conversas, conta; responsivo; personagens interativos | ☐ |
| 4 | **Backend** e dados integrados (lógica, APIs, repositório de dados) | 2,0 / 1,0 | `Controllers/`, `Data/`, `Models/`, `Hubs/`, `Services/`; SQLite; `CONTRATO_API.md` | ☐ |
| 5 | **Vídeo** de no máximo 1 minuto mostrando o projeto funcionando | 1,0 / 0,5 | Roteiro abaixo; arquivo em `docs/video/` **ou** link do YouTube (não listado) no README | ☐ |
| 6 | **GitHub** com todo o código, integrantes como membros, README e instruções de execução | 2,0 / 1,0 | `GUIA_GITHUB.md`; README com passo a passo | ☐ |

**Para pontuar "atende totalmente":** revisita justificada · projeto funcionando · vídeo produzido · GitHub com todos os itens solicitados.

## 2. Antes de entregar (faça nesta ordem)

- [ ] **Apagar `App_Data/livro-circular.db`** (o banco mudou na versão 2), rodar `dotnet build` sem erros e `dotnet watch run`; abrir https://localhost:7284.
- [ ] Preencher os campos entre colchetes nas páginas `wwwroot/legal/` e rever os textos com um(a) advogado(a) ou professor(a).
- [ ] (Opcional) Publicar no Render com Neon/Supabase seguindo `docs/HOSPEDAGEM.md`.
- [ ] Executar o fluxo do README ("Como testar o fluxo principal") com duas contas.
- [ ] Conferir o site no computador **e** no celular/tablet (F12 → ícone de celular no navegador).
- [ ] Preencher **Integrantes** no README (nome + usuário do GitHub).
- [ ] Ler e ajustar a seção de revisita da PoC.
- [ ] Publicar no GitHub (`GUIA_GITHUB.md`, partes 2 e 3).
- [ ] Adicionar **todos** os integrantes como colaboradores e confirmar que aceitaram o convite.
- [ ] Cada integrante fazer ao menos um commit real com a própria conta (histórico de contribuições).
- [ ] Gravar o vídeo (≤ 1 min) e subir (MP4 em `docs/video/` ou YouTube não listado + link no README).
- [ ] Abrir o repositório numa janela anônima (ou pedir a um colega) para confirmar que README, código e vídeo estão acessíveis.
- [ ] Entregar o **link do repositório** na plataforma (Blackboard), seguindo o template da 2ª entrega.

## 3. Roteiro do vídeo (até 60 segundos)

Dica: grave a tela do computador (Windows: **Win + G** ou OBS Studio; Mac: **Shift + Cmd + 5**) com duas janelas do navegador abertas (uma normal e uma anônima). Fale devagar e simples; não precisa ser profissional. Ensaie uma vez com o cronômetro.

| Tempo | O que mostrar | O que falar (sugestão) |
|---|---|---|
| 0–8 s | Tela inicial com a família Circular | "Este é o Livro Circular, plataforma para doar e vender livros na comunidade. Nossa PoC valida a jornada da Maria, doadora de livros." |
| 8–20 s | Cadastro: digitar a senha, clicar em **mostrar** (livros reagem) | "A Maria cria a conta. Os livros-pet interagem: tentam espiar a senha e reagem quando ela é mostrada." |
| 20–38 s | **Anunciar livro**: doação, título, categoria, foto, publicar | "Ela anuncia um livro para doação, com foto obrigatória do estado de conservação. O backend valida, salva a imagem e grava no SQLite." |
| 38–50 s | Janela anônima: outra conta, catálogo, **Conversar**, enviar mensagem | "Outra pessoa encontra o livro no catálogo e inicia uma conversa em tempo real com a doadora." |
| 50–60 s | **Ver envio** (simulação) e fechar no catálogo | "Para doações há simulação de frete por CEP. Tudo está no GitHub com instruções de execução. Obrigado!" |

## 4. Se o grupo quiser pontuar mais alto na apresentação (opcional)

- Prints das telas (computador e celular) em `docs/` com legenda no README.
- Uma seção "Lições aprendidas" e "Próximos passos" no README.
- Issues abertas no GitHub para melhorias futuras (mostra gestão do projeto).
