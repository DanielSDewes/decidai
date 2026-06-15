"""
forecast.py
===========
Camada PREDITIVA (Machine Learning).

Treina um modelo de regressão por produto para prever a demanda da próxima
semana e estimar a incerteza (desvio dos resíduos). É o "prever cenários"
da IA Preditiva — base para a simulação e a otimização.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

from config import PRODUTOS


def _features(df_produto: pd.DataFrame) -> pd.DataFrame:
    """Cria features temporais para uma série de um produto."""
    d = df_produto.sort_values("semana").copy()
    d["sin52"] = np.sin(2 * np.pi * (d["semana"] % 52) / 52)
    d["cos52"] = np.cos(2 * np.pi * (d["semana"] % 52) / 52)
    d["tend"] = d["semana"]
    d["lag1"] = d["demanda"].shift(1)
    d["lag52"] = d["demanda"].shift(52)
    return d.dropna()


class PrevisorDemanda:
    """Treina um RandomForest por produto e prevê a próxima semana."""

    def __init__(self):
        self.modelos: dict[str, RandomForestRegressor] = {}
        self.std_residuo: dict[str, float] = {}
        self.ultimo: dict[str, pd.DataFrame] = {}
        self.cols = ["sin52", "cos52", "tend", "lag1", "lag52"]

    def treinar(self, historico: pd.DataFrame) -> "PrevisorDemanda":
        for p in PRODUTOS:
            d = _features(historico[historico["produto"] == p.nome])
            X, y = d[self.cols], d["demanda"]
            modelo = RandomForestRegressor(n_estimators=200, random_state=0)
            modelo.fit(X, y)
            # Incerteza = desvio-padrão dos resíduos no treino.
            self.std_residuo[p.nome] = float(np.std(y - modelo.predict(X)))
            self.modelos[p.nome] = modelo
            self.ultimo[p.nome] = d.tail(1)
        return self

    def prever_proxima(self) -> dict[str, dict]:
        """Retorna {produto: {'media': x, 'std': s}} para a próxima semana."""
        previsoes = {}
        for p in PRODUTOS:
            ultimo = self.ultimo[p.nome].iloc[-1]
            prox = pd.DataFrame([{
                "sin52": np.sin(2 * np.pi * ((ultimo["semana"] + 1) % 52) / 52),
                "cos52": np.cos(2 * np.pi * ((ultimo["semana"] + 1) % 52) / 52),
                "tend": ultimo["semana"] + 1,
                "lag1": ultimo["demanda"],
                "lag52": ultimo["lag52"],
            }])
            media = float(self.modelos[p.nome].predict(prox[self.cols])[0])
            previsoes[p.nome] = {"media": media, "std": self.std_residuo[p.nome]}
        return previsoes


if __name__ == "__main__":
    from data_gen import gerar_historico

    prev = PrevisorDemanda().treinar(gerar_historico())
    for nome, info in prev.prever_proxima().items():
        print(f"{nome:18s}  média={info['media']:7.0f}  ±{info['std']:.0f}")
