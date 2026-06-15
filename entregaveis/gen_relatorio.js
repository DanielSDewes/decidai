// Gera o relatório do trabalho "IA no Processo Decisório" em .docx
// Executar: node gen_relatorio.js   (com a lib docx instalada globalmente)
const path = require("path");
const GLOBAL = "C:/Users/daniel.dewes/AppData/Roaming/npm/node_modules";
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, TableOfContents, PageBreak, Header, Footer, PageNumber, VerticalAlign,
} = require(path.join(GLOBAL, "docx"));
const fs = require("fs");

// ---------- helpers ----------
const A4_W = 11906, MARGIN = 1440, CONTENT = A4_W - 2 * MARGIN; // 9026

function H1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] }); }
function H2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] }); }
function P(t, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    children: Array.isArray(t) ? t : [new TextRun(t)],
  });
}
function B(text) { return new TextRun({ text, bold: true }); }
function bullet(t) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: Array.isArray(t) ? t : [new TextRun(t)],
  });
}

const border = { style: BorderStyle.SINGLE, size: 1, color: "BBBBBB" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 120, right: 120 };

function cell(text, w, { head = false, align = AlignmentType.LEFT } = {}) {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA }, margins: cellMargins,
    verticalAlign: VerticalAlign.CENTER,
    shading: head ? { fill: "1F4E79", type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold: head, color: head ? "FFFFFF" : "000000" })],
    })],
  });
}
function table(headersRow, dataRows, widths, leftAll = false) {
  const rows = [new TableRow({
    tableHeader: true,
    children: headersRow.map((h, i) => cell(h, widths[i], { head: true })),
  })];
  for (const r of dataRows) {
    rows.push(new TableRow({
      children: r.map((c, i) => cell(String(c), widths[i],
        { align: (leftAll || i === 0) ? AlignmentType.LEFT : AlignmentType.RIGHT })),
    }));
  }
  return new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: widths, rows });
}

