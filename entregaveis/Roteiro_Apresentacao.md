# Roteiro da Apresentação — DecidAI

**Formato:** entrega executiva a um comitê de decisão · 30 minutos · 14 slides
**Integrantes:** Daniel Dewes · Cesario Stoquero · Samuel Maciel · Guilherme Capeletti

> Postura geral: vocês não são "alunos apresentando um trabalho", são uma **consultoria
> entregando uma recomendação a um comitê**. Falem de lucro, risco e gargalo — não de
> "código" e "função". O slide é o apoio visual; a fala conduz a decisão.

---

## Divisão das falas (visão geral)

| Bloco | Tempo | Slides | Quem fala | Por quê (alinhado ao que cada um construiu) |
|---|---|---|---|---|
| Abertura | ~1 min | 1–2 | **Daniel** | Orquestrou o pipeline → mestre de cerimônia, abre e fecha o tom |
| 1 · Pitch do Problema | 5 min | 3–4 | **Guilherme** | Modelou os parâmetros de negócio → domina o contexto e a "dor" |
| 2 · Fundamentação Teórica | 5 min | 5–6 | **Cesario** | Dono de Markov, Monte Carlo e Simplex (a teoria pesada) |
| 3 · Demonstração — arquitetura | ~3 min | 7 | **Daniel** | Construiu `data_gen`, `forecast` e o `pipeline` (a espinha do fluxo) |
| 3 · Demonstração — demo ao vivo | ~7 min | 8 | **Samuel** | Construiu o dashboard Streamlit |
| 4 · Plano ótimo | ~2 min | 9 | **Cesario** | O plano é a saída do Simplex que ele modelou |
| 4 · Risco (Monte Carlo) | ~1,5 min | 10 (esq.) | **Daniel** | A agregação de risco vive no `pipeline.py` dele |
| 4 · Gargalo (Simplex) | ~1,5 min | 10 (dir.) | **Cesario** | Preços-sombra vêm da otimização |
| 4 · Sensibilidade | ~2 min | 11 | **Daniel** | `analise_sensibilidade()` está no `pipeline.py` |
| 4 · Explicabilidade (XAI) | ~1,5 min | 12 | **Samuel** | Construiu a camada `xai.py` |
| 4 · Crítica + Fechamento | ~1,5 min | 13–14 | **Guilherme** | Responsável por testes/validação → visão crítica e limitações |

**Tempo total por pessoa (aprox.):** Daniel ~7,5 · Cesario ~8,5 · Samuel ~8,5 · Guilherme ~6,5
Os tempos são guias — quem terminar antes passa a palavra com a deixa indicada.

---

## ABERTURA — Slides 1–2 · **Daniel** · ~1 min

**Slide 1 (capa).**
> "Bom dia. Somos o grupo DecidAI — Daniel, Cesario, Samuel e Guilherme. Nos próximos
> 30 minutos não vamos apresentar um programa: vamos entregar a este comitê uma
> **recomendação de produção** para a próxima semana, com o lucro, o risco e a
> justificativa por trás dela."

**Slide 2 (roteiro).**
> "O caminho é este: primeiro a dor que estamos resolvendo (5 min), depois a teoria que
> sustenta a solução (5 min), em seguida a IA funcionando ao vivo (10 min) e, por fim,
> os resultados com uma crítica honesta — o que ela aprendeu e onde falha (10 min).
> Para abrir o problema, passo ao Guilherme."

---

## BLOCO 1 — PITCH DO PROBLEMA · Slides 3–4 · **Guilherme** · 5 min

**Slide 3 (o problema).** *(~3 min)*
- Apresente a AgroVale: agroindústria, 5 produtos, **uma mesma fábrica compartilhada**.
- A dor concreta: toda semana decide-se **quanto produzir de cada item** — hoje "no feeling"
  e em planilhas, sob **demanda incerta** e **recursos limitados** (máquina, matéria-prima, capital).
- O custo do erro tem **dois lados**: **superprodução** (perde produto perecível, imobiliza capital)
  e **ruptura** (perde venda, irrita o cliente). Os dois cartões à direita são isso.
