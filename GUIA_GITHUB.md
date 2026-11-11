# Guia do GitHub — do zero até o projeto publicado

Este guia assume que você **nunca usou o GitHub**. Siga na ordem. Tempo estimado: 20 minutos.

> Troque sempre `SEU-USUARIO` e `NOME-DO-REPOSITORIO` pelos seus dados. Sugestão de nome do repositório: `livro-circular`.

---

## Parte 1 — Preparar (uma única vez)

1. **Crie sua conta** em https://github.com/signup (use o mesmo e-mail que vai usar no Git).
2. **Instale o Git:** https://git-scm.com/downloads (pode deixar tudo no padrão e clicar em "Next").
3. **Feche e abra o VS Code**, abra o terminal (**Terminal > Novo Terminal**) e confirme:
   ```powershell
   git --version
   ```
4. **Diga ao Git quem é você.** Use o **mesmo e-mail da conta do GitHub** (é assim que o GitHub reconhece suas contribuições):
   ```powershell
   git config --global user.name "Seu Nome Completo"
   git config --global user.email "seu-email-do-github@exemplo.com"
   ```

---

## Parte 2 — Criar o repositório (a "pasta" do projeto no GitHub)

1. No GitHub, clique no **+** (canto superior direito) → **New repository**.
2. Preencha:
   - **Repository name:** `livro-circular`
   - **Public** (mais simples para o professor abrir) ou **Private** (nesse caso adicione o professor como colaborador, Parte 4).
   - **Não marque** "Add a README", ".gitignore" nem "license" (o projeto já tem).
3. Clique em **Create repository**. Deixe essa página aberta: ela mostra o endereço do repositório, parecido com `https://github.com/SEU-USUARIO/livro-circular.git`.

---

## Parte 3 — Enviar o projeto (primeiro envio)

No VS Code, abra a pasta do projeto (`LivroCircular_Completo`, a que tem o arquivo `LivroCircular.Web.csproj`) e, no terminal, rode **um comando por vez**:

```powershell
git init
git add .
git commit -m "Entrega 2: PoC Livro Circular (frontend, backend e documentacao)"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/livro-circular.git
git push -u origin main
```

O que cada linha faz:

| Comando | Em português |
|---|---|
| `git init` | "Esta pasta agora é um projeto Git." |
| `git add .` | "Prepare todos os arquivos para salvar." (o `.gitignore` já impede de enviar `bin/`, `obj/`, banco e fotos de teste) |
| `git commit -m "..."` | "Salve uma versão com esta descrição." |
| `git branch -M main` | "Chame a linha principal de `main`." |
| `git remote add origin ...` | "O destino na internet é este endereço." |
| `git push -u origin main` | "Envie para o GitHub." |

Na primeira vez, o Git abre uma janela do navegador pedindo para você **entrar no GitHub** e autorizar. Autorize e volte ao terminal.

**Confira:** atualize a página do repositório no GitHub. Você deve ver as pastas `Controllers`, `wwwroot`, `docs` etc. e o README aparecendo embaixo. Se aparecerem `bin` ou `obj`, algo deu errado com o `.gitignore` (veja "Problemas" no fim).

