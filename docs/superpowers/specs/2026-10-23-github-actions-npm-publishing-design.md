# CI/CD do GitHub para publicação no npm

## Intenção

Publicar `@1e99/components` pelo GitHub Actions, mantendo validações antes de
cada release e evitando que uma credencial de escrita seja mantida depois do
bootstrap inicial. O repositório remoto é `https://github.com/1e99/components.git`
e a publicação pública inicial será `0.1.0`.

## Abordagens consideradas

1. Token npm permanente no GitHub: simples, mas expõe uma credencial de escrita
   duradoura e exige rotação manual. Não será usado.
2. Bootstrap manual, depois OIDC: não exige token no GitHub, mas não atende ao
   objetivo de realizar a primeira publicação pelo CI.
3. Token granular temporário no primeiro release, seguido de Trusted Publishing
   por OIDC: escolhido. A primeira tag publica pelo CI; depois de configurar a
   confiança no pacote publicado, o token é revogado e as próximas tags usam
   credenciais efêmeras do GitHub Actions.

## Fluxo

- `.github/workflows/ci.yml` será executado em pull requests para `main` e em
  pushes para `main`; ele executará `pnpm lint`, `pnpm typecheck`, `pnpm test`,
  `pnpm build`, `pnpm build-storybook` e `npm pack --dry-run`.
- `.github/workflows/publish.yml` será executado apenas em tags `v*`. Ele
  confirma que a tag é exatamente `v${package.json.version}`, repete as
  verificações de release e executa `npm publish`.
- Os dois workflows usarão runner hospedado do GitHub, Node 24 e a versão de
  pnpm declarada em `packageManager`, habilitada por Corepack.
- O workflow de publicação receberá apenas `contents: read` e `id-token: write`.
  `NODE_AUTH_TOKEN` virá opcionalmente de `secrets.NPM_TOKEN`: na primeira tag
  é o token granular temporário; depois de configurar Trusted Publishing, o
  secret será removido e o npm usará OIDC automaticamente.
- `package.json` receberá `repository`, apontando ao remote GitHub, requisito
  para vincular a identidade do repositório à publicação confiável.

## Proteções e limites

- Nenhum token será escrito no repositório, nas actions ou na documentação.
- A tag e a versão precisam corresponder para impedir uma publicação acidental
  de versão diferente daquela que foi revisada.
- A publicação continua pública por meio de `publishConfig.access: public`.
- O escopo não altera consumidores, componentes nem API do pacote.
- Não haverá push, tag ou publicação realizados pelo agente; a pessoa
  responsável cria o secret, envia os commits e cria a tag de release.

## Ações necessárias da pessoa responsável

1. Criar no npm um granular access token com escopo de escrita somente para
   `@1e99/components`, prazo curto e bypass de 2FA; nunca enviá-lo por chat.
2. Criar o secret `NPM_TOKEN` no repositório GitHub `1e99/components` com esse
   valor.
3. Após o primeiro release pelo Actions, configurar no npm Trusted Publisher
   para GitHub Actions: organização `1e99`, repositório `components`, arquivo
   `publish.yml` e permissão de publicação direta.
4. Remover o secret `NPM_TOKEN` no GitHub e revogar o token granular no npm.
5. Para cada release posterior, atualizar a versão, enviar `main`, criar a tag
   correspondente e enviá-la ao GitHub.
