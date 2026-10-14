---
titulo: "CLAT: avaliação da escrita inicial infantil em dispositivos móveis"
slug: clat
vinculo: "Doutorado em Ciência da Computação, Universidade Federal de Goiás (UFG)"
periodo: "2019–2022"
resumo: "Estudo de caso de UX: da pesquisa com professoras, famílias e crianças a dois aplicativos que levam para o tablet a avaliação da escrita inicial, preservando o traçado da criança e o modo como ela lê o que escreveu."
tecnologias:
  - "Design Science Research"
  - "Pesquisa com usuários"
  - "Interação Criança-Computador (TIDRC)"
  - "Figma e FigJam"
  - "React Native"
  - "Firebase"
  - "Tablets e canetas de toque"
repos: []
destaque: true
ordem: 1
tese: tese-clat
imagemAlt: "Telas do aplicativo infantil CLAT: botão de iniciar, palavra PRATO escrita à mão na tela e gravação da leitura da criança."
---

## Visão geral

O CLAT (<span lang="en">Children Literacy Aid Tools</span>) é um par de aplicativos para tablets e celulares. Com eles, professoras criam atividades de escrita com a própria voz, e crianças de 4 a 8 anos escrevem à mão na tela e leem o que escreveram tocando com o dedo. A professora recebe o registro completo: o traçado, a marca da leitura e o áudio da criança.

- **Papel:** autoria de todo o processo, da pesquisa com usuários ao design de interação e de interface, à implementação dos dois aplicativos e à condução dos testes nas escolas, durante a pandemia de COVID-19, com orientação do Prof. Fabrizzio Soares.
- **Pessoas envolvidas:** 104 profissionais e 119 familiares no questionário; 5 especialistas na inspeção de usabilidade; 8 crianças no teste de conceito; 92 crianças e 6 professoras em três escolas.
- **Entregas:** CLATPro (aplicativo da professora) e CLAT (aplicativo da criança e da família), com publicação em teste interno na Play Store.

## O desafio

Na alfabetização, a professora não avalia se a criança escreveu "certo". Ela observa como a criança está entendendo o sistema de escrita: quais letras escolhe, quantas usa, o que apaga e, principalmente, como lê o que escreveu, apontando com o dedo no papel. Esse gesto mostra, por exemplo, se a criança já percebe as sílabas.

<figure>
  <img src="/projetos/clat/ditado-em-papel.webp" width="1277" height="378" loading="lazy" decoding="async" alt="Quadrinho em três cenas: a professora pede que a criança escreva uma palavra, depois pede que leia tocando com o dedo no papel, e então desenha no papel o gesto que a criança fez.">
  <figcaption>Como a avaliação acontece em sala: a criança escreve, lê apontando com o dedo, e a professora registra o gesto.</figcaption>
</figure>

Quando as escolas fecharam em 2020, essa avaliação parou. As ferramentas digitais disponíveis só ofereciam escrita por teclado e não capturavam nem o traçado nem a leitura. A pergunta do projeto passou a ser: **como os dispositivos móveis podem apoiar a avaliação remota da escrita inicial, sem perder os sinais que as professoras consideram essenciais?**

## Processo

A pesquisa seguiu a <span lang="en">Design Science Research</span>, organizada em três ciclos: relevância (entender o problema no contexto real), design (criar e avaliar os artefatos) e rigor (validar com usuários e com a literatura).

<figure>
  <img src="/projetos/clat/etapas-pesquisa.webp" width="1087" height="1280" loading="lazy" decoding="async" alt="Caminho ilustrado com as etapas do projeto: mapeamento sistemático, experimento com testes em papel, primeiro protótipo, grupo focal, avaliação heurística, survey, definição de requisitos, modelagem das interações, desenvolvimento dos artefatos, experimento com crianças, estudo de caso nas escolas, entrevista com professoras e publicação dos achados.">
  <figcaption>Etapas do projeto, distribuídas nos ciclos de relevância, design e rigor.</figcaption>
</figure>

## Descoberta

### O que já existia

Um mapeamento sistemático analisou 3.578 títulos e selecionou 22 estudos sobre ferramentas digitais para a escrita inicial. Poucas tinham foco em avaliação, quase nenhuma oferecia uma área para a professora criar atividades, e a escrita manual era pouco valorizada.

### Primeiro protótipo e pesquisa contextual

O primeiro protótipo ditava quatro palavras e uma frase com voz sintetizada e pedia que a criança lesse "com o dedo". Ao testá-lo com professoras de uma escola parceira, a ideia inicial mudou. Cada professora interpreta a escrita de um jeito, nem todas fazem ditado, e a voz sintetizada atrapalha o entendimento das crianças por causa da variação de sotaque.

