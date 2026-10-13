# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: people who receive the link directly from Jaline and are walked through her projects and repositories (guided navigation, strong first impression). Secondary: research collaborators in HCI, child-computer interaction, accessibility and educational data; institutional partners (federal network institutions, projects such as Plataforma Nilo Peçanha and Cecate); examination boards and event organizers.

## Product Purpose

Professional and academic portfolio of Jaline Gonçalves Mombach, docente at Instituto Federal Farroupilha (IFFar). Shows research (thesis CLAT, dissertation), institutional data work, teaching and extension, publications and all GitHub repositories. Success: a visitor understands who she is and what she has done, and finds a path to research collaboration or an institutional invitation.

## Positioning

Academic and institutional professional practice, not a freelancer or consultant site. Combines HCI/accessibility research with institutional data management, backed by published work and open repositories.

## Operating Context

Hosted on GitHub Pages at `https://jalinegm.github.io/` (not yet published). Static Astro 5 site, Portuguese (pt-BR) now, English later under `/en/`. Data synced from a Lattes XML and the GitHub CLI. Published repos include private ones shown by name/description only.

## Capabilities and Constraints

- Routes: Início, Sobre, Pesquisa (thesis, dissertation, publications with filters and copy-citation), Projetos (case studies and repository list), Colaboração, Acessibilidade, 404.
- Existing tests that must keep passing: unit, e2e, axe 0 violations, Lighthouse 100, forbidden-words grep over `dist/`.
- Forbidden terms in any text: consultoria, consultora, contratar, contrate, cliente, serviço(s), orçamento, freelance, hire. No services list, pricing or sales tone. Use "atuação profissional", "colaboração", "parcerias institucionais", "palestras e bancas".
- Jaline holds Dedicação Exclusiva at IFFar, which is why the framing is institutional.
- LinkedIn is only a "find me" button.
- UI strings live in `src/i18n/pt.json`; English terms inside PT text use `<span lang="en">`.
- Light/dark theme with manual toggle; structure built on design tokens (`src/styles/tokens.css`).
- Open facts (marked `REVISAR` in code): IFFar start year, advisor name, PixelLab, lato sensu years, paper under review, some links.

## Brand Commitments

None binding yet. Visual identity is to be decided in the redesign.

## Evidence on Hand

Real content: Lattes XML, thesis and dissertation PDFs (`public/docs/`), 6 case studies, ~65 publications, 58 GitHub repos. Assets available: a professional photo of Jaline (to be supplied) and screenshots/GIFs of projects (one GIF in `public/repos/`). No logo or personal mark. No testimonials; do not fabricate any.

## Product Principles

1. Institutional and academic voice always; never read as an offer of services.
2. Guided first impression: a visitor handed the link understands who she is within one screen.
3. Real work is the proof: publications, repositories and case studies lead, not claims.
4. Accessible by construction: the author researches accessibility, so the site must exceed WCAG AA.
5. Honest about gaps: unverified facts stay marked, never invented.

## Accessibility & Inclusion

Author is an accessibility researcher; target WCAG 2.2 AA minimum with keyboard, screen reader (NVDA, TalkBack), 200% zoom and reduced-motion support. Current baseline: axe 0 violations.
