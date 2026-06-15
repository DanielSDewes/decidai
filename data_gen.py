"""
data_gen.py
===========
Gerador de dados sintéticos de vendas semanais.

Atende ao item 4 do relatório ("dados reais ou sintéticos"). Cada série é
composta por: nível-base + tendência + sazonalidade anual + ruído aleatório.
Tudo reprodutível via SEED, para transparência metodológica.
"""

import numpy as np
import pandas as pd

from config import PRODUTOS, SEED


def gerar_historico(n_semanas: int = 156, seed: int = SEED) -> pd.DataFrame:
    """Gera ~3 anos (156 semanas) de vendas semanais por produto.

    Retorna um DataFrame com colunas: semana, produto, demanda.
    """
    rng = np.random.default_rng(seed)
    linhas = []

    for p in PRODUTOS:
        for s in range(n_semanas):
            # Componente sazonal anual (52 semanas).
            sazonal = 1 + p.amplitude_sazonal * np.sin(2 * np.pi * (s % 52) / 52)
            # Tendência linear.
            tend = p.tendencia * s
            # Ruído multiplicativo (~10%).
            ruido = rng.normal(1.0, 0.10)
            demanda = max(0.0, (p.demanda_base + tend) * sazonal * ruido)
            linhas.append({"semana": s, "produto": p.nome, "demanda": round(demanda)})

    return pd.DataFrame(linhas)


if __name__ == "__main__":
    df = gerar_historico()
    print(df.head(10))
    print("\nResumo por produto:")
    print(df.groupby("produto")["demanda"].agg(["mean", "std", "min", "max"]).round(1))
