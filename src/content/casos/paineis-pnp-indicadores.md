---
titulo: "Painéis e relatórios da Plataforma Nilo Peçanha e indicadores do IFFar"
slug: paineis-pnp-indicadores
vinculo: "Instituto Federal Farroupilha (IFFar), Diretoria de Planejamento e Desenvolvimento Institucional (DPDI/Reitoria)"
periodo: "2023–atual"
resumo: "Seis ferramentas que transformam os dados da Plataforma Nilo Peçanha, do Sistec e do ingresso em indicadores para a gestão do IFFar: painéis, calculadoras de matrícula e uma pipeline de relatórios para os 11 campi."
tecnologias:
  - "Python"
  - "Streamlit"
  - "Power BI (DAX, M e PBIP)"
  - "python-pptx"
  - "Excel"
repos:
  - relatorios-pnp2026-iffar
  - painelPosIFFar
destaque: true
ordem: 3
---

## Visão geral

A Plataforma Nilo Peçanha (PNP) reúne as estatísticas oficiais da educação profissional, científica e tecnológica dos institutos federais. Para o IFFar, acompanhar esses dados e as matrículas é uma tarefa permanente, porque deles dependem o planejamento e a prestação de contas.

O projeto reúne seis ferramentas que apoiam a tomada de decisão da gestão. Todas têm acesso na página de [Painéis e Publicações da DPDI](https://www.iffarroupilha.edu.br/planejamento-e-desenvolvimento/pain%C3%A9is-e-publica%C3%A7%C3%B5es).

- **Papel:** autoria do design e da implementação de todas as ferramentas; colegas da DPDI contribuíram com as regras de negócio.
- **Quem usa:** gestão e comunidade acadêmica do IFFar.
- **Entrega:** 3 painéis, 2 calculadoras e 1 pipeline de relatórios.

## O desafio

Os dados da PNP e do Sistec chegam em formatos e prazos diferentes, e as regras de cálculo mudam com as portarias do MEC. Sem apoio, cada ciclo exigia refazer planilhas, conferir números à mão e remontar apresentações para cada campus.

A pergunta do projeto foi: **como entregar à gestão e aos campi números conferidos, atualizados e fáceis de consultar, sem refazer o trabalho a cada coleta?**

## As ferramentas

### Painel de Acompanhamento do Sistec

Atualizado mensalmente com os dados do Sistec, permite que toda a comunidade acadêmica acompanhe os registros. Inclui a simulação de alguns dados do próximo ciclo da PNP.

[Código no GitHub](https://github.com/DPDI-IFFar/acompanhamentoSistec)

<figure>
  <img src="/projetos/paineis-pnp-indicadores/sistec.webp" width="1446" height="812" loading="lazy" decoding="async" alt="Tela inicial do Painel de Acompanhamento do Sistec, com o título Pesquisa Institucional, Acompanhamento Sistec 2026, e quatro áreas: situação de matrícula, eficiência acadêmica, taxa de evasão e percentuais legais.">
  <figcaption>Tela inicial do painel do Sistec, organizada nos quatro indicadores que a comunidade mais consulta.</figcaption>
</figure>

### Calculadora de Matrículas Totais

Software institucional que apoia o cálculo e a conferência da Matrícula Total dos cursos do IFFar, seguindo a metodologia da Portaria MEC nº 243/2026, que revogou e substituiu a Portaria MEC nº 646/2022.

[Aplicação](https://iffarcalcmatriculatotal.streamlit.app/) · [Código no GitHub](https://github.com/DPDI-IFFar/calcMT_iffar)

<figure>
  <img src="/projetos/paineis-pnp-indicadores/matriculas-totais.webp" width="1347" height="818" loading="lazy" decoding="async" alt="Página inicial da Calculadora de Matrículas Totais do IFFarroupilha, com três opções: Matrículas Totais do IFFar, Outros Institutos Federais e Simulador Manual.">
  <figcaption>Calculadora de Matrículas Totais: três caminhos, do dado oficial calculado ao simulador manual.</figcaption>
</figure>

### Calculadora de Matrículas Equivalentes

Ferramenta institucional para análises, simulações e estudos da matrícula equivalente no IFFar.

[Código no GitHub](https://github.com/DPDI-IFFar/calcMatEQ)

<figure class="compacta">
  <img src="/projetos/paineis-pnp-indicadores/matriculas-equivalentes.webp" width="357" height="343" loading="lazy" decoding="async" alt="Calculadora de Matrículas Equivalentes, da Pró-Reitoria de Desenvolvimento Institucional, com três campos de seleção em sequência: tipo de curso, eixo tecnológico e curso.">
  <figcaption>Calculadora de Matrículas Equivalentes: a pessoa escolhe tipo de curso, eixo e curso, em uma sequência curta de campos.</figcaption>
</figure>

### Panorama dos Cursos de Pós-Graduação

Solução de Business Intelligence para gestão, monitoramento e análise dos indicadores dos cursos de pós-graduação lato sensu do IFFar.

[Código no GitHub](https://github.com/jalinegm/painelPosIFFar)

<figure>
  <img src="/projetos/paineis-pnp-indicadores/pos-graduacao.webp" width="1585" height="884" loading="lazy" decoding="async" alt="Painel Panorama dos Cursos de Pós-Graduação com barras de matrículas por curso, cartões de inscritos, vagas e inscritos por vaga, medidores de ingressantes e concluintes, mapa do Rio Grande do Sul e série histórica.">
  <figcaption>Panorama dos Cursos de Pós-Graduação: matrículas por curso, ocupação de vagas, mapa e série histórica.</figcaption>
</figure>

### Painel de Acompanhamento do Processo Seletivo

Ferramenta para dar transparência e permitir o monitoramento e a análise dos dados de ingresso no IFFar.

[Código no GitHub](https://github.com/DPDI-IFFar/painelPS)

<figure>
  <img src="/projetos/paineis-pnp-indicadores/processo-seletivo.webp" width="1443" height="810" loading="lazy" decoding="async" alt="Painel do Processo Seletivo 2026 com medidores de vagas preenchidas e uma tabela por campus com inscritos, vagas, relação inscrito por vaga e percentual de vagas preenchidas.">
  <figcaption>Painel do Processo Seletivo: vagas preenchidas e relação inscrito por vaga, por campus.</figcaption>
</figure>

### Pipeline de relatórios da PNP

Gera automaticamente uma apresentação `.pptx` editável, com os dados da PNP, para cada um dos 11 campi do IFFar. Os slides seguem o storytelling com dados de Cole Nussbaumer Knaflic.

Repositório privado, com acesso sob convite (veja o catálogo ao final da página).

<figure>
  <img src="/projetos/paineis-pnp-indicadores/relatorio-campus.webp" width="794" height="452" loading="lazy" decoding="async" alt="Slide de relatório do Campus Alegrete com 2.654 matrículas atendidas em 2025 em destaque e, abaixo, 449 concluintes, 1.835 em curso e 370 evadidos.">
  <figcaption>Slide gerado pela pipeline: um número em destaque e o detalhamento logo abaixo, no estilo de storytelling com dados.</figcaption>
</figure>

## Resultado

A comunidade acadêmica usa as ferramentas no acompanhamento dos dados. Segundo o README do repositório, os relatórios dos 11 campi foram regenerados do zero em 22/07/2026. O Lattes registra cinco ferramentas de apoio à tomada de decisão entre 2023 e 2026.

## Tecnologias

Python, Streamlit, `python-pptx`, `openpyxl` e `matplotlib`, automação do Excel e do PowerPoint para validação visual, e Power BI com DAX e Power Query (M).

## Vínculo institucional

Atuação profissional como Pesquisadora Institucional Substituta na DPDI/Reitoria do IFFar. Os projetos integram a Plataforma Nilo Peçanha (projeto de pesquisa iniciado em 2023).
