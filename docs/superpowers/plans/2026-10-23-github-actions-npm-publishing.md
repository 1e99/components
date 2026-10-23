# GitHub Actions npm Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Validar o pacote no GitHub e publicar versões públicas no npm a partir de tags `vX.Y.Z`, migrando do token temporário inicial para Trusted Publishing por OIDC.

**Architecture:** Um workflow de CI protege `main` e pull requests com as mesmas verificações locais do pacote. Um workflow de publicação independente é acionado apenas por tags, valida a correspondência entre tag e `package.json`, repete a validação e executa `npm publish`; no primeiro release ele usa o secret opcional `NPM_TOKEN` e, após o vínculo de confiança no npm, usa OIDC sem secret.

**Tech Stack:** GitHub Actions, GitHub-hosted Ubuntu runner, Node 24, Corepack, pnpm 12.9.1, npm registry e npm Trusted Publishing/OIDC.

**Spec:** `docs/superpowers/specs/2026-10-23-github-actions-npm-publishing-design.md`

## Global Constraints

- Trabalhar diretamente na `main`, conforme autorização explícita do usuário; não fazer push, criar tags ou publicar durante a implementação.
- Nunca gravar, imprimir ou solicitar o valor de `NPM_TOKEN`; ele é um secret já configurado no GitHub.
- Usar o remote exato `https://github.com/1e99/components.git` no metadado `repository`.
- O CI executa `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm build-storybook` e `npm pack --dry-run`.
- O CD é ativado somente por `v*`, exige tag igual a `v${package.json.version}` em um commit ancestral de `main`, preserva `publishConfig.access: public` e executa `npm publish` sem `--provenance` manual.
- O job de publicação recebe somente `contents: read` e `id-token: write`, baixa um artefato já verificado e não instala nem executa o projeto; o token tradicional é transição para o primeiro publish e será removido após Trusted Publishing.
- Fixar actions de terceiros nos SHAs revisados e configurar regras do GitHub para proteger `main` e tags `v*`.
- Não alterar componentes, APIs, consumidores nem a versão nesta tarefa.

## Review Focus

- Uma tag como `v0.1.1` com `package.json` em `0.1.0`, ou fora do histórico de `main`, deve falhar antes do publish; cobrir na Task 2 pela validação explícita da tag e ancestralidade.
- Um push comum em `main` ou uma pull request deve executar CI, mas nunca publicar; cobrir na Task 1 por gatilhos separados.
- A ausência futura de `NPM_TOKEN` não pode bloquear Trusted Publishing; cobrir na Task 2 deixando o secret opcional e mantendo `id-token: write`.
- O artefato publicado deve continuar limitado aos arquivos da configuração `files`; cobrir em ambas as pipelines com `npm pack --dry-run`.
- O workflow deve referenciar o mesmo repositório e nome de arquivo usados no formulário npm Trusted Publisher; cobrir na Task 3 com instruções literais.

---

## Estrutura de arquivos

- `.github/workflows/ci.yml`: validação em pull requests e pushes para `main`.
- `.github/workflows/publish.yml`: validação e publicação por tag versionada.
- `package.json`: metadado `repository` do GitHub para a identidade da publicação confiável.
- `README.md` e `docs/architecture.md`: operação da release inicial e migração para OIDC.

### Task 1: Adicionar metadado do repositório e CI de validação

**Files:**

- Create: `.github/workflows/ci.yml`
- Modify: `package.json`

**Interfaces:**

- Consumes: scripts existentes de `package.json`, `pnpm-lock.yaml` e remote `https://github.com/1e99/components.git`.
- Produces: workflow `CI` para `pull_request` e `push` em `main`, e metadado npm `repository` que a Task 2 e o Trusted Publisher consomem.

- [ ] **Step 1: Escrever a especificação executável do workflow.**

  Criar `.github/workflows/ci.yml` com os gatilhos `pull_request` e `push` restritos a `main`; definir um único job em `ubuntu-latest`, checkout, Node 24, `corepack enable`, `pnpm install --frozen-lockfile`, e os seis comandos de validação globais na ordem definida.

- [ ] **Step 2: Validar a sintaxe e a superfície do CI.**

  Run: `go run github.com/rhysd/actionlint/cmd/actionlint@latest .github/workflows/ci.yml`

  Expected: PASS; o linter aceita os gatilhos e todas as expressões GitHub Actions.

