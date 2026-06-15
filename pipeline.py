"""
pipeline.py
===========
Orquestra o pipeline de decisão de ponta a ponta:

    Dados -> Previsão (ML) -> Cenários (Monte Carlo + Markov)
          -> Otimização (Simplex) -> Explicação (XAI)

Execute `python pipeline.py` para ver a recomendação completa no terminal.
Também expõe `rodar_pipeline()` e `analise_sensibilidade()` para o dashboard.
"""

import numpy as np

from config import CAPACIDADES, Capacidades
from data_gen import gerar_historico
from forecast import PrevisorDemanda
from simulation import simular_cenarios, resumo_cenarios
from optimization import otimizar_producao
from xai import explicar_gargalo, explicar_com_llm


def rodar_pipeline(capacidades: Capacidades = CAPACIDADES, com_llm: bool = False) -> dict:
    """Executa todas as etapas e devolve um dicionário com os resultados."""
    historico = gerar_historico()
    previsor = PrevisorDemanda().treinar(historico)
    previsoes = previsor.prever_proxima()

    cenarios = simular_cenarios(previsoes)
    resumo = resumo_cenarios(cenarios)
    demanda_esperada = {n: r["media"] for n, r in resumo.items()}

    otimo = otimizar_producao(demanda_esperada, capacidades)

    # Avaliação de risco: distribuição do lucro sob os cenários simulados.
    # (mantém o plano fixo e mede o quanto a demanda incerta o limita)
    lucros = _distribuir_lucro(otimo["plano"], cenarios)

    explicacao = explicar_com_llm(otimo, previsoes) if com_llm else explicar_gargalo(otimo)

    return {
        "previsoes": previsoes,
        "resumo_cenarios": resumo,
        "otimo": otimo,
        "risco": {
            "lucro_medio": round(float(np.mean(lucros)), 2),
            "lucro_p5": round(float(np.percentile(lucros, 5)), 2),
            "lucro_p95": round(float(np.percentile(lucros, 95)), 2),
        },
        "explicacao": explicacao,
        "previsor": previsor,
    }


def _distribuir_lucro(plano: dict, cenarios: dict) -> np.ndarray:
    """Lucro realizado por cenário: vende-se min(plano, demanda do cenário)."""
    from config import PRODUTOS
    n = len(next(iter(cenarios.values())))
    lucro = np.zeros(n)
    for p in PRODUTOS:
        vendido = np.minimum(plano[p.nome], cenarios[p.nome])
        lucro += p.margem * vendido
    return lucro


def analise_sensibilidade(recurso: str = "horas_maquina",
                          variacoes=(-0.2, -0.1, 0.0, 0.1, 0.2)) -> list:
    """Varia a capacidade de um recurso e observa o lucro ótimo.

    Atende ao item "análise de sensibilidade" do relatório.
    """
    historico = gerar_historico()
    previsor = PrevisorDemanda().treinar(historico)
    cenarios = simular_cenarios(previsor.prever_proxima())
    demanda = {n: r["media"] for n, r in resumo_cenarios(cenarios).items()}

    base = getattr(CAPACIDADES, recurso)
    resultados = []
    for v in variacoes:
        cap = Capacidades(**vars(CAPACIDADES))
        setattr(cap, recurso, base * (1 + v))
        res = otimizar_producao(demanda, cap)
        resultados.append({
            "variacao": v,
            "capacidade": round(getattr(cap, recurso), 1),
            "lucro": res["lucro"],
        })
    return resultados


if __name__ == "__main__":
    r = rodar_pipeline()
    print("=" * 60)
    print("DECIDAI — RECOMENDAÇÃO DE PRODUÇÃO (próxima semana)")
    print("=" * 60)
    print(f"Status do otimizador: {r['otimo']['status']}")
    print(f"Lucro ótimo (demanda esperada): R$ {r['otimo']['lucro']:,.2f}\n")
    print("Plano recomendado:")
    for nome, q in r["otimo"]["plano"].items():
        print(f"  {nome:18s} -> {q:8.0f} un.")
    print(f"\nRisco (Monte Carlo): lucro médio R$ {r['risco']['lucro_medio']:,.2f} "
          f"[p5 R$ {r['risco']['lucro_p5']:,.2f} ... p95 R$ {r['risco']['lucro_p95']:,.2f}]")
    print(f"\nUso de recursos: {r['otimo']['uso']}")
    print(f"Preços-sombra:   {r['otimo']['precos_sombra']}")
    print(f"\nExplicação (XAI):\n  {r['explicacao']}")
    print("\nAnálise de sensibilidade (horas de máquina):")
    for s in analise_sensibilidade("horas_maquina"):
        print(f"  {s['variacao']:+.0%} -> cap {s['capacidade']:.1f}h "
              f"-> lucro R$ {s['lucro']:,.2f}")
