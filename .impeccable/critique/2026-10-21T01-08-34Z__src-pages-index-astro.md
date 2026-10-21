---
target: Acessibilidade do portfólio após integração Sobre/Início
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 0
target_identity: "file:C:\\dev\\projetos\\Pessoal\\portfolio-jaline\\src\\pages\\index.astro"
target_fingerprint: "sha256:8267a637185bd4316089ac212a2bd0bf28e248e2fcc9697902779136fab1b29d"
target_path: "C:\\dev\\projetos\\Pessoal\\portfolio-jaline\\src\\pages\\index.astro"
timestamp: 2026-10-21T01-08-34Z
slug: src-pages-index-astro
---
Method: dual-agent (A: /root/design_review · B: /root/accessibility_evidence)

A avaliação encontrou uma boa base de acessibilidade, sem violações automáticas WCAG 2.2 AA nos cenários testados. Isso não certifica conformidade: testes com leitor de tela real e usuários continuam pendentes.

Especificidade: o retrato, os projetos e a produção tornam o conteúdo próprio de Jaline. A apresentação acadêmica atual é coerente, mas diverge do DESIGN.md antigo. O detector retornou somente dois avisos de contrato visual, sem falhas de acessibilidade: #fff em global.css:189 e raio de 2px do foco em global.css:242.

| Heurística | Nota /4 |
|---|---:|
| Visibilidade do estado | 3 |
| Linguagem do mundo real | 3 |
| Controle e liberdade | 3 |
| Consistência | 3 |
| Prevenção de erros | 3 |
| Reconhecimento | 2 |
| Flexibilidade | n/a: portfólio |
| Estética e concisão | 2 |
| Recuperação de erros | 3 |
| Ajuda | n/a: navegação convencional |
| Total | 25/32 |

Pontos positivos: identidade e vínculo institucional claros; projetos reais e imagens sustentam a apresentação; títulos semânticos, skip link, foco e anúncios dos filtros foram implementados.

Prioridades:
1. [P2] Ampliação de texto na inicial. Em 320px com fonte raiz a 200%, scrollWidth chegou a486px; Pesquisa e Projetos permaneceram320px. O email sem quebra e a grade móvel contribuem. Corrigir index.astro:124–127 e layout do perfil. A combinação é um teste de estresse; não foi demonstrada falha AA apenas com esse resultado. Comando sugerido: $impeccable adapt.
2. [P2] Alvos do perfil abaixo da meta de44px do projeto: links27,19px e email23,52px. Dar altura própria aos links de navegação, sem alterar links no texto corrido. global.css:262–264 e index.astro:124–127. Não equivale automaticamente a descumprir o mínimo WCAG AA de24px: espaçamento e exceções precisam ser considerados. Comando: $impeccable harden.
3. [P2] Trabalho em destaque distante na inicial. Em390×844, o título Portfólio começa emy4425,6, após mais de5 telas. A fusão solicitada foi preservada. Um atalho inicial e/ou projetos antes do currículo reduziriam esforço sem remover conteúdo. index.astro:61–63. Comando: $impeccable layout.
4. [P2] Acesso demorado à bibliografia. Quatro descrições de eixos precedem estudos e filtros de publicações. Adicionar navegação local para estudos, projetos e publicações, preservando os eixos. pesquisa/index.astro:37–66. Comando: $impeccable clarify.

Carga cognitiva: moderada, com dificuldades de foco, agrupamento de listas longas e divulgação progressiva. A jornada começa acolhedora e perde ritmo entre a apresentação e os projetos. Visitantes novos lidam com siglas; visitantes móveis percorrem currículo extenso; pesquisadores precisam rolar para alcançar publicações. O estado do tema pode ficar mais explícito. A documentação visual precisa ser reconciliada com a direção atual antes de qualquer reformulação.

Evidências:30 scans axe no DOM atual (15 rotas ×2 temas), zero violações e zero verificações incompletas;15 rotas sem overflow em320px com fonte normal. Em3 páginas representativas, skip link recebeu primeiro foco com contorno3px e Enter levou a#conteudo; demais controles verificados tiveram contorno>=2px. Tema respondeu a Enter, e filtros sem resultado e limpar funcionaram por teclado. Com movimento reduzido:0 animações e itens da timeline com opacity1. Navegação por Tab limitada a100 passos em Pesquisa, não exaustiva. Sem validação humana de leitor de tela, zoom real do navegador ou adequação de todos os textos alternativos.