<figure>
  <img src="/projetos/clat/primeiro-prototipo.webp" width="1204" height="700" loading="lazy" decoding="async" alt="Seis telas do primeiro protótipo em tablet: a profissional escolhe o tema, o aplicativo dita a palavra, a criança escreve, lê tocando com o dedo e o relatório é gerado para a profissional.">
  <figcaption>Primeiro protótipo: ditado com temas fixos e voz sintetizada.</figcaption>
</figure>

### Inspeção de usabilidade

Cinco especialistas avaliaram o protótipo com 51 recomendações do <span lang="en">Touchscreen Interaction Design Recommendations for Children</span> (TIDRC), adequadas a crianças de 4 a 8 anos. O protótipo atendia a 72% delas. Os pontos críticos foram a voz sintetizada, o vídeo-tutorial e o botão de finalizar, uma estrela que não deixava claro o que fazer depois.

<figure>
  <img src="/projetos/clat/aderencia-tidrc.webp" width="1202" height="360" loading="lazy" decoding="async" alt="Gráfico de barras divergente: 72% de concordância, 18% neutro e 10% de discordância quanto à aderência do protótipo às recomendações TIDRC.">
  <figcaption>Aderência geral do primeiro protótipo às recomendações de interação para crianças.</figcaption>
</figure>

### Questionário com profissionais e famílias

Com as escolas fechadas, a pesquisa foi para um questionário on-line, entre abril e junho de 2020. Responderam 104 profissionais da alfabetização, de todas as regiões do país, e 119 familiares de crianças de 4 a 7 anos.

<figure>
  <img src="/projetos/clat/perfil-profissionais.webp" width="972" height="738" loading="lazy" decoding="async" alt="Infográfico do perfil dos 104 profissionais: 94% do gênero feminino, 76% com pós-graduação, 73% atuam há mais de 5 anos, 60% no Centro-Oeste e Sudeste, 83% aplicam ditados de palavras e 79% avaliam conforme Emília Ferreiro.">
  <figcaption>Perfil dos profissionais que responderam ao questionário.</figcaption>
</figure>

<figure>
  <img src="/projetos/clat/desafios-ditado.webp" width="1144" height="480" loading="lazy" decoding="async" alt="Ranking dos cinco principais desafios na aplicação de ditados individuais: quantidade de crianças na turma (31%), manter as demais crianças em atividade (17%), ambiente adequado (15%), organização dos registros (14%) e avaliação dos resultados (13%).">
  <figcaption>O tamanho da turma é o maior obstáculo para a avaliação individual.</figcaption>
</figure>

Entre os achados das famílias: 42% enviavam fotos das atividades por redes sociais, 40% achavam que as atividades não estavam sendo avaliadas, e 41% apontaram a dependência de um adulto como a maior dificuldade do ensino remoto.

## Definição

### Personas e mapa de empatia

Os dados viraram personas para os três públicos: profissional, criança e familiar. A professora recebeu também um mapa de empatia, porque é ela quem concentra as dificuldades: muitas turmas, muitas famílias e o celular pessoal como ferramenta de trabalho.

<figure>
  <img src="/projetos/clat/personas.webp" width="1173" height="564" loading="lazy" decoding="async" alt="Duas fichas de persona: Fernando, pai, e Ana, professora, cada uma com necessidades, desejos, frustrações, personalidade e uso de tecnologia.">
  <figcaption>Exemplos de personas: o pai e a professora.</figcaption>
</figure>

<figure class="larga">
  <img src="/projetos/clat/mapa-empatia.webp" width="1199" height="1070" loading="lazy" decoding="async" alt="Mapa de empatia da professora com falas reais do questionário. Fala e pensa: falta de rede de apoio, vontade de fazer mais avaliações individuais e preocupação com a interferência dos pais. Faz: avaliações individuais, recebe fotos das atividades. Sente: sobrecarga, ansiedade, desconforto e preocupação.">
  <figcaption>Mapa de empatia da professora, montado com falas do questionário e de conversas com profissionais.</figcaption>
</figure>

### Jornada da avaliação em papel

A jornada mostra a avaliação tradicional em três estágios: planejamento, aplicação e análise. Os pontos baixos indicam onde o digital pode ajudar: só conseguir avaliar duas crianças por dia e não encontrar a avaliação anterior na pasta da criança.

