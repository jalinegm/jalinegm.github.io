# Portfólio: Jaline Gonçalves Mombach

Site institucional e profissional de **Jaline Gonçalves Mombach**, docente do Instituto Federal Farroupilha (IFFar), com atuação em interação humano-computador (IHC), interação criança-computador (CCI), acessibilidade e dados educacionais.

- Publicação prevista: `https://jalinegm.github.io/` (GitHub Pages), ainda não publicado.
- Idioma: português (`pt-BR`). A estrutura está pronta para uma versão em inglês, que ainda não existe.
- Especificação: `docs/superpowers/specs/2026-10-12-portfolio-design.md`
- Plano de implementação: `docs/superpowers/plans/2026-10-12-portfolio-implementation.md`

## Enquadramento

O site é um portfólio acadêmico e institucional. A autora é docente em regime de Dedicação Exclusiva, então o texto não pode soar como oferta de serviços, consultoria ou trabalho sob demanda.

Termos proibidos em qualquer texto do site (títulos, chamadas, metadados, textos alternativos), em português e inglês, sem diferenciar maiúsculas e acentos:

`consultoria`, `consultora`, `contratar`, `contrate`, `cliente`, `serviço`, `serviços`, `orçamento`, `freelance`, `hire`.

Termos permitidos: "atuação profissional", "colaboração", "parcerias institucionais", "projetos interinstitucionais", "convites para palestras e bancas".

O teste `tests/forbidden-words.test.ts` procura esses termos em todo HTML gerado em `dist/` e reprova o build se encontrar algum. Há uma única exceção documentada: um título de publicação de terceiros que usa "produto-serviço" como termo técnico.

Fatos que não puderam ser verificados ficam marcados no código com `<!-- REVISAR: ... -->` (ver "Pendências de revisão humana").

## Stack

- **Astro 5** (saída estática, sem JavaScript no cliente por padrão), TypeScript, **Zod** para validar conteúdo e dados.
- Pequenas ilhas em TypeScript puro para filtros, alternância de tema e botões de copiar.
- **Vitest** (testes unitários e verificações sobre `dist/`) e **pytest** (testes dos scripts Python).
- **Python 3.12** com PyYAML e PyMuPDF para sincronizar dados e comprimir PDFs.
- **Playwright** com `@axe-core/playwright` (e2e e acessibilidade), **html-validate** e **@lhci/cli** (Lighthouse CI).
- **GitHub Actions** para CI e publicação.

## Estrutura

```
data/
  lattes/5793944765294091.xml     Currículo Lattes (ISO-8859-1), fonte das publicações e da formação
  repos-curadoria.yaml            Curadoria manual dos repositórios (sobrepõe a API)
  publicacoes-curadoria.yaml      Ajustes manuais de tema das publicações
scripts/
  lattes.py                       XML -> src/data/lattes.json
  repos.py                        gh CLI -> src/data/repos.json e public/repos/
  compress_pdfs.py                PDFs originais -> public/docs/ (menos de 10 MB cada)
  tests/                          Testes pytest dos scripts
src/
  content/casos/                  Estudos de caso (.md)
  content/pesquisa/               Tese e dissertação (.md)
  content/paginas/                Dados estáticos (.yaml)
  content.config.ts               Esquemas Zod das coleções
  data/                           JSON gerados pelos scripts (versionados)
  components/, layouts/, pages/   Interface
  i18n/pt.json, i18n/index.ts     Textos da interface, lidos pela função t(chave)
  lib/                            Funções puras (citações, filtros, dados)
  styles/tokens.css, global.css   Tokens de cor, espaçamento e foco
tests/
  unit/                           Vitest
  e2e/                            Playwright + axe (acessibilidade, teclado, reflow, filtros)
  forbidden-words.test.ts         Termos proibidos em dist/
  links.test.ts                   Links internos quebrados
public/
  docs/                           PDFs comprimidos (tese e dissertação)
  repos/                          Imagens dos repositórios
.github/workflows/
  ci.yml                          Testes e build em pull requests e pushes
  deploy.yml                      Testes e publicação no GitHub Pages (push na main)
lighthouserc.json                 Limiares do Lighthouse CI
```

## Configuração local

Requisitos: Node 24 e Python 3.12.

```bash
npm ci

python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt   # no Git Bash: .venv/Scripts/python.exe
```