> **Prefere clicar em vez de digitar?** Instale o **GitHub Desktop** (https://desktop.github.com), use *File > Add local repository*, escolha a pasta e clique em *Publish repository*. O resultado é o mesmo.

---

## Parte 4 — Adicionar os integrantes do grupo (exigido pela rubrica)

A rubrica pede **todos os participantes como membros** e **histórico de contribuições de cada um**.

1. No repositório: **Settings** → **Collaborators** → **Add people**.
2. Digite o usuário ou e-mail de cada colega (e do professor, se o repositório for privado) e envie o convite.
3. Cada pessoa **recebe um e-mail e precisa clicar em "Accept invitation"**. Confira em Settings → Collaborators que todos aparecem como membros.

### Como cada integrante deixa sua contribuição no histórico

O histórico aparece quando **cada pessoa faz seus próprios commits com a própria conta**. Cada integrante deve, no próprio computador:

```powershell
git clone https://github.com/SEU-USUARIO/livro-circular.git
cd livro-circular
# ... editar ou criar algo seu (ver sugestões abaixo) ...
git add .
git commit -m "Descreva o que você fez"
git pull --rebase
git push
```

Sugestões de contribuição para cada integrante (algo real do projeto, não "arquivo vazio"):

- Preencher a lista de integrantes e a seção de "Revisita da PoC" com as próprias palavras.
- Incluir prints das telas em `docs/` e legendas no README.
- Testar o fluxo principal e registrar bugs encontrados em **Issues**.
- Gravar e subir o vídeo (`docs/video/`).
- Revisar e corrigir textos da documentação.

**Regra de ouro:** antes de começar a mexer, rode `git pull` (traz o que os colegas fizeram). Antes de terminar, `git push`.

---

## Parte 5 — O vídeo de até 1 minuto

A rubrica aceita **link privado/não listado do YouTube** ou **arquivo MP4 no GitHub**.

- **MP4 no GitHub:** crie a pasta `docs/video/`, coloque o arquivo (até **100 MB**; pelo site do GitHub o envio direto aceita até 25 MB, então use o Git/GitHub Desktop se for maior), faça `git add`, `commit` e `push`.
- **YouTube:** publique como **Não listado** e cole o link no README, na seção "Vídeo de demonstração".

O roteiro pronto está em [`ENTREGA_CHECKLIST.md`](ENTREGA_CHECKLIST.md).

---

## Parte 6 — Como outra pessoa abre o projeto (o que o professor vai fazer)

```powershell
git clone https://github.com/SEU-USUARIO/livro-circular.git
cd livro-circular
dotnet restore
dotnet watch run
```

Depois abra **https://localhost:7284** no navegador. O passo a passo completo (com instalação do .NET) está no [README](README.md#como-executar-passo-a-passo).

> **Importante:** o site **não abre clicando duas vezes em `index.html`**. Ele precisa do servidor .NET rodando, porque o cadastro, o catálogo e o chat dependem da API.

---

## Parte 7 — Atualizações depois do primeiro envio

Sempre que mudar algo:

```powershell
git add .
git commit -m "O que mudou"
git push
```

Veja o histórico em **Commits** na página do repositório e as contribuições em **Insights > Contributors**.

---

## Problemas comuns

| Mensagem / sintoma | O que fazer |
|---|---|
| `git não é reconhecido` | Instale o Git e **feche/abra** o VS Code. |
| `Author identity unknown` | Faltou a Parte 1, passo 4 (`git config --global ...`). |
| `remote origin already exists` | Rode `git remote set-url origin https://github.com/SEU-USUARIO/livro-circular.git`. |
| `failed to push ... fetch first` / `rejected` | Alguém enviou antes de você: `git pull --rebase` e depois `git push`. |
| Pede senha e recusa | O GitHub não aceita a senha da conta no terminal. Entre pela janela do navegador, ou use o GitHub Desktop, ou crie um _Personal Access Token_ em Settings > Developer settings. |
| Subiu `bin/` ou `obj/` | Rode `git rm -r --cached bin obj`, depois `git commit -m "Remove arquivos gerados"` e `git push`. |
| Minhas contribuições não aparecem no gráfico | O e-mail do `git config` precisa ser o mesmo cadastrado na conta do GitHub (Settings > Emails). |
| Arquivo maior que 100 MB | O GitHub recusa. Para o vídeo, use YouTube não listado ou reduza o arquivo. |
| Subi algo que não devia (senha, token) | Troque a senha/token **imediatamente** (apagar o arquivo não apaga o histórico). Nunca coloque tokens no código; veja o README sobre _User Secrets_. |