<figure class="larga">
  <img src="/projetos/clat/mapa-jornada.webp" width="1205" height="1382" loading="lazy" decoding="async" alt="Mapa de jornada da professora Ana em planejamento, aplicação e análise, com o que ela faz, uma curva de emoções positivas, neutras e negativas e uma faixa de oportunidades, como reusar listas, capturar o gesto de leitura, permitir várias crianças ao mesmo tempo e organizar os registros.">
  <figcaption>Jornada da avaliação em papel, com as oportunidades para o projeto na última faixa.</figcaption>
</figure>

### Requisitos

- Voz gravada pela própria professora, nunca sintetizada, para respeitar os sotaques.
- Captura da escrita à mão e do modo de leitura da criança.
- Dois tipos de atividade: ditado e escrita temática (livre, a partir de um tema).
- Personalização do enunciado, das imagens e da lista de palavras, sem limite de itens.
- Mensagens de incentivo no fim da atividade.
- Data de liberação escolhida pela professora, acompanhamento e relatórios por criança.
- Consentimento dos responsáveis, conforme a LGPD, antes de qualquer uso pela criança.

## Ideação e arquitetura

A solução foi dividida em dois aplicativos. O **CLATPro** é da professora e foi desenhado primeiro para o celular, o instrumento de trabalho dela na pandemia. A gravação de áudio imita o gesto de mandar mensagem de voz nos grupos da turma. O **CLAT** é da criança e da família e foi desenhado para o tablet, com mais área para escrever.

<figure>
  <img src="/projetos/clat/panorama-solucao.webp" width="968" height="962" loading="lazy" decoding="async" alt="Ilustração com o CLAT no centro, ligado a seis ideias: compartilhamento com outros profissionais, flexibilidade para realizar as atividades, diversidade de dispositivos com tela sensível ao toque, personalização das atividades pela profissional, suporte em sala de aula e acompanhamento dos familiares.">
  <figcaption>Panorama da solução.</figcaption>
</figure>

A criança só entra pelo acesso de um responsável, que dá o consentimento no primeiro uso. A professora pode cadastrar a criança, mas a atividade só fica disponível depois dessa autorização.

<figure>
  <img src="/projetos/clat/fluxo-crianca.webp" width="1067" height="936" loading="lazy" decoding="async" alt="Fluxo da criança: tela inicial, iniciar, instruções em áudio, tela de escrita, tela de leitura e a decisão 'há mais palavras para ditar?', que volta para a escrita ou segue para a tela final com áudio de incentivo.">
  <figcaption>Fluxo da criança: escrever e ler se repetem enquanto houver palavras no ditado.</figcaption>
</figure>

<figure class="larga">
  <img src="/projetos/clat/fluxo-profissional.webp" width="1400" height="552" loading="lazy" decoding="async" alt="Fluxo da profissional no CLATPro, com quatro áreas: acesso e primeiro uso, demonstração e termos de privacidade, atividades (criar ditado ou escrita temática, inserir palavras e instruções, salvar) e crianças (cadastrar, recuperar dados pelo código dos familiares, aguardar liberação).">
  <figcaption>Fluxo da profissional no CLATPro, feito no FigJam.</figcaption>
</figure>

## Identidade visual

O nome CLAT também é o do personagem: um lápis que guia as crianças. A logo usa tipografia arredondada, a preferida das crianças em estudos com esse público, e a paleta usa tons claros e vibrantes.

<figure>
  <img src="/projetos/clat/moodboard.webp" width="1086" height="652" loading="lazy" decoding="async" alt="Moodboard com fotos de crianças escrevendo e desenhando, quatro cores (azul, laranja, rosa e verde) e a logo do CLAT, com letras coloridas sobre um lápis e um tablet.">
  <figcaption>Moodboard, paleta e logo.</figcaption>
</figure>

<figure>
  <img src="/projetos/clat/avatar.webp" width="201" height="440" loading="lazy" decoding="async" alt="Personagem CLAT: um lápis laranja com olhos grandes, sorriso e borracha azul na ponta.">
  <figcaption>O personagem CLAT, usado nas animações.</figcaption>
</figure>

## Wireframes

<figure class="larga">
  <img src="/projetos/clat/wireframe-clat.webp" width="1129" height="406" loading="lazy" decoding="async" alt="Wireframes do aplicativo infantil: tela inicial com avatar e botão de iniciar, variações com e sem áudio inicial e com e sem figura, tela de escrita e tela final com uma estrela.">
  <figcaption>Wireframe do aplicativo infantil, com as variações de atividade.</figcaption>
