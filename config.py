"""
config.py
=========
Parâmetros de negócio do SAD DecidAI.

Define os produtos, suas margens, consumo de recursos e as capacidades
semanais da fábrica. Toda a modelagem do processo decisório (variáveis,
restrições) parte daqui — é o "Subsistema de Dados" da arquitetura de SAD
descrita por Shimizu.
"""

from dataclasses import dataclass, field
from typing import List


@dataclass
class Produto:
    """Parâmetros de um produto (uma variável de decisão do modelo)."""
    nome: str
    margem: float          # lucro por unidade (R$)
    horas_maquina: float   # horas de máquina consumidas por unidade
    materia_prima: float   # kg de matéria-prima por unidade
    custo_unitario: float  # custo de produção por unidade (R$)
    # fatores usados pelo gerador de dados sintéticos
    demanda_base: float = 1000.0   # demanda média semanal
    amplitude_sazonal: float = 0.30  # amplitude da sazonalidade (fração)
    tendencia: float = 0.0           # crescimento por semana (unidades)


# --- Catálogo de produtos (cenário: agroindústria com 5 SKUs) -------------
PRODUTOS: List[Produto] = [
    Produto("Suco Integral",   margem=4.50, horas_maquina=0.020, materia_prima=1.2,
            custo_unitario=3.0, demanda_base=1200, amplitude_sazonal=0.35, tendencia=1.5),
    Produto("Polpa Congelada",  margem=3.20, horas_maquina=0.015, materia_prima=0.9,
            custo_unitario=2.1, demanda_base=900,  amplitude_sazonal=0.45, tendencia=0.8),
    Produto("Geleia Artesanal", margem=6.80, horas_maquina=0.040, materia_prima=0.7,
            custo_unitario=4.5, demanda_base=500,  amplitude_sazonal=0.25, tendencia=2.0),
    Produto("Doce em Barra",    margem=5.10, horas_maquina=0.030, materia_prima=1.0,
            custo_unitario=3.6, demanda_base=650,  amplitude_sazonal=0.20, tendencia=0.3),
    Produto("Néctar Light",     margem=2.90, horas_maquina=0.012, materia_prima=0.8,
            custo_unitario=1.8, demanda_base=1100, amplitude_sazonal=0.30, tendencia=-0.5),
]


@dataclass
class Capacidades:
    """Restrições da fábrica (o lado direito do modelo de PL / Simplex)."""
    horas_maquina: float = 90.0     # horas de máquina disponíveis por semana
    materia_prima: float = 4000.0   # kg de matéria-prima por semana
    orcamento: float = 12000.0      # orçamento de produção por semana (R$)


CAPACIDADES = Capacidades()

# Semente para reprodutibilidade dos dados sintéticos e da simulação.
SEED = 42

# Configuração da simulação de Monte Carlo.
N_CENARIOS = 2000

# Regimes de demanda (Cadeia de Markov): multiplicadores aplicados à demanda.
REGIMES = {
    "baixa":  0.80,
    "normal": 1.00,
    "alta":   1.25,
}

# Matriz de transição de Markov entre regimes (linha = de, coluna = para).
# Ordem: baixa, normal, alta.
MATRIZ_TRANSICAO = [
    [0.60, 0.35, 0.05],  # de baixa
    [0.20, 0.60, 0.20],  # de normal
    [0.05, 0.35, 0.60],  # de alta
]