- Feche o slide nomeando a natureza do problema:
> "Segundo Shimizu, este é um problema **semiestruturado**: as restrições e o lucro são
> modeláveis, mas a demanda futura e o julgamento gerencial não são totalmente formalizáveis.
> É exatamente onde um Sistema de Apoio à Decisão entrega mais valor — ele apoia, não substitui."

**Slide 4 (stakeholders).** *(~2 min)*
- Quatro interessados com objetivos que brigam: Produção quer estabilidade; Vendas quer estoque
  alto; Financeiro quer pouco capital parado; Direção quer lucro.
- O ponto central (faixa azul embaixo): **trade-off nível de serviço × custo**.
> "Nenhum desses lados está errado — eles só puxam para direções opostas. O que falta é uma
> ferramenta que torne esse conflito **explícito e quantificável**. É o que vamos fundamentar
> agora; passo ao Cesario."

---

## BLOCO 2 — FUNDAMENTAÇÃO TEÓRICA · Slides 5–6 · **Cesario** · 5 min

**Slide 5 (Shimizu).** *(~2 min)*
- Abra pela citação: decisão não é só cálculo, é processo organizacional.
- Apresente a arquitetura clássica de SAD: **três subsistemas** — Dados, Modelos, Interface.
> "Toda a nossa solução é uma instância dessa arquitetura: dados de venda alimentam um
> conjunto de modelos encadeados, e uma interface entrega tudo ao decisor."

**Slide 6 (teoria → técnica).** *(~3 min)* — este é o slide que o professor mais valoriza; conecte cada técnica a um conceito da disciplina.
- **Machine Learning** → IA Preditiva: prevê a demanda de cada produto.
- **Cadeia de Markov** → processos estocásticos: modela o **regime de mercado** (baixa/normal/alta)
  com uma matriz de transição; a distribuição estacionária diz quanto tempo o mercado passa em cada regime.
- **Monte Carlo** → simulação: combina o regime (Markov) com o erro do ML em **2.000 cenários**,
  operacionalizando a distinção **risco** (probabilidades conhecidas) × **incerteza** (erro residual).
- **Simplex / PL** → Pesquisa Operacional: decide o **mix ótimo** sob as restrições.
- **XAI** → Explicabilidade: justifica a decisão em linguagem de gestor.
> "Repare que nenhuma técnica sozinha resolve o problema — prever não é decidir. O valor está
> na **orquestração**. E é essa orquestração que o Daniel vai mostrar funcionando."

---

## BLOCO 3 — DEMONSTRAÇÃO DA SOLUÇÃO · Slides 7–8 · 10 min

### Slide 7 (arquitetura / pipeline) · **Daniel** · ~3 min
- Caminhe pelo pipeline da esquerda para a direita: **Dados → Previsão → Incerteza → Decisão → Explicação.**
- Destaque que a etapa "Decisão" (em dourado) é o coração: é onde o Simplex transforma cenários
  em um plano factível.
- Aponte a faixa de baixo: o **dashboard (interface)** consome esse pipeline e permite simulações what-if.
> "Cada caixa dessas é um módulo Python independente e testado. Em vez de explicar o código,
> deixa eu mostrar tudo isso rodando — Samuel, pode abrir o dashboard."

### Slide 8 (demonstração ao vivo) · **Samuel** · ~7 min
> **Antes de apresentar:** ter o Streamlit já aberto em `http://localhost:8501` e um
> **vídeo de backup** pronto caso a demo falhe (mencionado no slide).

Roteiro da demo ao vivo (siga os 4 passos do slide):
1. **Ajustar** — mostre os sliders de capacidade na barra lateral (horas de máquina, matéria-prima, orçamento).
   Explique: "são as restrições reais da fábrica; o comitê pode testar qualquer cenário."
2. **Rodar** — clique em *Rodar recomendação*. "Em segundos a IA prevê, simula 2.000 cenários e otimiza."
3. **Ver o plano** — leia as 3 métricas (lucro ótimo, lucro médio, pior caso) e o gráfico de barras do plano.
4. **Entender** — leia em voz alta a explicação XAI e mostre os preços-sombra (gargalo) e o uso de recursos.
5. **What-if (o momento mais forte):** arraste o slider de **Orçamento** para cima e rode de novo —
   mostre o lucro subir; depois suba **horas de máquina** e mostre que **não muda nada**.
