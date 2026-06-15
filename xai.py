"""
xai.py
======
Camada de EXPLICABILIDADE (XAI) — responde à "dica de Shimizu": um gestor
não aceita uma decisão de "caixa preta".

Três níveis de justificativa:
  1. Preços-sombra (Simplex): por que o plano é ótimo / onde está o gargalo.
  2. Importância das features (ML): o que dirige a previsão de demanda.
     (Usa SHAP se disponível; caso contrário, feature_importances_.)
  3. LLM (Claude): traduz tudo num parágrafo executivo em português.
     (Usa a API da Anthropic se ANTHROPIC_API_KEY estiver definida;
      caso contrário, gera uma explicação via template — sem travar a demo.)
"""

import os


def explicar_gargalo(resultado_otim: dict) -> str:
    """Lê os preços-sombra e identifica o recurso restritivo (gargalo)."""
    ps = resultado_otim["precos_sombra"]
    gargalo = max(ps, key=ps.get)
    if ps[gargalo] <= 0:
        return "Nenhum recurso está totalmente saturado: há folga de capacidade."
    nomes = {"horas_maquina": "horas de máquina",
             "materia_prima": "matéria-prima",
             "orcamento": "orçamento"}
    return (f"O gargalo é **{nomes[gargalo]}** (preço-sombra = {ps[gargalo]}). "
            f"Cada unidade extra desse recurso aumentaria o lucro em R$ {ps[gargalo]}.")


def importancia_features(previsor, produto: str) -> dict:
    """Importância das variáveis do modelo de demanda de um produto.

    Tenta SHAP; se não houver, usa a importância nativa do RandomForest.
    """
    modelo = previsor.modelos[produto]
    cols = previsor.cols
    try:
        import shap
        explainer = shap.TreeExplainer(modelo)
        X = previsor.ultimo[produto][cols]
        valores = explainer.shap_values(X)
        imp = dict(zip(cols, abs(valores).mean(axis=0)))
    except Exception:
        imp = dict(zip(cols, modelo.feature_importances_))
    return {k: round(float(v), 4) for k, v in
            sorted(imp.items(), key=lambda kv: -kv[1])}


def explicar_com_llm(resultado_otim: dict, previsoes: dict) -> str:
    """Gera um parágrafo executivo. Usa Claude se houver chave; senão template."""
    contexto = {
        "lucro": resultado_otim["lucro"],
        "plano": resultado_otim["plano"],
        "precos_sombra": resultado_otim["precos_sombra"],
    }
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if api_key:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=api_key)
            prompt = (
                "Você é um analista de apoio à decisão. Em 1 parágrafo, em português, "
                "explique a um comitê executivo a recomendação de produção abaixo, "
                "citando o lucro previsto e o gargalo (maior preço-sombra). "
                f"Dados: {contexto}"
            )
            msg = client.messages.create(
                model="claude-opus-4-8",
                max_tokens=400,
                messages=[{"role": "user", "content": prompt}],
            )
            return msg.content[0].text
        except Exception as e:  # falha de rede/chave não derruba a demo
            return _template_explicacao(resultado_otim) + f"\n\n(LLM indisponível: {e})"
    return _template_explicacao(resultado_otim)


def _template_explicacao(resultado_otim: dict) -> str:
    """Explicação determinística (fallback sem LLM)."""
    plano = resultado_otim["plano"]
    top = max(plano, key=plano.get)
    return (
        f"Recomenda-se um plano que gera lucro previsto de R$ {resultado_otim['lucro']:,.2f}. "
        f"O maior volume vai para **{top}** ({plano[top]:.0f} un.), por combinar boa margem "
        f"com demanda esperada. {explicar_gargalo(resultado_otim)}"
    )


if __name__ == "__main__":
    from data_gen import gerar_historico
    from forecast import PrevisorDemanda
    from simulation import simular_cenarios, resumo_cenarios
    from optimization import otimizar_producao

    prev = PrevisorDemanda().treinar(gerar_historico())
    prevs = prev.prever_proxima()
    cen = simular_cenarios(prevs)
    demanda = {n: r["media"] for n, r in resumo_cenarios(cen).items()}
    res = otimizar_producao(demanda)

    print(explicar_gargalo(res))
    print("\nImportância (Suco Integral):", importancia_features(prev, "Suco Integral"))
    print("\n" + explicar_com_llm(res, prevs))
