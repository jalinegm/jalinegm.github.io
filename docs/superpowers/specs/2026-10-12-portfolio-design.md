# Portfolio Jaline Mombach — Design Spec

Date: 2026-10-12
Status: approved by Jaline (sections 1–4 approved in brainstorming)
Visual design: out of scope here — will be done later with the `impeccable` skill. Implementation must ship a clean, neutral, accessible baseline theme built on design tokens so impeccable can restyle it without touching structure.

## 1. Goal and audience

Professional portfolio for **Jaline Gonçalves Mombach**, hosted on GitHub Pages at `https://jalinegm.github.io/`.

Audience is mixed:
- research collaborators (HCI / Child-Computer Interaction / accessibility / educational data);
- institutional partners (other federal network institutions, projects such as Plataforma Nilo Peçanha, Cecate);
- people she needs to show her work to (she sends the link and walks them through projects and repos).

### Hard framing constraint (non-negotiable)

Jaline is a federal professor under **Dedicação Exclusiva (DE)** at IFFar. The site must read as an **academic / institutional professional portfolio**, never as a freelancer or consultant.

- Forbidden words anywhere in copy, CTAs, metadata: `consultoria`, `consultora`, `contratar`, `contrate`, `cliente`, `serviço(s)` (as offered services), `orçamento`, `freelance`, `hire`.
- No services list, no pricing, no "work with me" sales tone.
- Use: "atuação profissional", "colaboração", "parcerias institucionais", "projetos interinstitucionais", "convites para palestras e bancas".
- A test must grep the built `dist/` for the forbidden words and fail the build if found (case-insensitive, Portuguese and English).

## 2. Language

Phase 1: **Portuguese only** (`lang="pt-BR"`). Structure must be i18n-ready for English later:
- Astro i18n config with `defaultLocale: "pt-BR"`, `locales: ["pt-BR", "en"]`, `prefixDefaultLocale: false` (PT at `/`, EN later at `/en/`). Do NOT create EN pages now.
- All UI strings (nav, buttons, labels, aria texts, filter labels, status messages) live in `src/i18n/pt.json` and are read through a `t(key)` helper. No hardcoded UI strings in components.
- English terms inside PT text are wrapped in `<span lang="en">`.

## 3. Stack

- **Astro** (latest stable 5.x), static output, zero client JS by default. Small islands only where interaction is needed (filters, theme toggle, copy-to-clipboard, mobile menu) — vanilla TS, no React/Vue.
- Content collections with **Zod** schemas.
- Python 3.12 scripts for data sync (`scripts/`), run locally, outputs committed.
- **GitHub Actions**: `ci.yml` (build + tests on PR/push) and `deploy.yml` (official `actions/deploy-pages` on push to `main`, only after tests pass).
- Node 24 (installed locally). Use `npm`.

## 4. Information architecture

Primary nav (5 items, same order on every page, current page marked with `aria-current="page"`):

| Route | Name |
|---|---|
| `/` | Início |
| `/sobre` | Sobre |
| `/pesquisa` | Pesquisa |
| `/projetos` | Projetos |
| `/colaboracao` | Colaboração |

Plus: `/acessibilidade` (footer link), `/404`.

### 4.1 Início `/`
- `h1`: name. Positioning line: "Docente e pesquisadora do Instituto Federal Farroupilha. Interação humano-computador, acessibilidade e dados educacionais."
- Three "Atuação profissional" blocks:
  1. Pesquisa em IHC e acessibilidade (CLAT, Child-Computer Interaction, tecnologia assistiva).
  2. Gestão e análise de dados institucionais (Pesquisadora Institucional Substituta na DPDI/Reitoria; PNP, Censup, e-MEC, SISTEC, painéis).
  3. Ensino e extensão (IFFar desde 2013/2014, IFB 2017–2020, projetos de extensão).
- 3–4 featured projects (from case studies, `destaque: true`).
- Single CTA: "Vamos conversar" → `/colaboracao`.