Os scripts Python rodam **localmente pelo ambiente virtual**, com o modo isolado do interpretador:

```bash
.venv/Scripts/python.exe -I scripts/lattes.py
.venv/Scripts/python.exe -I scripts/repos.py
.venv/Scripts/python.exe -I scripts/compress_pdfs.py
```

O `python -I` do sistema não tem os pacotes instalados. Por isso `npm run sync` só funciona se o `python` do PATH for o do `.venv` com os requisitos instalados. Caso contrário, execute os dois comandos acima diretamente.

No CI, o Python 3.12 é instalado com `actions/setup-python` e só roda os testes dos scripts (`python -m pytest scripts/tests`). O CI nunca executa a sincronização.

Desenvolvimento: `npm run dev` (http://localhost:4321).

## Scripts npm

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento do Astro |
| `npm run build` | `astro check` (tipos) e `astro build` (gera `dist/`) |
| `npm run sync` | Executa `lattes.py` e `repos.py` com o `python` do PATH (ver acima) |
| `npm run test:unit` | Vitest: unitários e verificações sobre `dist/` |
| `npm run test:html` | html-validate em `dist/` |
| `npm run test:e2e` | Playwright contra `astro preview` (usa `dist/`) |
| `npm run test:lh` | Lighthouse CI sobre `dist/` (exige build antes) |
| `npm test` | `build` + `test:unit` + `test:html` + `test:e2e` |

`compress_pdfs.py` aceita `--dpi` (padrão 150).

## Sincronização de dados

- **Lattes** (`scripts/lattes.py`): lê `data/lattes/5793944765294091.xml`, decodifica ISO-8859-1, converte entidades HTML nos títulos, corrige `?` usados como apóstrofo ou travessão, classifica por tema e aplica `data/publicacoes-curadoria.yaml`. Gera `src/data/lattes.json`.
- **Repositórios** (`scripts/repos.py`): usa o `gh` local autenticado como `jalinegm` (que enxerga repositórios privados). Requer `gh auth login` antes. Baixa a primeira imagem pública do README para `public/repos/`. Repositórios privados nunca têm imagem baixada nem URL exposta. Gera `src/data/repos.json`.

As saídas são determinísticas: chaves ordenadas, listas em ordem estável, UTF-8 sem BOM, quebras de linha `\n`. Rodar a sincronização de novo sem mudanças nas fontes não deve gerar diferenças no Git.

Não há tokens no repositório nem em segredos do CI. A sincronização roda na máquina da autora e os resultados são versionados.

## Curadoria

**Repositórios** (`data/repos-curadoria.yaml`), chave = nome do repositório no GitHub. Campos aceitos: `descricao`, `tema`, `destaque`, `grupo` (`didatico` ou `null`), `ocultar`, `alt` (texto alternativo da imagem), `revisar`. A curadoria tem precedência sobre a descrição da API. Use `revisar: true` para textos a conferir. Repositórios de estudo de caso recebem `destaque: true`.

```yaml
meu-repo:
  descricao: "Texto curado em português, sem termos proibidos."
  destaque: true
  revisar: true
```

**Publicações** (`data/publicacoes-curadoria.yaml`), chave = DOI em minúsculas ou slug do título. Campo aceito: `tema` (`alfabetizacao-cci`, `acessibilidade`, `educacao-computacao`, `dados-educacionais` ou `outros`).

**Estudos de caso** (`src/content/casos/<slug>.md`): frontmatter com `titulo`, `slug`, `vinculo`, `periodo` (opcional), `resumo`, `tecnologias`, `repos` (nomes dos repositórios), `destaque`, `ordem` e `tese` (opcional). O corpo é Markdown com as seções do caso.

**Pesquisa** (`src/content/pesquisa/<slug>.md`): frontmatter com `titulo`, `slug`, `ordem`, `resumo`, `pdf` (`href` começando com `/docs/`, `formato: PDF`, `tamanho` no formato `"7,5 MB"`), `repositorioUrl`, `publicacoesDerivadas` e `midia`.

**Páginas de dados** (`src/content/paginas/*.yaml`): hoje só `formacao-extra.yaml`.

Os esquemas Zod em `src/content.config.ts` reprovam o build quando um campo obrigatório falta. Ao criar um caso novo, rode `npm run build` para validar.

Para adicionar um PDF: coloque o original na raiz do projeto (ele fica fora do Git pelo `.gitignore`), rode `compress_pdfs.py` e confira o tamanho impresso no terminal.

## Testes

`npm test` é o portão antes de publicar. Ele roda, nesta ordem: `astro check` e `astro build`, Vitest, html-validate e Playwright. O Playwright usa `dist/` e tem suítes em `tests/e2e/`:

- `a11y.spec.ts`: axe-core em todas as páginas, com as tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` e `wcag22aa`, nos dois temas;
- `keyboard.spec.ts`: navegação por teclado, foco visível e link de pular;
- `reflow.spec.ts`: reflow em 320 px, sem rolagem horizontal;
- `filtros.spec.ts` e `projetos.spec.ts`: filtros e listas de projetos.

Também há `tests/forbidden-words.test.ts` (termos proibidos) e `tests/links.test.ts` (links internos).

A regra `long-title` do html-validate está desativada de propósito (`.htmlvalidate.json`), porque títulos oficiais de trabalhos são longos.

**Lighthouse CI** (`npm run test:lh`): acessibilidade = 100 e boas práticas, desempenho e SEO ≥ 95, nas páginas principais. Na execução local, o `@lhci/cli` procura o Chrome instalado. Se não encontrar, defina `CHROME_PATH` (por exemplo, `C:\Program Files\Google\Chrome\Application\chrome.exe`). Extensões e programas de segurança que injetam scripts na página (por exemplo, Kaspersky) podem reduzir as notas. Para medir com precisão, use uma janela anônima sem extensões.

### Checklist manual antes do lançamento

Não é automatizado. Faça estes testes em dispositivos reais e registre o resultado:

- [ ] NVDA com Firefox: ordem de leitura, títulos, marcos de página, rótulos dos filtros e anúncio de "N publicações encontradas".
- [ ] TalkBack no Android (Chrome): navegação por títulos, menu, filtros e botões de copiar.
- [ ] Zoom de 200% no navegador (Chrome e Firefox): nenhum conteúdo cortado, nenhuma rolagem horizontal.
- [ ] Passagem só com teclado por todas as páginas: foco visível em todos os controles e link "Pular para o conteúdo" funcionando.
- [ ] Sem JavaScript (desativado no navegador): publicações e repositórios visíveis e navegação funcional.
- [ ] Tema claro, escuro e o tema seguido do sistema: contraste dos textos e dos focos.
- [ ] Pendências de revisão humana (lista abaixo) resolvidas ou aceitas.

## Pendências de revisão humana

Marcadores `REVISAR` no código-fonte: **23 ocorrências em 13 arquivos**. Para regenerar a lista:

```bash
grep -rn "REVISAR" src data
```

| Arquivo | Ocorrências | Pendência |
|---|---|---|
| `src/content/casos/alcance-global-citacoes.md` | 2 | Período dos dados consultados, números de artigos e países, e descrição do repositório sem README |
| `src/content/casos/automacao-academico-regulatoria.md` | 2 | Métricas de tempo economizado não verificadas; repositórios de migração do Censup sem README |
| `src/content/casos/cecate-nordeste.md` | 1 | Nenhum resultado quantitativo verificado |
| `src/content/casos/clat.md` | 2 | Uso continuado do CLATPro após a tese; repositório de código a vincular |
| `src/content/casos/identificador-cedulas.md` | 1 | Disponibilidade do código e publicação na loja Android |
| `src/content/casos/paineis-pnp-indicadores.md` | 2 | Impacto na gestão não verificado; citação do artigoJLL antes da publicação |
| `src/content/paginas/formacao-extra.yaml` | 2 | Ano de início (`ano_inicio: null`) em dois itens |
| `src/content/pesquisa/dissertacao.md` | 1 | Título no SBIE 2013 (Lattes) |
| `src/content/pesquisa/tese-clat.md` | 3 | Título da capa do PDF; periódico em processo de revisão; link do YouTube não conferido |
| `src/pages/acessibilidade.astro` | 2 | Data da última revisão; medidas dependem dos testes automatizados |
| `src/pages/index.astro` | 1 | Ano de início do IFFar no bloco 3 |
| `src/pages/projetos/index.astro` | 1 | Contagem de descrições pendentes (comentário gerado no build) |
| `src/pages/sobre.astro` | 3 | Ano de início como professora; nome do orientador do doutorado; cargo e período no PixelLab (UFG) |

Além disso, há pendências de conteúdo dos repositórios: `data/repos-curadoria.yaml` tem três entradas com `revisar: true`, e o último `npm run sync` marcou 58 repositórios com descrição a revisar (texto vindo do GitHub ou sem texto curado em português). A página de projetos mostra esse número no comentário `REVISAR` gerado no build.

## Decisões sobre dependências (`npm audit`)

Estado atual: 21 vulnerabilidades reportadas pelo npm, incluindo dependências de desenvolvimento. No escopo de produção (`npm audit --omit=dev`), são 3: `astro` (crítica), `sharp` (alta) e `esbuild` (baixa).

- **`astro` 5.18.2 (produção).** Os avisos afetam versões 5.x e 6.x anteriores às correções, e o aviso crítico é uma execução remota de código pela otimização de imagens AVIF (corrigido a partir de 7.2.8). A versão indicada pelo npm é o Astro 7.3.8, uma mudança com quebra de compatibilidade. **Decisão pendente**: migrar para o Astro 7 antes da publicação. O site publicado é estático, mas o `sharp` e a otimização de imagens rodam no build, inclusive no CI.
- **`sharp`** (produção): vulnerabilidades herdadas da libvips e do libheif, corrigidas em versões posteriores. Vem junto com o Astro.
- **`esbuild`** (produção, indireto): aviso de leitura arbitrária de arquivos pelo servidor de desenvolvimento no Windows. Não afeta o build publicado. Evite `npm run dev` em redes não confiáveis.
- **Dependências de desenvolvimento** (18 avisos): `@lhci/cli` e sua árvore (`lighthouse`, `puppeteer-core`, `tmp`, `uuid`, entre outras), e `gray-matter` com `js-yaml`/`argparse`. A correção sugerida pelo npm é uma troca com quebra de compatibilidade (`@lhci/cli@0.1.0`, `gray-matter@2.0.1`). Não foi aplicada.

Esta decisão fica registrada para revisão antes de cada publicação. Rode `npm audit` de novo ao fazer a migração do Astro.

## Publicação (GitHub Pages)

O deploy é feito pelo workflow `deploy.yml`: a cada push na `main`, roda os testes e, se tudo passar, publica o `dist/` com `actions/deploy-pages`. O CI não usa segredos. A publicação depende do repositório `jalinegm/jalinegm.github.io`, que precisa ser **público** (Pages em repositório privado exige plano pago).

**Os comandos abaixo não foram executados.** Só rode depois que Jaline confirmar a publicação:

```bash
# 1. Criar o repositório remoto (público) e vinculá-lo ao local, sem enviar ainda
gh repo create jalinegm/jalinegm.github.io --public --source . --remote origin

# 2. Habilitar o GitHub Pages com a fonte "GitHub Actions"
gh api -X POST repos/jalinegm/jalinegm.github.io/pages -f build_type=workflow

# 3. Enviar a branch main (dispara o deploy.yml)
git push -u origin main
```

Alternativa pela interface: em Settings > Pages, escolha "Source: GitHub Actions". Faça isso antes do primeiro push, senão a etapa de publicação falha e precisa ser reexecutada.

Para verificar, acompanhe a aba Actions e abra `https://jalinegm.github.io/`.

## Atualizar o site

1. Alterar dados (curadoria, currículo, repositórios) ou conteúdo.
2. Se as fontes mudaram: `gh auth login` (uma vez) e a sincronização (ver acima).
3. `npm test` localmente.
4. Commit e `git push`. O `deploy.yml` publica após os testes passarem.

## Como adicionar a versão em inglês (futuro)

A configuração de i18n já existe em `astro.config.mjs` (`defaultLocale: "pt-BR"`, `locales: ["pt-BR", "en"]`, `prefixDefaultLocale: false`). Quando for o momento:

1. Criar `src/i18n/en.json` com as mesmas chaves de `src/i18n/pt.json`.
2. Criar as páginas em `src/pages/en/` e definir `lang="en"` no layout.
3. Envolver termos em inglês dentro de textos em português com `<span lang="en">`, como já é feito.
4. Ajustar os testes de rotas e de idioma em `tests/`.