- [ ] **Step 3: Adicionar a identidade do repositório ao pacote.**

  Em `package.json`, adicionar `repository` como objeto Git com URL exatamente `https://github.com/1e99/components.git`, sem alterar `name`, `version`, `files` ou `publishConfig`.

- [ ] **Step 4: Executar a verificação local do pacote.**

  Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && npm pack --dry-run`

  Expected: PASS e o tarball continua contendo somente `dist`, `README.md` e `package.json`.

- [ ] **Step 5: Fazer micro-commit do CI.**

  ```bash
  git add .github/workflows/ci.yml package.json
  git commit -m "ci: validate package on GitHub"
  ```

### Task 2: Adicionar publicação por tag com token temporário e OIDC

**Files:**

- Create: `.github/workflows/publish.yml`

**Interfaces:**

- Consumes: `repository` da Task 1, os scripts existentes, `secrets.NPM_TOKEN` temporário e o futuro vínculo npm Trusted Publisher para `1e99/components` / `publish.yml`.
- Produces: workflow `Publish package` que aceita tags `v*`, exige versão correspondente e publica `@1e99/components` publicamente.

- [ ] **Step 1: Escrever a validação de tag antes da publicação.**

  Em `.github/workflows/publish.yml`, definir `on.push.tags: ['v*']` e uma etapa
  shell no job sem OIDC que falha se `GITHUB_REF_NAME` for diferente de
  `v$(node -p "require('./package.json').version")` ou se o commit da tag não
  for ancestral de `origin/main`.

- [ ] **Step 2: Validar que o workflow é aceito e não usa token fixo no YAML.**

  Run: `go run github.com/rhysd/actionlint/cmd/actionlint@latest .github/workflows/publish.yml && ! rg -n "npm_[A-Za-z0-9]+|NPM_TOKEN: [A-Za-z0-9]" .github/workflows`

  Expected: PASS; somente a referência `${{ secrets.NPM_TOKEN }}` é permitida, sem valor secreto.

- [ ] **Step 3: Implementar o job de release.**

  No job sem OIDC, repetir checkout, Node 24, Corepack, instalação congelada e
  todas as validações do CI; gerar e enviar o tarball como artefato. Em job
  separado, fixar os actions por SHA, baixar o artefato, atribuir
  `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` apenas à configuração condicional
  do bootstrap e executar `npm publish` com `id-token: write`. Assim o primeiro
  release usa o secret e os seguintes usam OIDC.

- [ ] **Step 4: Executar a verificação local equivalente ao release.**

  Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm build-storybook && npm pack --dry-run`

  Expected: PASS; nenhuma publicação, tag ou push ocorre localmente.

- [ ] **Step 5: Fazer micro-commit do CD.**

  ```bash
  git add .github/workflows/publish.yml
  git commit -m "ci: publish npm package from version tags"
  ```

### Task 3: Documentar a operação de release e migração OIDC

**Files:**

- Modify: `README.md`
- Modify: `docs/architecture.md`

**Interfaces:**

- Consumes: nomes de workflow e repository definidos nas Tasks 1 e 2.
- Produces: instruções copiáveis para configurar o secret inicial, enviar `main`, criar tags correspondentes e substituir o token por Trusted Publishing.

- [ ] **Step 1: Documentar o bootstrap seguro.**

  Atualizar as seções de publicação para explicar o granular token temporário com bypass de 2FA, o secret `NPM_TOKEN`, a tag `v<version>` e o comando de push da tag; proibir expor o token no repositório ou em chat.

- [ ] **Step 2: Documentar a migração pós-primeiro release.**

  Registrar os valores literais do formulário npm Trusted Publisher: organização `1e99`, repositório `components`, arquivo `publish.yml`, permissão de publicação direta; instruir remover o secret e revogar o token após validar OIDC.

- [ ] **Step 3: Verificar links e nomenclatura operacional.**

  Run: `rg -n "NPM_TOKEN|publish\.yml|Trusted Publisher|v<version>|1e99/components" README.md docs/architecture.md`

  Expected: todas as referências operacionais usam os mesmos nomes das Tasks 1 e 2.

- [ ] **Step 4: Fazer micro-commit da documentação.**

  ```bash
  git add README.md docs/architecture.md
  git commit -m "docs: explain GitHub npm releases"
  ```