### 4.2 Sobre `/sobre`
- Short bio (adapt from Lattes RESUMO-CV, first person or third person — pick third person, consistent).
- **Formação** timeline (newest first):
  - Especialização (lato sensu) em Inteligência Artificial e Computacional — UFV — **em andamento**
  - Especialização (lato sensu) em Educação a Distância para a Educação Profissional — IFFar — **em andamento**
  - Doutorado em Ciência da Computação — UFG — 2019–2022 — Tese: "CLAT: uma abordagem para avaliação da escrita inicial infantil em dispositivos móveis" (orientador Prof. Dr. Fabrizzio Alphonsus A. M. N. Soares; defendida 21/12/2022)
  - Mestrado em Engenharia Elétrica — UNIPAMPA — 2013–2015 — Dissertação: "Proposta de aplicativo móvel para identificação de cédulas de Real por pessoas com deficiência visual" (orientador Prof. Dr. Daniel Welfer; defendida 07/05/2015)
  - Bacharelado em Ciência da Computação — UNIPAMPA — 2009–2012 — TCC: "Percepção de imagens estáticas por pessoas cegas"
  - Do not list the incomplete 2017–2019 doctorate (UFG/UFMS) — it is superseded.
  - The two lato sensu courses are NOT in the Lattes XML; hardcode them in `src/content/paginas/formacao-extra.yaml` (or similar) and merge.
- **Atuação profissional**: IFFar (Professora EBTT desde 2014; substituta 2013–2014; atual exercício provisório como Pesquisadora Institucional Substituta na DPDI/Reitoria), IFB (Docente de Informática 2017–2020), UFOB (Pesquisadora colaboradora desde 2023), PixelLab UFG (from GitHub profile company). Revisora: Multimedia Tools and Applications (2023), Frontiers in Education (2024). Skip pre-2013 non-academic jobs.
- **Prêmios**: from Lattes (Prêmio Luiz Fernando WebMedia 2020 – melhor trabalho; Honra ao Mérito Google Startup in School 2019; Prêmio Prof. Sérgio Escorsim 2012).
- **Patente**: "Dispositivo e Método para Auxílio na Visualização de Imagens para Pessoas com Nictalopia".
- **Software registrado**: the 5 DADOS-BASICOS-DO-SOFTWARE entries from Lattes.
- Profile buttons: Lattes `http://lattes.cnpq.br/5793944765294091`, LinkedIn `https://www.linkedin.com/in/jalinegm/`, GitHub `https://github.com/jalinegm`. LinkedIn is ONLY a "find me" button — no LinkedIn content.

### 4.3 Pesquisa `/pesquisa`
- Research lines (from Lattes areas: Análise de Dados, Informática na Educação, IHC).
- Cards linking to:
  - `/pesquisa/tese-clat` — problem, method (Design Science Research; systematic mapping; survey with professionals and families; two artifacts: activity authoring + child handwriting/reading-mode capture; concept tests; school ecosystem experiment with 92 children and 6 teachers), results, publications derived (list from thesis §9.1, with DOIs), media coverage (12 items from thesis §9.1 "Divulgação Científica na Mídia", with links), PDF.
  - `/pesquisa/dissertacao` — problem (visually impaired people identifying Real banknotes), approach (Android app, native accessibility), results, related publications (SBIE 2013, SBIE 2017), PDF.
  - Extract this content from the PDFs with `pdftotext` (available at `/ucrt64/bin/pdftotext`) — read the abstract, method and conclusion chapters. Write in plain Portuguese, short paragraphs, expand acronyms on first use.
- Current research projects (Lattes PROJETO-DE-PESQUISA without ANO-FIM): Plataforma Nilo Peçanha (2023–), Cecate Nordeste (2024–).
- **Publicações** list: all ARTIGO-PUBLICADO, TRABALHO-EM-EVENTOS, CAPITULO-DE-LIVRO-PUBLICADO from Lattes (~65). Each item: title, authors, venue, year, type, theme, DOI link (`https://doi.org/<doi>`) when present, "Copiar citação" button (ABNT-ish string). Filters: type, year, theme, free-text search. Sort newest first.
- **PDFs**: compressed copies at `public/docs/tese-clat-jaline-mombach.pdf` and `public/docs/dissertacao-jaline-mombach.pdf`, target < 10 MB each (use PyMuPDF `fitz`, which is installed: downsample images ~150 dpi, `garbage=4, deflate=True`). Link text includes format and size, e.g. "Baixar tese (PDF, 8 MB)". Also look up and link the institutional repository URLs if findable (UFG repositorio.bc.ufg.br / UNIPAMPA dspace); if not found, omit — do not invent URLs. Original PDFs stay out of git (see `.gitignore`).

