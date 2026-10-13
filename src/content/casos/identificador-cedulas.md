---
titulo: "Aplicativo identificador de cédulas de Real para pessoas com deficiência visual"
slug: identificador-cedulas
vinculo: "Mestrado em Engenharia Elétrica, Universidade Federal do Pampa (UNIPAMPA)"
periodo: "2013–2015"
resumo: "Aplicativo Android que ajuda pessoas com deficiência visual a identificar as cédulas de Real por reconhecimento de imagem, com validação de precisão e avaliação com usuários."
tecnologias:
  - "Android"
  - "OpenCV"
  - "ORB (detector de pontos de interesse)"
repos: []
destaque: true
ordem: 2
---

## Contexto

Pessoas com deficiência visual têm dificuldade para reconhecer as cédulas de Real, cujas marcações táteis e dimensões não bastam para a identificação por pessoas cegas ou com baixa visão. O aplicativo foi pensado como tecnologia assistiva para essa necessidade.

## Problema

Identificar, de forma confiável e com um celular comum, o valor de uma cédula de Real fotografada pela câmera do aparelho.

## Abordagem

A pesquisa usou técnicas de Design Centrado no Usuário e um questionário on-line para confirmar o problema. O reconhecimento combina descritores de pontos de interesse (ORB, com comparação por força bruta), identificação da cor predominante e reconhecimento do numeral nas cédulas da primeira família. A plataforma escolhida foi Android, por seus recursos nativos de acessibilidade.

## Resultado e impacto

Na comparação com dois aplicativos existentes, o método obteve sensibilidade de 86%, especificidade de 98% e acurácia de 89%. Cinco pessoas com deficiência visual avaliaram o protótipo, e a principal dificuldade relatada foi posicionar corretamente a câmera sobre a cédula.

## Tecnologias

Android, biblioteca OpenCV, detector ORB e análise de cor.

## Repositórios relacionados

Nenhum repositório de código público está vinculado a este estudo de caso.

<!-- REVISAR: verificar se o código do aplicativo está disponível em algum repositório e se o aplicativo chegou a ser publicado na loja Android. -->

## Vínculo institucional

Dissertação de mestrado no Programa de Pós-Graduação Stricto Sensu em Engenharia Elétrica da UNIPAMPA, defendida em 07/05/2015. Orientação do Prof. Dr. Daniel Welfer.