</figure>

<figure class="larga">
  <img src="/projetos/clat/wireframe-clatpro.webp" width="1204" height="414" loading="lazy" decoding="async" alt="Wireframes do CLATPro: formulário de dados da criança, lista de crianças com o rótulo 'aguardando autorização', busca de cadastro pelo código dos responsáveis e lista de palavras.">
  <figcaption>Wireframe do CLATPro.</figcaption>
</figure>

## Interface final

No aplicativo infantil, cada decisão responde a uma recomendação do TIDRC ou a um problema da inspeção:

- a tela ficou limpa, com a área de escrita separada dos botões;
- os botões são grandes, espaçados e com aparência de "apertáveis";
- os ícones imitam objetos conhecidos: lixeira, seta, alto-falante e o "play" dos jogos;
- a confirmação usa ícones e áudio, não texto, porque a criança ainda não lê;
- há um botão para desfazer o último traço;
- a figura do ditado fecha sozinha depois de 3 segundos;
- durante a leitura, um microfone animado lembra as mensagens de voz.

<figure class="larga">
  <img src="/projetos/clat/telas-clat.webp" width="1200" height="880" loading="lazy" decoding="async" alt="Seis telas do aplicativo infantil, com destaques em vermelho: botão de iniciar, animação durante o áudio da professora, janela de figura que fecha sozinha, botões de desfazer e limpar abaixo da palavra PRATO escrita à mão, confirmação com ícones e microfone animado durante a leitura.">
  <figcaption>Telas do aplicativo infantil, com as decisões de usabilidade destacadas.</figcaption>
</figure>

No CLATPro, a professora monta o ditado item por item: figura opcional, palavra esperada e áudio com a própria voz. Ela também grava a mensagem inicial, a instrução de leitura e até três áudios de incentivo. As listas de palavras podem ser reusadas e compartilhadas com outras professoras, como já acontecia no planejamento em conjunto nas escolas.

<figure class="larga">
  <img src="/projetos/clat/telas-ditado.webp" width="1206" height="1218" loading="lazy" decoding="async" alt="Oito telas de criação de ditado no CLATPro: gravar a mensagem inicial, editar a lista de palavras, adicionar figura, palavra e áudio a cada item, salvar o grupo para reuso, gravar a instrução de leitura, gravar áudios de incentivo, selecionar crianças e definir título e data.">
  <figcaption>Criação de uma sessão de ditado no CLATPro.</figcaption>
</figure>

No acompanhamento, cada atividade aparece como agendada, em progresso ou finalizada. A professora vê o traçado da criança, a marca de como ela leu (em vermelho) e ouve o áudio da leitura. Também pode escrever um parecer e exportar relatórios em PDF.

<figure class="larga">
  <img src="/projetos/clat/telas-acompanhamento.webp" width="1204" height="1262" loading="lazy" decoding="async" alt="Telas de acompanhamento no CLATPro: lista de atividades com status, busca e filtros, crianças que já finalizaram, registro da criança com a escrita, a marca de leitura e o áudio, campo de comentário e exportação de relatório em PDF.">
  <figcaption>Acompanhamento das atividades e geração de relatórios.</figcaption>
</figure>

## Teste de conceito com crianças

Antes de ir às escolas, oito crianças de 4 a 7 anos fizeram o mesmo ditado de três formas: papel e lápis, tablet com o dedo e tablet com caneta de toque. Algumas sessões foram híbridas, com a pesquisadora na videochamada pela televisão da casa. A avaliação usou o <span lang="en">Fun Toolkit</span>, feito para crianças pequenas.

<figure>
  <img src="/projetos/clat/protocolo-teste.webp" width="1158" height="1172" loading="lazy" decoding="async" alt="Nove etapas do protocolo: escala de carinhas sobre como a criança se sente ao escrever, ditado em papel, escala de carinhas, ditado no tablet com o dedo, escala de carinhas, ditado no tablet com caneta, escala de carinhas, tabela 'faria de novo?' e classificação de melhor e pior recurso.">
  <figcaption>Protocolo do teste de conceito, ajustado depois do piloto para durar no máximo 30 minutos.</figcaption>
</figure>

<figure>
  <img src="/projetos/clat/fun-sorter.webp" width="966" height="562" loading="lazy" decoding="async" alt="Gráfico de barras empilhadas sobre o melhor e o pior recurso: tablet com caneta foi o melhor para 75% das crianças; tablet com o dedo foi o pior para 62,5%; papel e lápis dividiu opiniões.">
  <figcaption>A caneta de toque foi a preferida; escrever com o dedo, a menos preferida.</figcaption>
