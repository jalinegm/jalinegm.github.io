---
target: projetos/clat imagens desproporcionais
total_score: 19
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 2
target_identity: "url:http://localhost:4321/projetos/clat"
timestamp: 2026-10-14T20-29-32Z
slug: localhost-projetos-clat
---
Method: dual-agent (A: design review · B: detector + browser evidence)

Design Health Score: 19/28 (7 scored; 7, 9, 10 n/a) - Acceptable (68%).
1 Visibility 2 | 2 Match real world 4 | 3 Control 3 | 4 Consistency 2 | 5 Error prevention 3 | 6 Recognition 3 | 8 Minimalist 2.

Specificity: strong content (real research artifacts, UX arc), generic figure treatment.
Detector: CLI 0 findings. Browser 30 (line-length 25 at 1920px, cramped li padding 4, text-occlusion 1 = extension overlay, false positive).

Priority issues
- [P1] Figures oversize: global.css:160-168 .prosa > figure max-width 62rem (> 52rem measure), .larga max-width none, no max-height. Portrait diagrams (etapas 992x1168, mapa-jornada 1088x1248, telas-ditado 1088x1099) exceed one viewport. Fix: cap default figure to --medida, .larga min(100%, 62rem), figure img max-height min(80vh, 44rem) width auto, retrato modifier. -> layout
- [P1] 23 figures all open in one scroll; fatigue in middle. Fix: group sibling figures in grids, secondary artifacts in details/anexo. -> distill
- [P2] Mixed widths 832/992/1088/968 ragged edges; caption not aligned to image. -> layout
- [P2] Mobile: wide diagrams shrink to ~339px, text unreadable (fluxo-profissional 135px tall). Fix: scroll wrapper or tap-to-zoom + hint. -> adapt
- [P3] avatar 201x440 sliver in full-width frame; white img bg glares in dark; 4px li padding; ~3x oversized mobile downloads, no srcset. -> polish
