"""
optimization.py
===============
Camada PRESCRITIVA: Programação Linear (resolvida pelo Simplex via CBC/PuLP).

Decide o mix ótimo de produção que MAXIMIZA o lucro, respeitando as
restrições da fábrica. Este é o núcleo de Pesquisa Operacional do trabalho.

Modelo:
    Variáveis:   x_p = unidades a produzir do produto p   (x_p >= 0)
    Objetivo:    max  Σ  margem_p * x_p
    Sujeito a:
        Σ horas_maquina_p * x_p <= horas_maquina_disp      (gargalo de máquina)
        Σ materia_prima_p * x_p <= materia_prima_disp       (matéria-prima)
        Σ custo_unitario_p * x_p <= orcamento               (capital de giro)
        x_p <= demanda_p                                    (não produzir além da demanda)

Os PREÇOS-SOMBRA (valores duais) das restrições são extraídos para a
explicabilidade (XAI): dizem quanto lucro extra cada unidade de recurso
geraria — explicação nativa da Pesquisa Operacional.
"""

import pulp

from config import PRODUTOS, CAPACIDADES


def otimizar_producao(demanda: dict, capacidades=CAPACIDADES) -> dict:
    """Resolve o PL de mix de produção.

    `demanda` = {produto: quantidade máxima vendável}.
    Retorna plano, lucro, uso de recursos e preços-sombra.
    """
    prob = pulp.LpProblem("mix_de_producao", pulp.LpMaximize)

    # Variáveis de decisão.
    x = {p.nome: pulp.LpVariable(f"x_{i}", lowBound=0)
         for i, p in enumerate(PRODUTOS)}

    # Função objetivo: maximizar lucro.
    prob += pulp.lpSum(p.margem * x[p.nome] for p in PRODUTOS), "lucro_total"

    # Restrições de capacidade.
    c_maquina = pulp.lpSum(p.horas_maquina * x[p.nome] for p in PRODUTOS) <= capacidades.horas_maquina
    c_materia = pulp.lpSum(p.materia_prima * x[p.nome] for p in PRODUTOS) <= capacidades.materia_prima
    c_orcamento = pulp.lpSum(p.custo_unitario * x[p.nome] for p in PRODUTOS) <= capacidades.orcamento
    prob += c_maquina, "horas_maquina"
    prob += c_materia, "materia_prima"
    prob += c_orcamento, "orcamento"

    # Restrição de demanda por produto.
    for p in PRODUTOS:
        prob += x[p.nome] <= demanda[p.nome], f"demanda_{p.nome}"

    prob.solve(pulp.PULP_CBC_CMD(msg=False))

    plano = {p.nome: round(x[p.nome].value() or 0, 1) for p in PRODUTOS}
    lucro = round(pulp.value(prob.objective) or 0, 2)

    uso = {
        "horas_maquina": round(sum(p.horas_maquina * plano[p.nome] for p in PRODUTOS), 2),
        "materia_prima": round(sum(p.materia_prima * plano[p.nome] for p in PRODUTOS), 2),
        "orcamento": round(sum(p.custo_unitario * plano[p.nome] for p in PRODUTOS), 2),
    }

    # Preços-sombra (valores duais) das restrições de capacidade.
    precos_sombra = {
        "horas_maquina": round(c_maquina.pi or 0, 4),
        "materia_prima": round(c_materia.pi or 0, 4),
        "orcamento": round(c_orcamento.pi or 0, 4),
    }

    return {
        "status": pulp.LpStatus[prob.status],
        "plano": plano,
        "lucro": lucro,
        "uso": uso,
        "capacidades": {
            "horas_maquina": capacidades.horas_maquina,
            "materia_prima": capacidades.materia_prima,
            "orcamento": capacidades.orcamento,
        },
        "precos_sombra": precos_sombra,
    }


if __name__ == "__main__":
    from data_gen import gerar_historico
    from forecast import PrevisorDemanda
    from simulation import simular_cenarios, resumo_cenarios

    prev = PrevisorDemanda().treinar(gerar_historico())
    cen = simular_cenarios(prev.prever_proxima())
    demanda_esperada = {n: r["media"] for n, r in resumo_cenarios(cen).items()}

    res = otimizar_producao(demanda_esperada)
    print("Status:", res["status"], "| Lucro:", res["lucro"])
    for nome, q in res["plano"].items():
        print(f"  {nome:18s} -> {q:.0f} un.")
    print("Preços-sombra:", res["precos_sombra"])
