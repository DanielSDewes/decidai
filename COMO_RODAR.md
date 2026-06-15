# Como rodar o DecidAI

Guia rápido para avaliação do projeto. Tempo estimado: ~5 minutos.

## 1. Pré-requisitos

- **Python 3.11+** (testado em 3.14) — verifique com:
  ```bash
  python --version
  ```
- (Opcional) **Node.js 18+** — apenas se quiser **regenerar** o relatório `.docx` ou os slides `.pptx`
  a partir dos geradores em `entregaveis/`. Para avaliar, isso **não** é necessário: os arquivos já
  estão prontos em `entregaveis/`.

## 2. Instalar as dependências

A partir da pasta `decidai/`:

```bash
pip install -r requirements.txt
```

> As bibliotecas de núcleo (numpy, pandas, scikit-learn, pulp, streamlit) bastam para tudo funcionar.
> `shap` e `anthropic` são **opcionais**: sem elas, a explicabilidade degrada para alternativas locais
> e a demo continua funcionando.

## 3. Rodar o pipeline completo (terminal)

Mostra a recomendação de produção, o risco (Monte Carlo), os preços-sombra e a análise de sensibilidade:

```bash
python pipeline.py
```

Saída esperada (resumo): plano de produção por produto, **lucro ótimo ≈ R$ 18.295,64**,
distribuição de risco e identificação do **orçamento como gargalo**.

## 4. Abrir o dashboard executivo (aplicação web)

Interface interativa usada na demonstração (ajuste de capacidades, plano, explicação e what-if):

```bash
streamlit run app/dashboard.py
```

O Streamlit abrirá o navegador automaticamente (geralmente em `http://localhost:8501`).
Ajuste as capacidades na barra lateral e clique em **"Rodar recomendação"**.

## 5. Rodar os testes

```bash
python -m pytest tests/ -q
```

Esperado: **5 testes passando** (dados, previsão, Markov, otimização e pipeline completo).

## 6. (Opcional) Explicação via LLM

Para gerar a justificativa executiva em linguagem natural com o modelo Claude, defina a variável
de ambiente antes de rodar (e marque a opção no dashboard):

```powershell
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY = "sua-chave-aqui"
```

```bash
# Linux / macOS
export ANTHROPIC_API_KEY="sua-chave-aqui"
```

Sem a chave, o sistema usa uma explicação por template — nenhuma etapa trava.

## 7. (Opcional) Regenerar os entregáveis

Apenas se quiser reconstruir o relatório/slides após editar os geradores:

```bash
npm install -g docx pptxgenjs
cd entregaveis
node gen_relatorio.js   # gera Relatorio_DecidAI.docx
node gen_slides.js      # gera Apresentacao_DecidAI.pptx
```

## Estrutura do projeto

```
decidai/
├── config.py          # parâmetros de negócio (produtos, capacidades, Markov)
├── data_gen.py        # gerador de dados sintéticos
├── forecast.py        # previsão de demanda (ML)
├── simulation.py      # incerteza: Monte Carlo + Markov
├── optimization.py    # otimização: Simplex (PuLP)
├── xai.py             # explicabilidade
├── pipeline.py        # orquestração + análise de sensibilidade
├── app/dashboard.py   # interface Streamlit
├── tests/             # testes de fumaça
└── entregaveis/       # relatório (.docx/.pdf) e apresentação (.pptx/.pdf)
```