### 4.4 Projetos `/projetos`
- **Estudos de caso** (5–6, each its own page `/projetos/<slug>`), framed as institutional/research projects with explicit affiliation:
  1. CLAT (UFG, doutorado) — links to thesis page.
  2. App identificador de cédulas para pessoas com deficiência visual (UNIPAMPA, mestrado).
  3. Painéis e relatórios PNP / indicadores IFFar (DPDI) — repos `relatorios-pnp2026-iffar`, `relatorios-pnp2026`, `painelPosIFFar`, `artigoJLL`, `Rede-DSBR`, Lattes software entries.
  4. Automação de processos acadêmico-regulatórios (SIGAA boletins, e-MEC atributos docentes, Censup migrations, Educacenso, SISTEC) — repos `baixar-boletins-sigaa`, `atributos-docentes-emec`, `migracaoDocenteCensup2026`, `migracaoAlunoCensup2026`, `gerar-planilhas-educacenso`, `baixadorSistec`.
  5. Alcance global das citações IFFar — `alcance-global-citacoes-iffar`, `mapa_citacoes_iffar`.
  6. Cecate Nordeste (projeto de pesquisa) — `avaliacoesPoloTeresina`, `avaliacoesPoloSaoLuis`, `cecatene-inscricao-dialogflow-node`.
  Each case: contexto, problema, abordagem, resultado/impacto, tecnologias, repos relacionados, vínculo institucional. Never describe as paid/client work. Mark facts you could not verify with an HTML comment `<!-- REVISAR: ... -->` for Jaline to check — never fabricate metrics.
- **Catálogo de repositórios**: ALL repos of `jalinegm` (public and private, ~60). Card: name, PT description, language, last update year, visibility badge ("Público" / "Privado — acesso sob convite"), image if any, link to GitHub. Filters: theme, language, visibility, year + text search.
- Repos named `POO*`, `LISTA1`, `Sistema`, `FXMLTableView`, `PrimeiroProjeto`, `Prototipo2`, `jogo7erros` grouped in a collapsed `<details>` block "Material didático (2018–2021)".
- Forks (`react-native-image-modal`, `react-native-signature-canvas`) shown with "Fork" badge, low priority, or hidden via curation.

### 4.5 Colaboração `/colaboracao`
- Short open paragraph: open to research partnerships, interinstitutional projects, talks, examination boards (bancas), peer review. Tone: academic.
- Contact: institutional email `jaline.mombach@iffarroupilha.edu.br` as `mailto:` link + "Copiar e-mail" button with live feedback ("E-mail copiado"). LinkedIn and Lattes buttons.
- No form.

### 4.6 Acessibilidade `/acessibilidade`
Accessibility statement: target conformance (WCAG 2.2 AA), measures taken, known limitations, how to report a problem (email), date of last review.

### 4.7 404
Helpful page: what happened, links to the 5 main sections.

### Footer (all pages)
"Instituto Federal Farroupilha — Campus Alegrete · Diretoria de Planejamento e Desenvolvimento Institucional (Reitoria)", profile links, link to `/acessibilidade`, last update date (build date).

## 5. Data and content

Single source per content type; scripts generate committed JSON.

