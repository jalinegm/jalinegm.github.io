---
titulo: "Identificador de cédulas de Real para pessoas com deficiência visual"
slug: identificador-cedulas
vinculo: "Mestrado em Engenharia Elétrica, Universidade Federal do Pampa (UNIPAMPA)"
periodo: "2013–2015"
resumo: "Estudo de caso de UX: da pesquisa on-line com 153 pessoas com deficiência visual a um aplicativo Android que identifica o valor das cédulas de Real, refinado em três protótipos testados com os próprios usuários."
tecnologias:
  - "Design Centrado no Usuário"
  - "Avaliação cooperativa"
  - "Escala de Likert"
  - "Android e TalkBack"
  - "OpenCV (ORB)"
repos: []
destaque: true
ordem: 2
tese: dissertacao
imagemAlt: "Cédulas da primeira família do Real, de 2 a 100 reais, dispostas em leque."
---

## Visão geral

O aplicativo ajuda pessoas cegas e com baixa visão a descobrir o valor de uma cédula de Real usando apenas a câmera do celular. A pessoa coloca a cédula na palma da mão, posiciona o aparelho sobre ela e ouve o valor pelo leitor de telas do Android, sem depender de internet nem de uma foto bem enquadrada.

- **Papel:** pesquisadora principal, da pesquisa com usuários à implementação, aos testes com as pessoas e à comparação com aplicativos existentes.
- **Pessoas envolvidas:** 153 respostas no questionário on-line; 6 pessoas com deficiência visual (5 cegas e 1 com baixa visão) nos testes dos protótipos, uma delas uma criança de 6 anos.
- **Entrega:** aplicativo Android que identifica as duas famílias de cédulas do Real, com um método de uso criado em conjunto com os usuários.

<!-- REVISAR: confirmar a descrição do papel e se houve apoio de outras pessoas na codificação. -->

## O desafio

As cédulas de Real têm tamanhos diferentes e marcas táteis, mas isso não basta para quem não enxerga. As marcas se desgastam com o uso, e a pessoa acaba dependendo de familiares ou de quem entrega o troco. Nos testes presenciais, vários participantes contaram que já foram enganados no troco e que, para se organizar, pedem a alguém que identifique as notas e as guardam em bolsos diferentes.

<figure>
  <img src="/projetos/identificador-cedulas/cedulas-primeira-familia.webp" width="381" height="553" loading="lazy" decoding="async" alt="Cédulas da primeira família do Real, de 2, 5, 10, 20, 50 e 100 reais, em leque, cada uma de uma cor.">
  <figcaption>Primeira família de cédulas do Real: cada valor tem cor e tamanho próprios, mas isso não basta para quem não vê.</figcaption>
</figure>

Já existiam aplicativos de reconhecimento de objetos, mas eram pouco usados por esse público: demoravam, exigiam internet e pediam uma foto bem enquadrada, algo difícil para quem não vê o que a câmera vê. A pergunta do projeto foi: **como identificar uma cédula com rapidez e confiança, em um celular comum, sem exigir que a pessoa tire uma boa foto?**

## Processo

O trabalho seguiu o Design Centrado no Usuário: pesquisa com usuários, delimitação do escopo, estudo de métodos, codificação, testes com usuários em ciclos e, por fim, comparação com aplicativos similares.

<figure>
  <img src="/projetos/identificador-cedulas/etapas-dcu.webp" width="1224" height="852" loading="lazy" decoding="async" alt="Ciclo com as etapas do trabalho: pesquisa com usuários, delimitação de escopo, estudo de ferramentas e métodos, codificação, testes com usuários, comparativo com aplicativos relacionados e versão aceitável.">
  <figcaption>Etapas de desenvolvimento, baseadas no Design Centrado no Usuário.</figcaption>
</figure>

## Descoberta

### Questionário on-line

A proposta inicial era um aplicativo para ler rótulos, só para pessoas cegas. Como havia poucas pessoas cegas na cidade do estudo (Alegrete/RS), o questionário foi on-line e testado antes com uma pessoa cega usando leitor de telas. Foram 153 respostas, divulgadas por grupos e instituições especializadas.

Os dados confirmaram duas hipóteses: a dificuldade de identificar o valor das cédulas e o uso frequente de smartphone. Também mudaram o escopo: pessoas com baixa visão responderam e relataram dificuldades parecidas, então o público passou a ser todo o conjunto de pessoas com deficiência visual.

