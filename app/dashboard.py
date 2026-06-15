"""
dashboard.py
============
Interface executiva do SAD (Streamlit) — o "Subsistema de Interface".

Execute a partir da pasta `decidai`:
    streamlit run app/dashboard.py

Permite ao "comitê" ajustar capacidades, rodar o pipeline, ver o plano
recomendado, a distribuição de risco e a explicação (XAI), além de simular
cenários what-if (análise de sensibilidade).
"""

import os
import sys

# Permite importar os módulos da pasta-pai (decidai/) ao rodar via Streamlit.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pandas as pd
import streamlit as st

from config import CAPACIDADES, Capacidades
from pipeline import rodar_pipeline, analise_sensibilidade

st.set_page_config(page_title="DecidAI — SAD de Produção", layout="wide")
st.title("🏭 DecidAI — Apoio à Decisão de Produção sob Incerteza")
st.caption("ML (previsão) → Monte Carlo + Markov (incerteza) → Simplex (otimização) → XAI (explicação)")

# --- Painel lateral: parâmetros da decisão (restrições) -------------------
st.sidebar.header("⚙️ Capacidades da fábrica")
horas = st.sidebar.slider("Horas de máquina/semana", 40.0, 160.0, float(CAPACIDADES.horas_maquina))
materia = st.sidebar.slider("Matéria-prima (kg)/semana", 2000.0, 8000.0, float(CAPACIDADES.materia_prima))
orcamento = st.sidebar.slider("Orçamento (R$)/semana", 6000.0, 24000.0, float(CAPACIDADES.orcamento))
com_llm = st.sidebar.checkbox("Explicação via LLM (requer ANTHROPIC_API_KEY)", value=False)

caps = Capacidades(horas_maquina=horas, materia_prima=materia, orcamento=orcamento)

if st.sidebar.button("▶️ Rodar recomendação", type="primary"):
    with st.spinner("Executando pipeline de decisão..."):
        r = rodar_pipeline(caps, com_llm=com_llm)
    st.session_state["r"] = r

if "r" in st.session_state:
    r = st.session_state["r"]
    otimo = r["otimo"]

    col1, col2, col3 = st.columns(3)
    col1.metric("Lucro ótimo (esperado)", f"R$ {otimo['lucro']:,.2f}")
    col2.metric("Lucro médio (risco)", f"R$ {r['risco']['lucro_medio']:,.2f}")
    col3.metric("Pior caso (p5)", f"R$ {r['risco']['lucro_p5']:,.2f}")

    st.subheader("📦 Plano de produção recomendado")
    df_plano = pd.DataFrame(
        [{"Produto": k, "Unidades": v} for k, v in otimo["plano"].items()]
    )
    st.bar_chart(df_plano.set_index("Produto"))
    st.dataframe(df_plano, use_container_width=True)

    st.subheader("🔍 Explicação da decisão (XAI)")
    st.info(r["explicacao"])
    st.write("**Preços-sombra (gargalos):**", otimo["precos_sombra"])
    st.write("**Uso de recursos:**", otimo["uso"])

    st.subheader("📈 Análise de sensibilidade — horas de máquina")
    sens = analise_sensibilidade("horas_maquina")
    df_sens = pd.DataFrame(sens)
    st.line_chart(df_sens.set_index("capacidade")["lucro"])
    st.dataframe(df_sens, use_container_width=True)
else:
    st.info("Ajuste as capacidades na barra lateral e clique em **Rodar recomendação**.")
