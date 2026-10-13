---
titulo: "Painéis e relatórios da Plataforma Nilo Peçanha e indicadores do IFFar"
slug: paineis-pnp-indicadores
vinculo: "Instituto Federal Farroupilha (IFFar), Diretoria de Planejamento e Desenvolvimento Institucional (DPDI/Reitoria)"
periodo: "2023–atual"
resumo: "Conjunto de painéis, calculadoras e geradores de relatórios que transformam dados institucionais e da Plataforma Nilo Peçanha em indicadores de gestão para o IFFar."
tecnologias:
  - "Python"
  - "Power BI (DAX, M e PBIP)"
  - "python-pptx"
  - "Excel"
repos:
  - relatorios-pnp2026-iffar
  - relatorios-pnp2026
  - painelPosIFFar
  - artigoJLL
  - Rede-DSBR
destaque: true
ordem: 3
---

## Contexto

A Plataforma Nilo Peçanha (PNP) reúne estatísticas oficiais da Educação Profissional, Científica e Tecnológica nos institutos federais. Os campi precisam transformar esses dados em relatórios e indicadores para planejamento e prestação de contas.

## Problema

Gerar relatórios e painéis para os 11 campi do IFFar de forma repetível, sem refazer manualmente as apresentações e os gráficos a cada coleta de dados.

## Abordagem

Os projetos automatizam essa etapa. O gerador de relatórios lê os dados brutos da PNP de um campus, confere os números e produz uma apresentação `.pptx` editável. O painel de pós-graduação, em Power BI com formato de projeto (PBIP), consolida dados curados pela coordenação e acompanha matrículas e indicadores por curso.

## Resultado e impacto

Segundo o README do repositório de relatórios, os decks dos 11 campi foram regenerados do zero em 22/07/2026. Entre os produtos registrados no currículo Lattes estão cinco ferramentas de apoio à tomada de decisão, de 2023 a 2026, entre elas o Painel de Acompanhamento dos Processos Seletivos e o Panorama dos Cursos de Pós-Graduação.

<!-- REVISAR: o impacto na gestão (uso das ferramentas por pró-reitorias ou campi) não foi verificado. Incluir apenas dados confirmados. -->

## Tecnologias

Python, bibliotecas `python-pptx`, `openpyxl` e `matplotlib`, automação do Excel e do PowerPoint para validação visual, e Power BI com DAX e Power Query (M).

## Repositórios relacionados

- `relatorios-pnp2026-iffar`: pipeline que gera os relatórios PNP 2026 dos 11 campi do IFFar.
- `relatorios-pnp2026`: motor local que gera a apresentação de um campus a partir do Excel da PNP.
- `painelPosIFFar`: painel de Business Intelligence dos cursos de pós-graduação lato sensu do IFFar.
- `artigoJLL`: análise de eficiência acadêmica da base da PNP, em apoio a um artigo em elaboração.
- `Rede-DSBR`: espaço de arquivos de trabalho e relatórios do projeto PNP da Rede DSBR.

<!-- REVISAR: o repositório artigoJLL é versionamento de análise em andamento. Confirmar se pode ser citado publicamente antes de o artigo ser publicado. -->

## Vínculo institucional

Atuação profissional como Pesquisadora Institucional Substituta na DPDI/Reitoria do IFFar. Os projetos integram a Plataforma Nilo Peçanha (projeto de pesquisa iniciado em 2023).