<figure>
  <img src="/projetos/identificador-cedulas/demanda-categorias.webp" width="1272" height="529" loading="lazy" decoding="async" alt="Gráfico de barras com a categoria considerada mais importante para reconhecimento: cédulas e moedas aparece à frente de rótulos de medicamentos, rótulos alimentícios, produtos de limpeza e outros.">
  <figcaption>Categoria de reconhecimento considerada mais importante: cédulas e moedas lideram, e o projeto passou de rótulos para cédulas.</figcaption>
</figure>

Quase todas as pessoas (97,4%) consideraram importante um aplicativo que reconheça objetos pela câmera.

### O que as pessoas disseram

Os relatos livres do questionário e os e-mails trouxeram o que mais pesou no projeto. Uma participante, cega, explicou que o problema é a foto: sem ver, ela não sabe se o ambiente está iluminado nem como enquadrar o objeto. Outro ponto foi a confiança: um aplicativo que reconhece a mesma nota ora como 5, ora como 10 "já gerou a dúvida e o perigo".

## Definição

### Requisitos

A partir dos relatos e da análise de aplicativos existentes, ficaram definidos os requisitos:

- **Tempo:** responder mais rápido que os aplicativos existentes (o Tap Tap See leva cerca de 30 segundos).
- **Confiabilidade:** nunca informar valores contraditórios.
- **Captura automática:** a câmera captura sozinha, sem exigir foto.
- **Posicionamento:** aceitar a cédula de frente, de verso e de cabeça para baixo.
- **Luz:** funcionar em ambiente claro e escuro.
- **Autonomia:** funcionar sem internet.
- **Tamanho:** ocupar até 28 MB, como os aplicativos similares.
- **Compatibilidade:** rodar em diferentes versões do Android.

### Plataforma

O Android foi escolhido pelos recursos nativos de acessibilidade, em especial o leitor de telas TalkBack. A maioria das pessoas do estudo usava celular com teclas, e algumas não conheciam o leitor de telas. Por isso, a sessão de teste começava explicando o TalkBack e deixando a pessoa explorar o aparelho.

## Ideação e arquitetura

O método de reconhecimento foi desenhado para ser rápido em um aparelho modesto (1 GB de memória e 1,2 GHz). A ordem de tentativas reduz o número de comparações:

1. verifica se há o numeral em regiões da cédula;
2. se não houver, identifica a cor predominante (azul, amarelo ou rosa) e compara só com as cédulas daquela cor;
3. se nada resolver, compara com todas as cédulas e, se não achar, ativa a câmera de novo.

<figure>
  <img src="/projetos/identificador-cedulas/regioes-numeral.webp" width="673" height="730" loading="lazy" decoding="async" alt="Duas imagens de uma cédula de 50 reais, uma na posição normal e outra de cabeça para baixo, com retângulos brancos marcando as regiões onde o numeral é procurado e as porcentagens de posição.">
  <figcaption>Regiões onde o aplicativo procura o numeral, para a cédula de frente e invertida.</figcaption>
</figure>

A comparação usa pontos de interesse da imagem. Métodos baseados em treinamento foram testados primeiro, sem bons resultados. O ORB, com comparação por força bruta, mostrou-se mais indicado que o SURF: gera menos ligações entre cédulas diferentes, que é o que importa para não confundir valores.

<figure>
  <img src="/projetos/identificador-cedulas/surf-orb.webp" width="1185" height="367" loading="lazy" decoding="async" alt="Duas capturas lado a lado comparando SURF e ORB em cédulas de cinco e dez reais: o SURF liga muitos pontos entre as duas notas diferentes, e o ORB liga poucos.">
  <figcaption>Comparação entre SURF (a) e ORB (b): com o ORB, notas diferentes quase não se ligam.</figcaption>
</figure>

<figure class="larga">
  <img src="/projetos/identificador-cedulas/transformacao-perspectiva.webp" width="1155" height="617" loading="lazy" decoding="async" alt="Captura da câmera com uma cédula de 10 reais inclinada sobre uma bolsa, com linhas coloridas ligando seus pontos aos da imagem de referência e um contorno verde sobre a cédula encontrada.">
  <figcaption>Transformação de perspectiva: o aplicativo encontra a cédula mesmo inclinada, junto de outros objetos.</figcaption>
