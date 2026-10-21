---
titulo: "Automação de processos acadêmico-regulatórios"
slug: automacao-academico-regulatoria
vinculo: "Instituto Federal Farroupilha (IFFar), atuação na gestão e análise de dados institucionais"
periodo: "2026"
resumo: "Ferramentas que automatizam tarefas repetitivas de sistemas oficiais, como boletins no SIGAA, atributos docentes no e-MEC, relatórios do Educacenso e downloads do SISTEC."
tecnologias:
  - "Python"
  - "Playwright"
  - "pandas e openpyxl"
  - "python-docx"
  - "pywebview"
  - "Jupyter Notebook"
repos:
  - baixar-boletins-sigaa
  - atributos-docentes-emec
  - migracaoDocenteCensup2026
  - migracaoAlunoCensup2026
  - gerar-planilhas-educacenso
  - baixadorSistec
destaque: true
ordem: 7
---

## Contexto

Os processos de regulação e de censo exigem o preenchimento e o envio de dados em sistemas oficiais, como SIGAA, e-MEC, Censo Escolar (Educacenso) e SISTEC. Muitas das tarefas são repetitivas e se repetem a cada ciclo.

## Problema

Reduzir o trabalho manual de baixar, preencher e conferir dados nesses sistemas, sem perder o controle do que é enviado.

## Abordagem

![Tela inicial do Boletins SIGAA, com etapas Arquivo, Acesso ao SIGAA e Boletins, e seleção de arquivo CSV de matrículas.](/projetos/automacao-academico-regulatoria.png)

Cada ferramenta cobre uma etapa:

- **Boletins no SIGAA:** baixa em lote os boletins escolares a partir de uma lista de matrículas em CSV, com um executável para Windows.
- **Atributos docentes no e-MEC:** preenche os dados dos docentes e o vínculo deles com as disciplinas a partir de planilhas. O script não faz login nem guarda senha; ele usa o Chrome que o próprio usuário abriu e autenticou. Antes de qualquer envio real, recomenda-se executar em modo de teste (`--dry-run`).
- **Relatórios do Educacenso:** a partir do relatório de alertas enviado pela Setec, gera uma planilha por campus e um relatório `.docx` com o que deve ser conferido.
- **Downloads do SISTEC:** aplicativo Windows que abre as páginas de relatório e move o arquivo baixado para a pasta escolhida.
- **Migrações do Censup 2026:** notebooks de apoio à migração de dados de docentes e de alunos.

## Resultado e impacto

As ferramentas foram desenvolvidas para as rotinas descritas acima.

<!-- REVISAR: não há métricas verificadas de tempo economizado ou de volume processado. Incluir apenas se Jaline confirmar os números. -->

## Tecnologias

Python, Playwright (automação de navegador), pandas, openpyxl, python-docx, pywebview e Jupyter Notebook.

## Repositórios relacionados

- `baixar-boletins-sigaa`: download em lote de boletins do SIGAA.
- `atributos-docentes-emec`: preenchimento de atributos docentes no e-MEC.
- `migracaoDocenteCensup2026` e `migracaoAlunoCensup2026`: notebooks de migração para o Censup 2026.
- `gerar-planilhas-educacenso`: relatórios de alertas do Educacenso por campus.
- `baixadorSistec`: aplicativo Windows para baixar relatórios do SISTEC.

<!-- REVISAR: os repositórios de migração do Censup não têm README. Confirmar a descrição de cada um. -->

## Vínculo institucional

Atuação profissional no IFFar, com as ferramentas voltadas às rotinas de regulação e de dados institucionais.