</figure>

<figure class="larga">
  <img src="/projetos/clat/registros-escrita.webp" width="1181" height="254" loading="lazy" decoding="async" alt="A palavra BANANA escrita pela mesma criança em papel e lápis, no tablet com o dedo e no tablet com caneta de toque. Com o dedo, as letras ficam maiores e irregulares.">
  <figcaption>A mesma palavra escrita em papel, no tablet com o dedo e no tablet com caneta.</figcaption>
</figure>

## Validação nas escolas

O teste final simulou o cenário remoto dentro da escola. As professoras criaram as atividades no próprio celular e seguiram com a turma, enquanto as crianças faziam a atividade nos tablets, longe delas. Depois, cada professora avaliou os registros no aplicativo e deu uma entrevista. Participaram três escolas (federal, privada e municipal), sete turmas, 92 crianças e seis professoras.

<figure>
  <img src="/projetos/clat/etapas-escolas.webp" width="967" height="960" loading="lazy" decoding="async" alt="Oito etapas da validação: contato com direção e coordenação, sensibilização das professoras, sensibilização dos familiares, coleta das autorizações, criação das atividades pelas professoras, teste com as crianças, acompanhamento dos registros e entrevista com as professoras.">
  <figcaption>Etapas da validação nas escolas.</figcaption>
</figure>

As seis professoras afirmaram que é possível avaliar a escrita inicial pelos registros do aplicativo. Elas destacaram a captura do traçado e da voz, a facilidade de uso e o papel da professora como autora das atividades.

> "Nenhuma [plataforma] eu tinha visto o rendimento do aluno com as próprias mãozinhas deles. A gente nunca ouviu a vozinha deles. Então, esse eu achei incrível e inovador." — Professora participante

> "Eu acho que o aplicativo praticamente consegue 100% do tempo reproduzir o que a criança tem de acesso no caderno." — Professora participante

## Resultados

- **Problema resolvido:** professoras criaram as atividades e avaliaram os registros sem perda importante em relação ao papel.
- **Autonomia das crianças:** as interfaces baseadas nas diretrizes de Interação Criança-Computador permitiram que as crianças fizessem a atividade sozinhas.
- **Além do remoto:** as professoras viram uso também no presencial, em momentos avaliativos, tarefas de casa, trabalho coletivo e recuperação da aprendizagem.
- **Reconhecimento:** melhor trabalho do V Prêmio Luiz Fernando de Computação (SBC, 2020), artigos em conferências como HCI International, IEEE SMC e IDC, e 12 reportagens na mídia.

## Aprendizados

- **O entusiasmo engana.** As crianças avaliavam tudo como ótimo, mesmo depois de apagar várias vezes. A observação do comportamento foi mais confiável que as respostas.
- **Caneta e dedo, os dois.** A caneta foi a preferida no teste de conceito, mas nas escolas muitas crianças tiveram dificuldade e alternaram com o dedo. A interface precisa aceitar os dois, de preferência com uma caneta maior, parecida com um lápis.
- **Autonomia precisa ser dita.** Na escola, as crianças esperam permissão do adulto. Explicar que podiam tocar em tudo e seguir sozinhas mudou o teste.
- **Consentimento é um problema de design.** Um bilhete simples para as famílias, explicando a atividade sem linguagem jurídica, funcionou melhor que o termo padrão.
- **Grupo focal não serve para crianças muito pequenas.** No 1º ano, as respostas eram curtas e genéricas; no 2º ano, surgiram críticas e sugestões úteis.

## Próximos passos

As professoras pediram versão para computador, uma prévia da atividade como a criança vai ver, linhas na área de escrita, uma forma de dar retorno à criança e novos tipos de atividade, como ligar figuras a palavras. Ficaram em aberto o estudo em celulares, o acompanhamento de turmas por mais tempo e a análise automática de letras espelhadas, iniciada antes da pandemia.

<!-- REVISAR: confirmar se o aplicativo CLATPro teve uso continuado após a tese, ou se permanece como protótipo de pesquisa. -->

<!-- REVISAR: verificar se existe repositório de código do CLATPro a ser vinculado. -->


## Vínculo institucional

Pesquisa de doutorado no Programa de Pós-Graduação em Ciência da Computação do Instituto de Informática da UFG, defendida em 21/12/2022, com aprovação do Comitê de Ética em Pesquisa da UFG. Orientação do Prof. Dr. Fabrizzio Alphonsus Alves de Melo Nunes Soares.