</figure>

## Iteração com os usuários

A avaliação seguiu a avaliação cooperativa: a pessoa realiza tarefas no protótipo, a pesquisadora pergunta o que ela entendeu, registra o que mudar e observa a interação. As tarefas foram duas: encontrar e abrir o aplicativo e identificar o valor de três cédulas escolhidas por ela. Os testes foram feitos na casa das pessoas, na universidade e, no caso da criança, na escola.

<figure>
  <img src="/projetos/identificador-cedulas/ciclos-prototipos.webp" width="1135" height="470" loading="lazy" decoding="async" alt="Esquema com três protótipos ligados a uma caixa de ajustes: o primeiro e o segundo testados pelas pessoas C1 e C2, e o terceiro por C1, C3, C4, C5 e B1.">
  <figcaption>Três protótipos, três rodadas de teste e ajustes entre elas.</figcaption>
</figure>

### Primeiro protótipo: sem método de uso

O aplicativo já reconhecia as cédulas, mas comparava o quadro capturado com todas elas, sem estratégia de tempo, e o flash não era acionado. As pessoas não conseguiam alinhar a câmera à cédula e a resposta demorava, principalmente quando a nota estava no fim da lista. Sem flash, o próprio aparelho fazia sombra sobre a nota. Ninguém conseguiu usar de forma autônoma.

> "A dificuldade é fazer a câmera do celular enxergar toda a cédula, tem que saber o ângulo certo." — Participante

### Segundo protótipo: a armação de madeira

Para resolver o alinhamento, foi criada uma armação de madeira com o tamanho da maior cédula e um apoio que mantém o celular a cerca de 13 cm. O flash passou a ligar sozinho e a captura só acontecia quando o aplicativo reconhecia a cor do fundo, o que exigia uma folha branca embaixo da cédula.

<figure>
  <img src="/projetos/identificador-cedulas/armacao-madeira.webp" width="725" height="628" loading="lazy" decoding="async" alt="Desenho da armação de madeira: um retângulo de 15,6 por 7 centímetros sobre fundo branco, com a cédula de 50 reais dentro e uma haste de 13 centímetros para apoiar o celular.">
  <figcaption>Armação usada no segundo protótipo para alinhar a câmera e a cédula.</figcaption>
</figure>

Funcionou, mas ninguém queria usar. A dependência do fundo branco e da armação foi a maior insatisfação, e o aplicativo repetia "câmera ativa" mais de cinco vezes quando não conseguia ler a cor.

> "Agora funciona, mas é ruim ter que carregar tudo isso na rua. O melhor jeito seria segurar o dinheiro e ele reconhecer, aí quando estiver em mercado ou barzinho, funcionaria também." — Participante

### Terceiro protótipo: cédula na mão

A sugestão do participante virou o método. A pessoa segura a cédula na palma da mão e o celular sobre ela; ao ouvir "câmera ativa", sobe o celular rente ao corpo para alinhá-lo e, quando o quadro é capturado ("procurando"), pode soltá-lo. O aplicativo informa o valor ou "não encontrado" e reativa a câmera. O tempo de captura passou de 3 para 10 segundos, a pedido das pessoas, para dar tempo de reposicionar o aparelho.

<figure class="larga">
  <img src="/projetos/identificador-cedulas/metodo-de-uso.webp" width="1237" height="307" loading="lazy" decoding="async" alt="Três cenas de uma pessoa com a cédula na mão e o celular sobre ela: balão 'câmera ativa', balão 'procurando...' e balão 'esta cédula é de 5 reais...'.">
  <figcaption>Método de uso do terceiro protótipo, com as mensagens de retorno do aplicativo.</figcaption>
</figure>

## Avaliação com usuários

Cinco pessoas avaliaram o terceiro protótipo em uma escala de Likert de cinco pontos, para método de uso, eficácia e utilidade.

<figure>
  <img src="/projetos/identificador-cedulas/avaliacao-likert.webp" width="839" height="714" loading="lazy" decoding="async" alt="Gráfico de barras com a avaliação de cinco usuários. Método: uma pessoa regular e quatro bom. Eficácia: uma regular, duas boas e duas ótimas. Utilidade: as cinco pessoas deram nota ótimo.">
  <figcaption>Avaliação do método de uso, da eficácia e da utilidade pelas cinco pessoas.</figcaption>
