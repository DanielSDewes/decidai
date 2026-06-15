# DecidAI — SAD para Planejamento de Produção sob Incerteza

Prova de conceito do trabalho **"IA no Processo Decisório"** (Tópicos Especiais
em Computação II – A / URI). Demonstra como a IA **otimiza, suporta e automatiza**
uma decisão organizacional recorrente: *quanto produzir de cada produto nesta
semana*, sob demanda incerta e recursos limitados.

## Pipeline de decisão

```
Dados sintéticos
   └─> Previsão de demanda (Machine Learning / RandomForest)   [forecast.py]
        └─> Cenários de incerteza (Monte Carlo + Cadeia de Markov)  [simulation.py]
             └─> Decisão ótima (Programação Linear / Simplex)   [optimization.py]
                  └─> Explicação executiva (XAI: SHAP + duais + LLM)  [xai.py]
                       └─> Dashboard executivo (Streamlit)       [app/dashboard.py]
```

## Conexão com a teoria da disciplina

| Conceito | Onde aparece |
|---|---|
| **Shimizu** (SAD: dados/modelo/interface; problema semiestruturado) | arquitetura geral |
| **Markov** (regimes de demanda + matriz de transição) | `simulation.py` |
| **Monte Carlo** (risco × incerteza) | `simulation.py` |
| **Simplex / Pesquisa Operacional** (mix ótimo, preços-sombra) | `optimization.py` |
| **IA Preditiva** (previsão de demanda) | `forecast.py` |
| **XAI / Explicabilidade** (SHAP, duais, justificativa em PT) | `xai.py` |

## Como rodar

```bash
# 1. Instalar dependências
pip install -r requirements.txt

# 2. Rodar o pipeline completo no terminal
python pipeline.py

# 3. Abrir o dashboard executivo
streamlit run app/dashboard.py

# 4. Rodar os testes
python -m pytest tests/ -q
```

> Para a explicação via LLM (opcional), defina a variável de ambiente
> `ANTHROPIC_API_KEY`. Sem ela, o sistema usa uma explicação por template
> (a demo nunca trava).

## Estrutura

```
decidai/
├── config.py          # parâmetros de negócio (produtos, capacidades, Markov)
├── data_gen.py        # gerador de dados sintéticos reprodutível
├── forecast.py        # camada preditiva (ML)
├── simulation.py      # incerteza: Monte Carlo + Markov
├── optimization.py    # camada prescritiva: Simplex (PuLP/CBC)
├── xai.py             # explicabilidade
├── pipeline.py        # orquestração ponta a ponta + análise de sensibilidade
├── app/dashboard.py   # interface Streamlit (entrega executiva)
└── tests/test_smoke.py
```

## Limitações (para o relatório)

- Dados **sintéticos** — não capturam choques reais de mercado.
- O modelo de ML reproduz padrões do **histórico** (risco de viés).
- A **linearidade** do Simplex simplifica relações reais (ganhos de escala etc.).
- Otimização sobre a **demanda esperada**; uma extensão natural é a
  programação estocástica de 2 estágios.
