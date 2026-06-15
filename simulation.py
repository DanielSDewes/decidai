"""
simulation.py
=============
Camada de INCERTEZA: Monte Carlo + Cadeia de Markov.

- Markov: modela o "regime" de mercado (baixa/normal/alta demanda) e suas
  probabilidades de transição. A distribuição estacionária diz quanto tempo,
  no longo prazo, o mercado passa em cada regime.
- Monte Carlo: amostra milhares de cenários de demanda combinando o regime
  (Markov) com a incerteza do modelo de ML (desvio dos resíduos).

Isso operacionaliza a distinção da disciplina entre RISCO (probabilidades
conhecidas) e INCERTEZA, fornecendo cenários para a etapa de prescrição.
"""

import numpy as np

from config import PRODUTOS, REGIMES, MATRIZ_TRANSICAO, N_CENARIOS, SEED


def distribuicao_estacionaria(matriz=MATRIZ_TRANSICAO) -> np.ndarray:
    """Calcula a distribuição estacionária da Cadeia de Markov.

    É o autovetor à esquerda associado ao autovalor 1 (pi @ P = pi).
    """
    P = np.array(matriz, dtype=float)
    autovalores, autovetores = np.linalg.eig(P.T)
    idx = np.argmin(np.abs(autovalores - 1.0))
    pi = np.real(autovetores[:, idx])
    return pi / pi.sum()


def simular_cenarios(previsoes: dict, n: int = N_CENARIOS, seed: int = SEED) -> dict:
    """Gera `n` cenários de demanda por produto.

    Para cada cenário: sorteia um regime (via distribuição estacionária de
    Markov) e aplica o multiplicador; depois soma o ruído do modelo de ML.

    Retorna {produto: np.ndarray(n)} com as demandas simuladas.
    """
    rng = np.random.default_rng(seed)
    pi = distribuicao_estacionaria()
    nomes_regimes = list(REGIMES.keys())
    mult_regimes = np.array(list(REGIMES.values()))

    # Sorteia o regime de cada cenário.
    regimes_idx = rng.choice(len(nomes_regimes), size=n, p=pi)
    multiplicador = mult_regimes[regimes_idx]

    cenarios = {}
    for p in PRODUTOS:
        media = previsoes[p.nome]["media"]
        std = previsoes[p.nome]["std"]
        ruido = rng.normal(0, std, size=n)
        demanda = np.clip(media * multiplicador + ruido, 0, None)
        cenarios[p.nome] = demanda

    return cenarios


def resumo_cenarios(cenarios: dict) -> dict:
    """Estatísticas dos cenários: média, p5, p95 (para o relatório/dashboard)."""
    return {
        nome: {
            "media": float(np.mean(v)),
            "p5": float(np.percentile(v, 5)),
            "p95": float(np.percentile(v, 95)),
        }
        for nome, v in cenarios.items()
    }


if __name__ == "__main__":
    from data_gen import gerar_historico
    from forecast import PrevisorDemanda

    print("Distribuição estacionária (baixa/normal/alta):",
          distribuicao_estacionaria().round(3))

    prev = PrevisorDemanda().treinar(gerar_historico())
    cen = simular_cenarios(prev.prever_proxima())
    for nome, r in resumo_cenarios(cen).items():
        print(f"{nome:18s}  média={r['media']:7.0f}  [p5={r['p5']:.0f}, p95={r['p95']:.0f}]")