</figure>

A utilidade teve nota máxima por unanimidade. O método de uso recebeu nota 4 (bom), com a ressalva de que é preciso treinar para posicionar a câmera. As cinco pessoas disseram que usariam o aplicativo, principalmente ao receber troco de desconhecidos.

> "Bah, melhorou bastante, né? Eu acho que agora está bem legal, ainda demora um pouquinho até ajustar a mão com o posicionamento da câmera do celular, mas é só treinar." — Participante

## Comparação com outros aplicativos

Para checar a confiabilidade, o aplicativo foi comparado com o Tap Tap See e o Dinheiro Brasileiro no mesmo aparelho, com todas as cédulas, na mão e sobre folha branca, com luz e no escuro. Também foram usadas cédulas manipuladas, simulando panfletos de lojas, para ver se o aplicativo evitava falsos reconhecimentos.

<figure class="larga">
  <img src="/projetos/identificador-cedulas/protocolo-comparativo.webp" width="1127" height="696" loading="lazy" decoding="async" alt="Fluxo do protocolo de teste: carregar a bateria, reiniciar o aparelho, abrir o monitor de bateria, abrir o aplicativo, testar as cédulas na mão com luz e no escuro, testar sobre folha branca com luz e no escuro, registrar o tempo e o consumo de bateria.">
  <figcaption>Protocolo de teste usado para comparar os três aplicativos.</figcaption>
</figure>

Resultado médio:

- **Método proposto:** sensibilidade de 86%, especificidade de 98% e acurácia de 89%.
- **Tap Tap See:** sensibilidade de 96%, especificidade de 33% e acurácia de 79%. Exige internet e levou mais de 30 segundos para responder.
- **Dinheiro Brasileiro:** sensibilidade de 79%, especificidade de 36% e acurácia de 68%.
- **Bateria:** 1,3% da carga para o método proposto, contra 1,1% do Tap Tap See e 6,4% do Dinheiro Brasileiro.

A alta especificidade era o objetivo: para quem não confere a nota com os olhos, não informar um valor errado importa mais do que acertar todas.

## Resultados

- **Confiável:** não confundiu valores entre as cédulas nem reconheceu as imagens manipuladas.
- **Útil na prática:** utilidade com nota máxima das cinco pessoas, que disseram que usariam o aplicativo.
- **Offline e leve:** funciona sem internet e usa pouca bateria.
- **Publicação:** artigo no SBIE 2017 (Simpósio Brasileiro de Informática na Educação).

## Aprendizados

- **A foto é o problema.** O que parecia um problema de reconhecimento de imagem era, para os usuários, um problema de posicionamento. Mudar o método de uso deu mais resultado do que otimizar o algoritmo.
- **A melhor ideia veio do teste.** A armação de madeira resolvia o alinhamento, mas era uma solução da pesquisadora. A cédula na mão foi uma sugestão de um participante e eliminou o acessório.
- **Ensinar o leitor de telas faz parte do produto.** Boa parte das pessoas nunca tinha usado TalkBack ou tela sensível ao toque; um dos participantes comprou um smartphone durante o estudo.
- **Mensagem repetida cansa.** Ouvir "câmera ativa" várias vezes sem sucesso gerou mais frustração do que uma resposta lenta.
- **Melhor errar para o lado seguro.** Priorizar especificidade foi uma decisão de design: "não encontrado" é aceitável, um valor errado não.

## Próximos passos

As pessoas pediram resposta mais rápida sem perda de confiabilidade, controle por comando de voz, acionamento por um botão do celular e um apoio para segurar o aparelho. Do lado técnico, ficaram em aberto um método mais preciso para a cor, que o flash de cada aparelho altera, e a comparação em paralelo das 24 possibilidades de lado da cédula. A publicação na loja do Android também estava prevista.

<!-- REVISAR: verificar se o código do aplicativo está disponível em algum repositório e se o aplicativo chegou a ser publicado na loja Android. -->

## Vínculo institucional

Dissertação de mestrado no Programa de Pós-Graduação Stricto Sensu em Engenharia Elétrica da UNIPAMPA, defendida em 07/05/2015. Orientação do Prof. Dr. Daniel Welfer.