> "Isso prova ao comitê, ao vivo, onde vale a pena investir: orçamento, não máquina. Com os
> números na mesa, passo ao bloco de resultados e crítica."

---

## BLOCO 4 — RESULTADOS E CRÍTICA · Slides 9–14 · 10 min

### Slide 9 (plano ótimo) · **Cesario** · ~2 min
- Leia o plano recomendado e o **lucro ótimo: R$ 18.295,64**.
- Destaque o **insight não óbvio**: *Doce em Barra* quase não é produzido (15 un.) — boa margem,
  mas consome recursos demais por unidade. "A otimização revela o que a intuição não enxerga."

### Slide 10 (risco + gargalo) · **handoff Daniel → Cesario** · ~3 min
- **Daniel (metade esquerda — risco / Monte Carlo, ~1,5 min):**
  > "Esse lucro não é uma promessa, é o topo. Nos 2.000 cenários, o lucro **médio** é R$ 17.271,96
  > e mesmo no **pior caso (p5)** fica em R$ 14.678,60 — ou seja, o plano é **robusto**: a incerteza
  > só pode puxar para baixo, e o piso ainda é saudável."
- **Cesario (metade direita — gargalo / Simplex, ~1,5 min):**
  > "E por que esse plano e não outro? Os preços-sombra respondem: o **orçamento é o gargalo** —
  > cada R$ 1 a mais gera R$ 1,23 de lucro. As horas de máquina sobram (preço-sombra zero)."

### Slide 11 (sensibilidade) · **Daniel** · ~2 min
- Leia a curva de lucro × orçamento.
- Mensagem-chave: **retornos decrescentes** — aumentar o orçamento eleva o lucro até ~+10%; depois
  a **matéria-prima** passa a restringir e o lucro estabiliza em R$ 18.378,94.
> "Isso é o que um comitê quer: não só 'invista mais', mas **até onde** investir vale a pena."

### Slide 12 (XAI) · **Samuel** · ~1,5 min
- Os três níveis de explicação: **preços-sombra** (por que é ótimo), **SHAP** (o que dirige a previsão),
  **LLM/Claude** (parágrafo executivo em português).
> "Respondendo ao Shimizu: o gestor não recebe uma caixa-preta — ele recebe o número **e** o porquê."

### Slides 13–14 (crítica + fechamento) · **Guilherme** · ~1,5 min
**Slide 13 — seja honesto, isto vale nota:**
- **O que aprendeu:** padrões sazonais, prioridade de produtos sob escassez, qual recurso limita o lucro.
- **Onde falha:** dados sintéticos não capturam choques reais; viés do histórico se propaga; linearidade
  ignora ganhos de escala.
- **Próximos passos:** validar com dados reais, programação estocástica de 2 estágios, integração ao ERP.

**Slide 14 (fechamento):**
> "Em uma frase: o DecidAI transforma **dados em uma decisão defensável** — previsão, simulação,
> otimização e explicação num único fluxo que recomenda **e** justifica. Obrigado; abrimos para perguntas."

---

## Perguntas prováveis do professor (preparem-se)

- **"Por que IA e não uma planilha/regressão?"** → Prever não é decidir; regressão ignora restrições e
  margens. O valor está em integrar previsão + risco + otimização num plano factível. *(Cesario/Daniel)*
- **"Risco vs. incerteza, qual a diferença aqui?"** → Risco = regimes de Markov (probabilidades conhecidas);
  incerteza = erro residual do ML. Monte Carlo junta os dois. *(Cesario)*
- **"O que é preço-sombra, na prática?"** → Quanto de lucro extra cada unidade adicional de um recurso geraria;
  é a explicação nativa do Simplex e aponta o gargalo. *(Cesario)*
- **"E se os dados forem ruins/enviesados?"** → Limitação assumida (slide 13); por isso o próximo passo é
  validar com dados reais e a decisão final permanece com o gestor. *(Guilherme)*
- **"A demo é real ou simulada?"** → Real: roda o mesmo pipeline `pipeline.py`; o dashboard só consome a saída. *(Samuel/Daniel)*
