"""
test_smoke.py
=============
Testes mínimos de fumaça: garantem que cada etapa do pipeline roda e produz
saídas coerentes. Rode com:  python -m pytest tests/ -q
"""

import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import numpy as np

from data_gen import gerar_historico
from forecast import PrevisorDemanda
from simulation import simular_cenarios, distribuicao_estacionaria
from optimization import otimizar_producao
from pipeline import rodar_pipeline, analise_sensibilidade


def test_dados_gerados():
    df = gerar_historico(n_semanas=104)
    assert not df.empty
    assert {"semana", "produto", "demanda"}.issubset(df.columns)
    assert (df["demanda"] >= 0).all()


def test_previsao_positiva():
    prev = PrevisorDemanda().treinar(gerar_historico(n_semanas=104))
    previsoes = prev.prever_proxima()
    assert all(v["media"] > 0 for v in previsoes.values())


def test_markov_estacionaria_soma_um():
    pi = distribuicao_estacionaria()
    assert np.isclose(pi.sum(), 1.0)
    assert (pi >= 0).all()


def test_otimizacao_respeita_restricoes():
    prev = PrevisorDemanda().treinar(gerar_historico(n_semanas=104))
    cen = simular_cenarios(prev.prever_proxima(), n=200)
    demanda = {n: float(np.mean(v)) for n, v in cen.items()}
    res = otimizar_producao(demanda)
    assert res["status"] == "Optimal"
    assert res["lucro"] >= 0
    assert res["uso"]["horas_maquina"] <= res["capacidades"]["horas_maquina"] + 1e-6


def test_pipeline_completo():
    r = rodar_pipeline()
    assert r["otimo"]["lucro"] > 0
    assert "explicacao" in r
    sens = analise_sensibilidade("horas_maquina")
    assert len(sens) == 5