// ---------- documento ----------
const doc = new Document({
  creator: "Grupo DecidAI",
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } }, // 11pt
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Arial", color: "1F4E79" },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 280 } } } }] },
    ],
  },
  sections: [
    // ---- Capa ----
    {
      properties: { page: { size: { width: A4_W, height: 16838 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
      children: [
        new Paragraph({ spacing: { before: 600, after: 60 }, alignment: AlignmentType.CENTER,
          children: [B("Universidade Regional Integrada do Alto Uruguai e das Missões — URI")] }),
        P([new TextRun("Tópicos Especiais em Computação II – A (30-772)")], { center: true }),
        P([new TextRun("Prof. Paulo Ricardo B. Betencourt")], { center: true }),
        new Paragraph({ spacing: { before: 1600, after: 120 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "DecidAI", bold: true, size: 56, color: "1F4E79" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Sistema de Apoio à Decisão para Planejamento de Produção sob Incerteza", size: 30, bold: true })] }),
        new Paragraph({ spacing: { before: 240 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "IA no Processo Decisório — Relatório Técnico", italics: true, size: 24 })] }),
        new Paragraph({ spacing: { before: 1800, after: 60 }, alignment: AlignmentType.CENTER,
          children: [B("Integrantes do grupo:")] }),
        P([new TextRun("Daniel Dewes  •  Cesario Stoquero  •  Samuel Maciel")], { center: true }),
        new Paragraph({ spacing: { before: 1200 }, alignment: AlignmentType.CENTER,
          children: [new TextRun("Santo Ângelo — RS, junho de 2026")] }),
        new Paragraph({ children: [new PageBreak()] }),
        // ---- Sumário ----
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Sumário")] }),
        new TableOfContents("Sumário", { hyperlink: true, headingStyleRange: "1-2" }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
    // ---- Corpo ----
    {
      properties: { page: { size: { width: A4_W, height: 16838 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun("DecidAI — "), new TextRun({ children: ["Página ", PageNumber.CURRENT] })] })] }) },
      children: [

        // ===== Resumo Executivo =====
        H1("Resumo Executivo"),
        P([
          new TextRun("Este trabalho apresenta o "), B("DecidAI"),
          new TextRun(", um Sistema de Apoio à Decisão (SAD) que automatiza uma decisão organizacional recorrente e de alto impacto: "),
          B("quanto produzir de cada produto a cada semana"),
          new TextRun(", em uma agroindústria de médio porte sujeita a demanda incerta e recursos limitados. A solução encadeia quatro técnicas — previsão por "),
          new TextRun("Machine Learning"),
          new TextRun(", simulação de incerteza com "),
          new TextRun("Monte Carlo e Cadeias de Markov"),
          new TextRun(", otimização por "),
          new TextRun("Programação Linear (Simplex)"),
          new TextRun(" e uma camada de explicabilidade (XAI) — entregando ao gestor não apenas uma recomendação, mas a "),
          B("justificativa"),
          new TextRun(" por trás dela."),
        ]),
        P([
          new TextRun("No cenário-base, o sistema recomenda um plano com lucro semanal ótimo de "),
          B("R$ 18.295,64"),
          new TextRun(", identificando o "), B("orçamento de produção como principal gargalo"),
          new TextRun(" (preço-sombra de R$ 1,23 por real adicional). A análise de risco por Monte Carlo indica lucro médio esperado de R$ 17.271,96, com piso de R$ 14.678,60 nos 5% de cenários mais adversos."),
        ]),

        // ===== 1 =====
        H1("1. Contextualização e Diagnóstico"),
        H2("1.1 Descrição e classificação do problema"),
        P([
          new TextRun("A "), B("AgroVale Alimentos"),
          new TextRun(" (empresa fictícia que representa o perfil de cooperativas agroindustriais da região do Alto Uruguai) produz cinco linhas de produtos a partir de uma mesma estrutura fabril compartilhada. Toda semana, a gestão precisa decidir o "),
          B("mix de produção"),
          new TextRun(" — quanto fabricar de cada item — diante de uma demanda que oscila e de recursos finitos (horas de máquina, matéria-prima e capital de giro)."),
        ]),
        P([
          new TextRun("Hoje, essa decisão é tomada de forma intuitiva, com apoio de planilhas. O resultado é um ciclo de erros custosos: ora há "),
          B("superprodução"),
          new TextRun(" (gerando perdas e custo de estocagem de produtos perecíveis), ora há "),
          B("ruptura"),
          new TextRun(" (venda perdida e insatisfação do cliente)."),
        ]),
        P([
          new TextRun("Segundo a tipologia de Shimizu, trata-se de um problema "),
          B("semiestruturado"),
          new TextRun(": parte dele é estruturável (as restrições de capacidade e a função de lucro podem ser modeladas matematicamente), mas a "),
          new TextRun("demanda futura é incerta"),
          new TextRun(" e o julgamento gerencial sobre prioridades (atender cliente estratégico, evitar perecíveis) introduz elementos não plenamente formalizáveis. É exatamente a faixa em que um SAD agrega mais valor — apoiando, sem substituir, o decisor."),
        ]),
        H2("1.2 Stakeholders e objetivos conflitantes"),
        P("Os principais interessados na decisão possuem objetivos que competem entre si:"),
        bullet([B("Produção: "), new TextRun("busca estabilidade e ocupação eficiente das máquinas.")]),
        bullet([B("Vendas/Comercial: "), new TextRun("quer estoque alto para nunca perder venda (nível de serviço).")]),
        bullet([B("Financeiro: "), new TextRun("quer minimizar capital imobilizado em estoque e custo de produção.")]),
        bullet([B("Direção: "), new TextRun("quer maximizar o lucro respeitando a capacidade instalada.")]),
        P([
          new TextRun("O conflito central é o "), B("trade-off entre nível de serviço e custo"),
          new TextRun(": estoque alto protege a venda mas imobiliza capital e arrisca perdas; estoque baixo reduz custo mas eleva o risco de ruptura. O SAD torna esse trade-off explícito e quantificável."),
        ]),

        // ===== 2 =====
        H1("2. Modelagem do Processo Decisório"),
        H2("2.1 Variáveis consideradas"),
        P([new TextRun("As "), B("variáveis de decisão"), new TextRun(" são as quantidades a produzir de cada um dos cinco produtos na próxima semana. Os parâmetros de cada produto e as restrições da fábrica compõem o modelo:")]),
        table(
          ["Produto", "Margem (R$/un)", "Horas-máq/un", "Mat.-prima (kg/un)", "Custo (R$/un)", "Demanda-base (un)"],
          [
            ["Suco Integral", "4,50", "0,020", "1,2", "3,00", "1.200"],
            ["Polpa Congelada", "3,20", "0,015", "0,9", "2,10", "900"],
            ["Geleia Artesanal", "6,80", "0,040", "0,7", "4,50", "500"],
            ["Doce em Barra", "5,10", "0,030", "1,0", "3,60", "650"],
            ["Néctar Light", "2,90", "0,012", "0,8", "1,80", "1.100"],
          ],
          [2200, 1500, 1400, 1500, 1200, 1226],
        ),
        new Paragraph({ spacing: { before: 120, after: 60 }, children: [B("Restrições semanais (capacidades):")] }),
        bullet("Horas de máquina disponíveis: 90 h"),
        bullet("Matéria-prima disponível: 4.000 kg"),
        bullet("Orçamento de produção (capital de giro): R$ 12.000"),
        H2("2.2 Tratamento da incerteza"),
        P([
          new TextRun("A incerteza de demanda é tratada em duas camadas complementares. Primeiro, o modelo de "),
          B("Machine Learning"),
          new TextRun(" estima, além da demanda esperada, o "),
          B("desvio-padrão dos resíduos"),
          new TextRun(", que mede o erro típico da previsão. Segundo, uma "),
          B("Cadeia de Markov"),
          new TextRun(" modela o regime de mercado em três estados — baixa, normal e alta demanda — com uma matriz de transição entre eles. A distribuição estacionária dessa cadeia informa a probabilidade de longo prazo de cada regime."),
        ]),
        P([
          new TextRun("A "), B("simulação de Monte Carlo"),
          new TextRun(" combina as duas fontes: para cada um dos 2.000 cenários, sorteia-se um regime (via Markov) e soma-se o ruído do modelo de ML, gerando uma distribuição completa de demanda por produto. Essa abordagem operacionaliza a distinção da disciplina entre "),
          B("risco"), new TextRun(" (probabilidades conhecidas, capturadas pela matriz de Markov) e "),
          B("incerteza"), new TextRun(" (a variabilidade residual da previsão)."),
        ]),

        // ===== 3 =====
        H1("3. Proposta de Solução com IA"),
        H2("3.1 Justificativa da técnica (por que IA, e não método puramente estatístico ou heurístico?)"),
        P([
          new TextRun("Um modelo "), B("puramente estatístico"),
          new TextRun(" (ex.: uma regressão de demanda) "), B("prevê, mas não decide"),
          new TextRun(": ele não considera as restrições de capacidade nem as margens, e portanto não produz um plano de produção acionável. Uma "),
          B("heurística simples"),
          new TextRun(" (ex.: “produza a média histórica”) ignora tanto as restrições quanto a incerteza, levando justamente aos erros de superprodução e ruptura que se quer evitar."),
        ]),
        P([
          new TextRun("A solução com IA agrega valor precisamente na "), B("integração"),
          new TextRun(": o ML transforma o histórico em previsão probabilística; o Monte Carlo+Markov converte a previsão em cenários de risco; e a otimização (Simplex) converte os cenários em uma "),
          B("decisão ótima e factível"), new TextRun(", que respeita todas as restrições e maximiza o lucro. Nenhuma das técnicas isoladamente entrega esse resultado — é a orquestração que constitui o Sistema de Apoio à Decisão."),
        ]),
        H2("3.2 Arquitetura da solução"),
        P("A arquitetura segue a estrutura clássica de SAD descrita por Shimizu, com três subsistemas — dados, modelos e interface — organizados em um pipeline sequencial:"),
        bullet([B("Subsistema de Dados: "), new TextRun("histórico de vendas (sintético) e tabela de parâmetros de negócio.")]),
        bullet([B("Subsistema de Modelos: "), new TextRun("previsão (ML) → simulação (Monte Carlo + Markov) → otimização (Simplex) → explicação (XAI).")]),
        bullet([B("Subsistema de Interface: "), new TextRun("dashboard executivo (Streamlit) para consulta e simulação de cenários what-if.")]),
        P([B("Fluxo: "), new TextRun("Dados → Previsão de demanda (ML) → Cenários de incerteza (Monte Carlo + Markov) → Decisão ótima (Simplex) → Explicação executiva (XAI) → Dashboard.")]),
        P([
          new TextRun("Implementação em "), B("Python"),
          new TextRun(": scikit-learn (RandomForest), NumPy (Monte Carlo e álgebra de Markov), PuLP/CBC (Simplex), SHAP e a API da Anthropic (Claude) para a explicação em linguagem natural, e Streamlit para a interface."),
        ]),

        // ===== 4 =====
        H1("4. Implementação e Resultados"),
        H2("4.1 Dados utilizados"),
        P([
          new TextRun("Foram usados "), B("dados sintéticos reprodutíveis"),
          new TextRun(" (semente fixa), gerando aproximadamente três anos (156 semanas) de vendas semanais para os cinco produtos. Cada série combina nível-base, tendência linear, sazonalidade anual (52 semanas) e ruído aleatório de ~10%, reproduzindo padrões realistas de demanda sem expor dados sensíveis de uma empresa real."),
        ]),
        H2("4.2 Resultados — plano recomendado e análise de risco"),
        P([new TextRun("Otimizando sobre a demanda esperada, o sistema retornou solução "), B("ótima"), new TextRun(" com lucro de "), B("R$ 18.295,64"), new TextRun(" e o seguinte plano:")]),
        table(
          ["Produto", "Unidades recomendadas"],
          [
            ["Suco Integral", "1.368"],
            ["Polpa Congelada", "1.023"],
            ["Geleia Artesanal", "852"],
            ["Doce em Barra", "15"],
            ["Néctar Light", "1.033"],
          ],
          [6026, 3000],
        ),
        P([
          new TextRun("Destaca-se que o "), B("Doce em Barra"),
          new TextRun(" quase não é produzido: apesar de boa margem, seu consumo de horas de máquina e matéria-prima o torna pouco competitivo frente aos demais quando os recursos são escassos — um insight não óbvio que a otimização revela."),
        ]),
        P([new TextRun("A simulação de Monte Carlo (2.000 cenários) avalia o "), B("risco"), new TextRun(" desse plano:")]),
        table(
          ["Métrica de lucro", "Valor (R$)"],
          [
            ["Lucro esperado (demanda média)", "18.295,64"],
            ["Lucro médio simulado", "17.271,96"],
            ["Pior caso (percentil 5%)", "14.678,60"],
            ["Melhor caso (percentil 95%)", "18.296,03"],
          ],
          [6026, 3000],
        ),
        P([
          new TextRun("O lucro médio simulado fica abaixo do ótimo determinístico porque, em parte dos cenários, a demanda real cai abaixo do planejado, deixando produção sem venda. Ainda assim, mesmo no "),
          B("pior caso (p5)"), new TextRun(", o lucro permanece em R$ 14.678,60 — evidência de que o plano é "), B("robusto"), new TextRun("."),
        ]),
        H2("4.3 Análise de sensibilidade"),
        P([new TextRun("A leitura dos "), B("preços-sombra"), new TextRun(" do Simplex revela quais recursos limitam o lucro:")]),
        table(
          ["Recurso", "Usado", "Disponível", "Preço-sombra (R$)"],
          [
            ["Horas de máquina", "89,6 h", "90,0 h", "0,00 (há folga)"],
            ["Matéria-prima", "4.000 kg", "4.000 kg", "0,68"],
            ["Orçamento", "R$ 12.000", "R$ 12.000", "1,23"],
          ],
          [2800, 2226, 2000, 2000],
        ),
        P([
          new TextRun("O "), B("orçamento é o gargalo dominante"),
          new TextRun(" (cada R$ 1 adicional gera R$ 1,23 de lucro), seguido da matéria-prima (R$ 0,68). As horas de máquina sobram, logo investir em mais capacidade de máquina não traria retorno. Variando o orçamento:"),
        ]),
        table(
          ["Variação do orçamento", "Orçamento (R$)", "Lucro ótimo (R$)"],
          [
            ["−20%", "9.600", "14.700,24"],
            ["−10%", "10.800", "16.500,24"],
            ["base", "12.000", "18.295,64"],
            ["+10%", "13.200", "18.378,94"],
            ["+20%", "14.400", "18.378,94"],
          ],
          [3026, 3000, 3000],
        ),
        P([
          new TextRun("O resultado mostra um efeito de "), B("retornos decrescentes"),
          new TextRun(": aumentar o orçamento eleva o lucro até cerca de +10%, ponto em que outro recurso (a matéria-prima) passa a restringir, e o lucro estabiliza em R$ 18.378,94. Esse tipo de leitura orienta diretamente onde a empresa deve investir."),
        ]),
        H2("4.4 Explicabilidade (XAI)"),
        P("Atendendo à recomendação de Shimizu de que um gestor não aceita uma decisão de “caixa preta”, a solução justifica a recomendação em três níveis:"),
        bullet([B("Preços-sombra (Simplex): "), new TextRun("explicam por que o plano é ótimo e onde está o gargalo — explicabilidade nativa da Pesquisa Operacional.")]),
        bullet([B("Importância de variáveis (SHAP): "), new TextRun("explica o que dirige a previsão de demanda (sazonalidade, tendência, vendas recentes).")]),
        bullet([B("Linguagem natural (LLM): "), new TextRun("o modelo Claude traduz os números em um parágrafo executivo em português, pronto para o comitê.")]),

        // ===== 5 =====
        H1("5. Conclusões e Limitações"),
        H2("5.1 Valor gerado"),
        P([
          new TextRun("O DecidAI converte uma decisão antes intuitiva em um processo "),
          B("rastreável, ótimo e explicável"),
          new TextRun(". Ele entrega: (i) um plano de produção que maximiza o lucro respeitando todas as restrições; (ii) uma medida explícita de risco; (iii) a identificação do gargalo que mais limita o resultado; e (iv) uma justificativa em linguagem de negócio. Em síntese, transforma dados em "),
          B("decisão defensável"), new TextRun(" — que é o objetivo central de um SAD."),
        ]),
        H2("5.2 Limitações éticas, técnicas e de contexto"),
        bullet([B("Dados sintéticos: "), new TextRun("a prova de conceito usa dados gerados; choques reais de mercado (clima, preço de insumos) não estão representados.")]),
        bullet([B("Viés do histórico: "), new TextRun("o modelo de ML reproduz padrões do passado; se o histórico contém vieses (ex.: campanhas pontuais), eles se propagam à previsão.")]),
        bullet([B("Linearidade do Simplex: "), new TextRun("o modelo assume custos e consumos lineares, ignorando ganhos de escala e custos fixos de setup.")]),
        bullet([B("Decisão sobre valor esperado: "), new TextRun("a otimização usa a demanda média; uma extensão natural é a programação estocástica de dois estágios, que decide considerando todos os cenários simultaneamente.")]),
        bullet([B("Fator humano (Shimizu): "), new TextRun("a decisão é também política e organizacional; o sistema apoia, mas a palavra final permanece com o gestor.")]),
        H2("5.3 Próximos passos"),
        bullet("Substituir o RandomForest por modelos de série temporal mais ricos e validar com dados reais."),
        bullet("Incluir a alocação a clientes/centros de distribuição no modelo de otimização."),
        bullet("Migrar para programação estocástica de dois estágios para decidir sob incerteza explícita."),
        bullet("Integrar o SAD ao ERP da empresa para execução automática semanal."),

        // ===== 6 — Divisão de Tarefas =====
        H1("6. Divisão de Tarefas"),
        P([
          new TextRun("O desenvolvimento foi organizado por camadas da arquitetura: cada integrante respondeu por um eixo técnico do pipeline, com integração contínua entre as partes."),
        ]),
        table(
          ["Integrante", "Responsabilidades principais", "Artefatos"],
          [
            ["Daniel Dewes", "Camada de dados e previsão (ML); orquestração do pipeline ponta a ponta", "data_gen.py, forecast.py, pipeline.py"],
            ["Cesario Stoquero", "Tratamento da incerteza (Monte Carlo + Markov) e otimização (Simplex); análise de sensibilidade", "simulation.py, optimization.py"],
            ["Samuel Maciel", "Explicabilidade (XAI) e interface executiva (dashboard Streamlit)", "xai.py, app/dashboard.py"],
          ],
          [2200, 4400, 2426],
          true,
        ),
        P([
          new TextRun("A "), B("redação do relatório"), new TextRun(", a "),
          B("preparação da apresentação"), new TextRun(" e a "),
          B("revisão dos resultados"),
          new TextRun(" foram conduzidas em conjunto pelos três integrantes."),
        ]),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(path.join(__dirname, "Relatorio_DecidAI.docx"), buf);
  console.log("Relatorio_DecidAI.docx gerado com sucesso.");
});
