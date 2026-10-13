---
titulo: "Proposta de aplicativo móvel para identificação de cédulas de Real por pessoas com deficiência visual"
slug: dissertacao
ordem: 2
resumo: "Dissertação de mestrado em Engenharia Elétrica (UNIPAMPA, defendida em 07/05/2015) sobre um aplicativo Android que ajuda pessoas com deficiência visual a identificar as cédulas de Real."
pdf:
  href: /docs/dissertacao-jaline-mombach.pdf
  formato: PDF
  tamanho: "7,5 MB"
repositorioUrl: "https://repositorio.unipampa.edu.br/handle/riu/745"
publicacoesDerivadas:
  - titulo: "Proposta de um aplicativo móvel para percepção de imagens estáticas por alunos com deficiência visual"
    veiculo: "SBIE 2013 (XXIV Simpósio Brasileiro de Informática na Educação)"
    ano: 2013
    doi: "10.5753/cbie.sbie.2013.487"
  - titulo: "Aplicativo Identificador de Cédulas para Apoio ao Ensino do Sistema Monetário Brasileiro a Pessoas com Deficiência Visual"
    veiculo: "SBIE 2017 (Simpósio Brasileiro de Informática na Educação)"
    ano: 2017
    doi: "10.5753/cbie.sbie.2017.1067"
midia: []
---

## Problema

Pessoas com deficiência visual têm dificuldade para reconhecer as cédulas de Real. As notas têm marcações táteis e dimensões que não bastam para a identificação por pessoas cegas ou com baixa visão. Um questionário aplicado durante a delimitação do trabalho indicou a identificação de cédulas como a principal demanda do público, o que levou a pesquisa a focar nesse tema.

## Método

O trabalho usou técnicas de Design Centrado no Usuário. Um questionário on-line levantou dados sobre o público e confirmou duas hipóteses iniciais: a dificuldade para identificar o valor das cédulas e o uso frequente de smartphones por esse público.

A plataforma escolhida foi Android, por ter recursos nativos de acessibilidade. O método de reconhecimento combina:

- algoritmos de processamento de imagens da biblioteca OpenCV, com o detector ORB e comparação por força bruta de pontos de interesse;
- identificação da cor predominante na cédula;
- reconhecimento do numeral nas cédulas da primeira família.

Os métodos de classificação por treinamento foram testados primeiro, sem resultados satisfatórios.

## Resultados

Na comparação com dois aplicativos Android já existentes, o método proposto teve sensibilidade de 86%, especificidade de 98% e acurácia de 89%.

Cinco pessoas com deficiência visual participaram da avaliação cooperativa do protótipo, com questionário baseado na escala de Likert. Os resultados da avaliação foram satisfatórios. A principal dificuldade relatada foi o posicionamento da câmera sobre a cédula, que exige treinamento.

As limitações apontadas são a análise de intensidade de pixels para obter a cor predominante, que pode ser afetada pelo flash do aparelho, e a comparação linear entre as 24 possibilidades de lado da cédula. Como trabalhos futuros, a dissertação indica a aceleração do reconhecimento, comandos de voz e acionamento por botão do celular.

## Publicações relacionadas

Os dois trabalhos em congresso abaixo foram listados a partir do currículo Lattes da autora, que é a fonte dos DOIs.

<!-- REVISAR: o currículo Lattes indica o SBIE 2013 como "Proposta de um aplicativo móvel para percepção de imagens estáticas por alunos com deficiência visual". Confirmar se esse trabalho é o desdobramento inicial da mesma linha de pesquisa antes de manter a relação na página. -->

## Download

O PDF é uma cópia comprimida da dissertação. O original completo está no repositório institucional da UNIPAMPA.