| Content | Source | Generator / output |
|---|---|---|
| Publications, formation, jobs, awards, projects, software, patent | `data/lattes/5793944765294091.xml` (ISO-8859-1 encoded) | `scripts/lattes.py` → `src/data/lattes.json` |
| Repos | GitHub API via local `gh` (authenticated as `jalinegm`, sees private repos) | `scripts/repos.py` → `src/data/repos.json` + images in `public/repos/<name>.<ext>` |
| Repo curation | `data/repos-curadoria.yaml` (hand-edited) | merged by `repos.py`; curation overrides API |
| Publication theme overrides | `data/publicacoes-curadoria.yaml` keyed by DOI or normalized title | merged by `lattes.py` |
| Case studies, thesis, dissertation, static text | `src/content/casos/*.md`, `src/content/pesquisa/*.md`, `src/content/paginas/*` | Astro content collections + Zod |

### Scripts
- `npm run sync` runs both scripts (`python -I scripts/lattes.py` and `python -I scripts/repos.py`).
- `lattes.py`: decode XML (it is ISO-8859-1), unescape HTML entities in titles (e.g. `&#64257;` → `fi`, `&apos;`), normalize stray `?` used as apostrophe/dash where obvious. Extract authors (`AUTORES` NOME-PARA-CITACAO in order). Theme classification by keywords into: `alfabetizacao-cci` (escrita, spelling, literacy, alfabetização, children), `acessibilidade` (deficiência, cegas, visual, Libras, assistiva, nictalopia), `educacao-computacao` (programação, pensamento computacional, app inventor, gamificação, ensino, meninas), `dados-educacionais`, `outros`; then apply YAML overrides. Deterministic output (sorted keys, stable order).
- `repos.py`: `gh repo list jalinegm --limit 200 --json name,description,primaryLanguage,isPrivate,isFork,updatedAt,createdAt,url,repositoryTopics,homepageUrl`. For each repo, fetch README via `gh api repos/jalinegm/<name>/readme`, take the first image (markdown or `<img>`), download it (resolve relative paths against the repo's default branch via the API, since private raw URLs need auth) into `public/repos/`; if none, use `openGraphImageUrl` only when it is a custom one (`usesCustomOpenGraphImage`), else no image (UI shows a language placeholder icon). Repos without description: write a short PT description in `repos-curadoria.yaml` based on the repo name/README (mark with `revisar: true`). Curation fields: `descricao`, `tema`, `destaque`, `grupo` (`didatico`), `ocultar`, `alt` (image alt text), `revisar`.
- No tokens stored in CI. Sync runs locally; outputs committed.

### Validation
Zod schemas fail the build when required fields are missing (title, alt for images, slug, etc.).

## 6. Accessibility requirements (WCAG 2.2 AA minimum, testable)

- Semantic HTML; landmarks `header`/`nav`/`main`/`footer`; exactly one `h1` per page; no skipped heading levels.
- Skip link "Pular para o conteúdo" as first focusable element.
- Contrast: text ≥ 4.5:1 (target 7:1 for body text), UI components and focus ≥ 3:1, in both light and dark themes.
- Visible focus indicator: ≥ 2px, ≥ 3:1 contrast, never obscured by sticky header (`scroll-padding-top`) (2.4.11, 2.4.13).
- Full keyboard operation of menu, filters, `<details>`, copy buttons, theme toggle; no keyboard traps; logical order.
- Target size ≥ 24×24 px (2.5.8), aim 44×44.
- `prefers-reduced-motion` disables animation/transitions; `prefers-color-scheme` sets theme; manual toggle persisted in `localStorage` (wrapped in try/catch; works without it). No flash of wrong theme (inline head script).
- Text resize to 200% and reflow at 320 CSS px without horizontal scroll.
- `lang="pt-BR"` on `<html>`; English fragments marked `lang="en"`.
- Filter results announced via `aria-live="polite"` ("12 publicações encontradas"); empty state with suggestion + "Limpar filtros".
- External links: indicated in accessible name "(abre em nova aba)" if `target="_blank"` — prefer opening in the same tab and only marking external. PDF links state format and size.
- Every `<img>` has `alt`; decorative images `alt=""`.
- Acronyms expanded on first use with `<abbr title="...">` (PNP, SISTEC, Censup, e-MEC, SIGAA, DPDI, IHC, CCI, DSR, EBTT, DE).
- Filters work without JS as far as reasonable (full list rendered server-side; JS enhances by filtering).

## 7. Nielsen heuristics (concrete implementation)

1. Visibility of system status — `aria-current` in nav, live result counts, "E-mail copiado" / "Citação copiada" feedback.
2. Match with real world — plain Portuguese, acronyms expanded.
3. User control and freedom — "Limpar filtros"; filter state mirrored in URL query (`?tipo=&ano=&tema=&q=`) so back/share work.
4. Consistency and standards — one Card component for case studies and repos; one Badge component.
5. Error prevention — no forms; external links signaled.
6. Recognition rather than recall — breadcrumbs on inner pages; filters always visible (not hidden in a modal).
7. Flexibility and efficiency — text search in publications and repos; section anchors with visible links.
8. Aesthetic and minimalist design — baseline neutral theme; final visual by impeccable.
9. Help recover from errors — useful 404; empty filter state with suggestion.
10. Help and documentation — `/acessibilidade` page.

## 8. Baseline visual (pre-impeccable)

- All colors, spacing, type scale, radii, focus ring defined as CSS custom properties in `src/styles/tokens.css` on `:root`, redefined for dark theme under `[data-theme="dark"]` and `@media (prefers-color-scheme: dark)` (guarded by `:not([data-theme="light"])`).
- System font stack, fluid type, max line length ~70ch.
- Neutral, readable, no decorative flourishes. Keep CSS small and organized so impeccable can restyle via tokens.

## 9. Repository structure

```
portfolio-jaline/
  data/lattes/5793944765294091.xml
  data/repos-curadoria.yaml
  data/publicacoes-curadoria.yaml
  scripts/lattes.py
  scripts/repos.py
  src/content/{casos,pesquisa,paginas}/
  src/content.config.ts
  src/data/{lattes.json,repos.json}
  src/components/   (Header, Nav, Footer, SkipLink, ThemeToggle, Card, Badge, Timeline, FilterBar, CopyButton, Breadcrumbs)
  src/layouts/Base.astro
  src/pages/        index, sobre, pesquisa/index, pesquisa/[slug], projetos/index, projetos/[slug], colaboracao, acessibilidade, 404
  src/i18n/{pt.json,index.ts}
  src/styles/{tokens.css,global.css}
  public/docs/      compressed PDFs
  public/repos/     repo images
  tests/            Playwright: a11y (axe), keyboard, forbidden-words
  .github/workflows/{ci.yml,deploy.yml}
  lighthouserc.json
  README.md         how to sync and deploy
```

GitHub repo: `jalinegm/jalinegm.github.io` (must be public — Pages on private repos requires a paid plan). Do NOT create or push the remote repo without Jaline's confirmation; prepare everything locally and document the commands in README.

## 10. Testing / CI (must pass before deploy)

- `astro check` + `astro build`.
- Playwright + `@axe-core/playwright` on every built page, both themes, tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa` — zero violations.
- Keyboard test: tab through nav, filters, details, copy buttons; focus visible; skip link works.
- Reflow test at 320px viewport: no horizontal scroll (`scrollWidth <= clientWidth`).
- Forbidden-words test over `dist/**/*.html`.
- `html-validate` on `dist/`.
- Internal link check (no broken internal links/anchors).
- Lighthouse CI (`@lhci/cli`): Accessibility = 100, Best Practices ≥ 95, Performance ≥ 95, SEO ≥ 95 on main pages.
- Manual pre-launch checklist in README: NVDA + Firefox, TalkBack, 200% zoom.

## 11. Out of scope (YAGNI)

Blog, CMS, analytics (later only cookieless, e.g. Plausible), contact form, global site search, English content (structure only), custom domain.

## 12. Definition of done

- `npm run sync` regenerates data deterministically.
- `npm run build` and `npm test` pass locally with zero axe violations.
- All pages from §4 exist with real content from the sources (no lorem ipsum; unverifiable facts marked `<!-- REVISAR -->`).
- Forbidden-words test passes.
- README documents sync, test, deploy, and the commands to create the GitHub repo and enable Pages.
- Work committed to local git in logical commits.
