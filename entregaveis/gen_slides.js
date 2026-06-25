// Gera os slides da apresentação executiva (30 min, 4 blocos) em .pptx
// Executar: node gen_slides.js
const path = require("path");
const GLOBAL = "C:/Users/daniel.dewes/AppData/Roaming/npm/node_modules";
const pptxgen = require(path.join(GLOBAL, "pptxgenjs"));

// ---------- paleta "Midnight Executive" ----------
const NAVY = "1E2761", NAVY2 = "2C3A75", ICE = "CADCFC", ICEBG = "EEF3FF";
const GOLD = "D9A441", GRAY = "5A6172", WHITE = "FFFFFF", DARKTXT = "1B2138";
const TITLEF = "Georgia", BODYF = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "Grupo DecidAI";
pres.title = "DecidAI — IA no Processo Decisório";
const W = 13.33, H = 7.5, M = 0.6;
const shadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 135, opacity: 0.18 });

// ---------- helpers ----------
function tag(slide, text, onDark) {
  slide.addText(text.toUpperCase(), {
    x: M, y: 0.42, w: 9, h: 0.3, fontFace: BODYF, fontSize: 12, bold: true,
    color: GOLD, charSpacing: 2, margin: 0, align: "left",
  });
}
function title(slide, text, onDark) {
  slide.addText(text, {
    x: M, y: 0.72, w: W - 2 * M, h: 0.95, fontFace: TITLEF, fontSize: 32, bold: true,
    color: onDark ? WHITE : NAVY, margin: 0, align: "left", valign: "top",
  });
}
function circleNum(slide, n, x, y, d, fill, txt) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" } });
  slide.addText(String(n), { x, y, w: d, h: d, align: "center", valign: "middle",
    fontFace: TITLEF, fontSize: 18, bold: true, color: txt, margin: 0 });
}
function card(slide, x, y, w, h, fill) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08,
    fill: { color: fill }, line: { type: "none" }, shadow: shadow() });
}

// ============ SLIDE 1 — CAPA ============
let s = pres.addSlide(); s.background = { color: NAVY };
// motivo: círculos sutis
s.addShape(pres.shapes.OVAL, { x: 10.6, y: 4.6, w: 3.4, h: 3.4, fill: { color: NAVY2 }, line: { type: "none" } });
s.addShape(pres.shapes.OVAL, { x: 11.9, y: 5.7, w: 1.7, h: 1.7, fill: { color: GOLD, transparency: 35 }, line: { type: "none" } });
s.addShape(pres.shapes.OVAL, { x: 9.9, y: 0.5, w: 1.1, h: 1.1, fill: { color: ICE, transparency: 60 }, line: { type: "none" } });
s.addText("URI · TÓPICOS ESPECIAIS EM COMPUTAÇÃO II — A (30-772)", {
  x: M, y: 1.0, w: 11, h: 0.4, fontFace: BODYF, fontSize: 13, bold: true, color: ICE, charSpacing: 2, margin: 0 });
s.addText("DecidAI", { x: M, y: 2.0, w: 11, h: 1.3, fontFace: TITLEF, fontSize: 66, bold: true, color: WHITE, margin: 0 });
s.addText("Sistema de Apoio à Decisão para Planejamento de Produção sob Incerteza", {
  x: M, y: 3.35, w: 9.6, h: 1.0, fontFace: BODYF, fontSize: 22, color: ICE, margin: 0 });
s.addText("IA no Processo Decisório — Entrega Executiva ao Comitê de Decisão", {
  x: M, y: 4.45, w: 10, h: 0.5, fontFace: BODYF, fontSize: 16, italic: true, color: GOLD, margin: 0 });
s.addText([
  { text: "Integrantes: ", options: { bold: true } },
  { text: "Daniel Dewes  ·  Cesario Stoquero  ·  Samuel Maciel ·  Guilherme Capeletti" },
], { x: M, y: 6.3, w: 11, h: 0.4, fontFace: BODYF, fontSize: 14, color: WHITE, margin: 0 });
s.addText("Santo Ângelo — RS · junho de 2026", {
  x: M, y: 6.75, w: 11, h: 0.4, fontFace: BODYF, fontSize: 13, color: ICE, margin: 0 });

// ============ SLIDE 2 — ROTEIRO ============
s = pres.addSlide(); s.background = { color: WHITE };
tag(s, "Agenda · 30 minutos"); title(s, "Roteiro da Apresentação");
const blocos = [
  ["1", "Pitch do Problema", "5 min", "A dor que estamos resolvendo"],
  ["2", "Fundamentação Teórica", "5 min", "Shimizu, Markov, Simplex, XAI"],
  ["3", "Demonstração da Solução", "10 min", "A IA em funcionamento"],
  ["4", "Resultados e Crítica", "10 min", "O que aprendeu e onde falha"],
];
const cw = 2.85, gap = 0.27, x0 = M, cy = 2.1, ch = 4.4;
blocos.forEach((b, i) => {
  const x = x0 + i * (cw + gap);
  card(s, x, cy, cw, ch, i % 2 ? ICEBG : NAVY);
  const onDark = i % 2 === 0;
  circleNum(s, b[0], x + cw / 2 - 0.45, cy + 0.45, 0.9, GOLD, NAVY);
  s.addText(b[1], { x: x + 0.2, y: cy + 1.6, w: cw - 0.4, h: 1.0, align: "center", valign: "top",
    fontFace: TITLEF, fontSize: 18, bold: true, color: onDark ? WHITE : NAVY, margin: 0 });
  s.addText(b[2], { x: x + 0.2, y: cy + 2.55, w: cw - 0.4, h: 0.45, align: "center",
    fontFace: BODYF, fontSize: 16, bold: true, color: GOLD, margin: 0 });
  s.addText(b[3], { x: x + 0.25, y: cy + 3.1, w: cw - 0.5, h: 1.0, align: "center", valign: "top",
    fontFace: BODYF, fontSize: 13, color: onDark ? ICE : GRAY, margin: 0 });
});

// ============ SLIDE 3 — O PROBLEMA ============
s = pres.addSlide(); s.background = { color: WHITE };
tag(s, "Bloco 1 · Pitch do Problema"); title(s, "O Problema: decidir a produção no escuro");
s.addText([
  { text: "A AgroVale Alimentos", options: { bold: true } },
  { text: " decide, toda semana, " },
  { text: "quanto produzir de cada um dos 5 produtos", options: { bold: true } },
  { text: " — hoje no feeling e em planilhas, sob demanda incerta e recursos limitados (máquina, matéria-prima e capital de giro)." },
], { x: M, y: 1.95, w: 6.3, h: 2.3, fontFace: BODYF, fontSize: 17, color: DARKTXT, lineSpacingMultiple: 1.15, margin: 0, valign: "top" });
card(s, M, 4.5, 6.3, 1.7, ICEBG);
s.addText([
  { text: "Problema SEMIESTRUTURADO (Shimizu)\n", options: { bold: true, color: NAVY, fontSize: 16 } },
  { text: "Restrições e lucro são modeláveis; a demanda futura e o julgamento gerencial, não totalmente.", options: { color: GRAY, fontSize: 14 } },
], { x: M + 0.3, y: 4.7, w: 5.7, h: 1.3, fontFace: BODYF, valign: "middle", margin: 0 });
// dois cartões de "dor" à direita
const dor = [["Superprodução", "Perdas e custo de estoque\n(produtos perecíveis)", "B85042"],
             ["Ruptura", "Venda perdida e\ncliente insatisfeito", NAVY]];
dor.forEach((d, i) => {
  const x = 7.4, y = 1.95 + i * 2.25;
  card(s, x, y, 5.3, 2.0, d[2]);
  s.addText(d[0], { x: x + 0.35, y: y + 0.25, w: 4.6, h: 0.6, fontFace: TITLEF, fontSize: 22, bold: true, color: WHITE, margin: 0 });
  s.addText(d[1], { x: x + 0.35, y: y + 0.95, w: 4.6, h: 0.9, fontFace: BODYF, fontSize: 15, color: ICE, margin: 0, valign: "top" });
});

// ============ SLIDE 4 — STAKEHOLDERS ============
s = pres.addSlide(); s.background = { color: WHITE };
tag(s, "Bloco 1 · Pitch do Problema"); title(s, "Stakeholders & Objetivos Conflitantes");
const stk = [
  ["Produção", "Estabilidade e ocupação eficiente das máquinas"],
  ["Vendas / Comercial", "Estoque alto para nunca perder venda (nível de serviço)"],
  ["Financeiro", "Minimizar capital imobilizado e custo de produção"],
  ["Direção", "Maximizar o lucro respeitando a capacidade instalada"],
];
const gw = 5.6, gh = 1.55, gx = M, gy = 2.0, ggap = 0.3;
stk.forEach((it, i) => {
  const x = gx + (i % 2) * (gw + ggap), y = gy + Math.floor(i / 2) * (gh + ggap);
  card(s, x, y, gw, gh, ICEBG);
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.12, h: gh, fill: { color: GOLD }, line: { type: "none" } });
  s.addText(it[0], { x: x + 0.35, y: y + 0.18, w: gw - 0.6, h: 0.45, fontFace: TITLEF, fontSize: 18, bold: true, color: NAVY, margin: 0 });
  s.addText(it[1], { x: x + 0.35, y: y + 0.68, w: gw - 0.6, h: 0.8, fontFace: BODYF, fontSize: 14, color: GRAY, margin: 0, valign: "top" });
});
card(s, M, 5.85, 12.13, 1.0, NAVY);
s.addText([
  { text: "Trade-off central:  ", options: { bold: true, color: GOLD } },
  { text: "nível de serviço × custo  —  o SAD torna esse conflito explícito e quantificável.", options: { color: WHITE } },
], { x: M + 0.3, y: 5.85, w: 11.5, h: 1.0, fontFace: BODYF, fontSize: 17, valign: "middle", margin: 0 });

// ============ SLIDE 5 — SHIMIZU ============
s = pres.addSlide(); s.background = { color: NAVY };
tag(s, "Bloco 2 · Fundamentação Teórica", true); title(s, "Fundamentação: a lógica de Shimizu", true);
s.addText([
  { text: "“Uma decisão não é apenas um cálculo matemático, mas um processo político e organizacional.”", options: { italic: true } },
], { x: M, y: 1.8, w: 12, h: 0.7, fontFace: BODYF, fontSize: 18, color: ICE, margin: 0 });
const sub = [["Subsistema de Dados", "Histórico de vendas + parâmetros de negócio"],
             ["Subsistema de Modelos", "Previsão → Simulação → Otimização → XAI"],
             ["Subsistema de Interface", "Dashboard executivo para o decisor"]];
sub.forEach((it, i) => {
  const x = M + i * 4.05, y = 2.8;
  card(s, x, y, 3.8, 2.7, NAVY2);
  circleNum(s, i + 1, x + 0.3, y + 0.3, 0.7, GOLD, NAVY);
  s.addText(it[0], { x: x + 0.3, y: y + 1.15, w: 3.2, h: 0.9, fontFace: TITLEF, fontSize: 17, bold: true, color: WHITE, margin: 0, valign: "top" });
  s.addText(it[1], { x: x + 0.3, y: y + 1.95, w: 3.2, h: 0.7, fontFace: BODYF, fontSize: 13, color: ICE, margin: 0, valign: "top" });
});
s.addText("Arquitetura clássica de um Sistema de Apoio à Decisão (SAD)", {
  x: M, y: 5.7, w: 12, h: 0.4, fontFace: BODYF, fontSize: 14, italic: true, color: GOLD, margin: 0 });

// ============ SLIDE 6 — TÉCNICAS × TEORIA ============
s = pres.addSlide(); s.background = { color: WHITE };
tag(s, "Bloco 2 · Fundamentação Teórica"); title(s, "Da Teoria à Técnica");
const rows = [
  ["Machine Learning", "Prevê a demanda futura por produto", "IA Preditiva"],
  ["Cadeia de Markov", "Modela regimes de mercado (baixa / normal / alta)", "Processos estocásticos"],
  ["Monte Carlo", "Gera 2.000 cenários → risco × incerteza", "Simulação"],
  ["Simplex / PL", "Decide o mix ótimo sob restrições", "Pesquisa Operacional"],
  ["XAI (SHAP + duais + LLM)", "Justifica a decisão em linguagem de gestor", "Explicabilidade"],
];
const tableRows = [[
  { text: "Técnica", options: { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 15, align: "left" } },
  { text: "Papel na decisão", options: { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 15, align: "left" } },
  { text: "Conceito da disciplina", options: { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 15, align: "left" } },
]];
rows.forEach((r, i) => {
  const bg = i % 2 ? ICEBG : "FFFFFF";
  tableRows.push([
    { text: r[0], options: { fill: { color: bg }, color: NAVY, bold: true, fontSize: 14 } },
    { text: r[1], options: { fill: { color: bg }, color: DARKTXT, fontSize: 14 } },
    { text: r[2], options: { fill: { color: bg }, color: GRAY, italic: true, fontSize: 13 } },
  ]);
});
s.addTable(tableRows, { x: M, y: 2.0, w: 12.13, colW: [3.4, 5.5, 3.23], rowH: 0.82,
  border: { type: "solid", pt: 1, color: "DDE5F2" }, valign: "middle",
  margin: [4, 8, 4, 8], fontFace: BODYF });

// ============ SLIDE 7 — ARQUITETURA ============
s = pres.addSlide(); s.background = { color: NAVY };
tag(s, "Bloco 3 · Demonstração", true); title(s, "Arquitetura da Solução — o Pipeline de Decisão", true);
const stages = [
  ["Dados", "Histórico + parâmetros"],
  ["Previsão", "Machine Learning"],
  ["Incerteza", "Monte Carlo + Markov"],
  ["Decisão", "Simplex / PL"],
  ["Explicação", "XAI"],
];
const sw = 2.18, sgap = 0.28, sx0 = M, syy = 2.7, shh = 2.1;
stages.forEach((st, i) => {
  const x = sx0 + i * (sw + sgap);
  card(s, x, syy, sw, shh, i === 3 ? GOLD : NAVY2);
  const onG = i === 3;
  s.addText(String(i + 1), { x: x + 0.2, y: syy + 0.18, w: 0.8, h: 0.5, fontFace: TITLEF, fontSize: 20, bold: true, color: onG ? NAVY : GOLD, margin: 0 });
  s.addText(st[0], { x: x + 0.2, y: syy + 0.78, w: sw - 0.4, h: 0.5, fontFace: TITLEF, fontSize: 17, bold: true, color: onG ? NAVY : WHITE, margin: 0 });
  s.addText(st[1], { x: x + 0.2, y: syy + 1.3, w: sw - 0.4, h: 0.7, fontFace: BODYF, fontSize: 12.5, color: onG ? NAVY : ICE, margin: 0, valign: "top" });
  if (i < stages.length - 1)
    s.addText("›", { x: x + sw - 0.05, y: syy, w: sgap + 0.1, h: shh, align: "center", valign: "middle", fontFace: BODYF, fontSize: 28, bold: true, color: GOLD, margin: 0 });
});
card(s, M, 5.4, 12.13, 1.05, NAVY2);
s.addText([
  { text: "Subsistema de Interface:  ", options: { bold: true, color: GOLD } },
  { text: "dashboard executivo (Streamlit) consome o pipeline e permite simulações what-if.", options: { color: WHITE } },
], { x: M + 0.3, y: 5.4, w: 11.5, h: 1.05, fontFace: BODYF, fontSize: 16, valign: "middle", margin: 0 });

// ============ SLIDE 8 — DEMO ============
s = pres.addSlide(); s.background = { color: WHITE };
tag(s, "Bloco 3 · Demonstração"); title(s, "Demonstração — a IA em Funcionamento");
const steps = [
  ["Ajustar", "Define-se a capacidade da fábrica (máquina, matéria-prima, orçamento)"],
  ["Rodar", "O pipeline prevê, simula e otimiza em segundos"],
  ["Ver o plano", "Quanto produzir de cada produto + lucro e risco"],
  ["Entender", "Lê-se a explicação (gargalo + justificativa em PT)"],
];
steps.forEach((st, i) => {
  const y = 2.0 + i * 1.12;
  circleNum(s, i + 1, M, y, 0.8, NAVY, WHITE);
  s.addText(st[0], { x: M + 1.05, y: y - 0.05, w: 3.0, h: 0.45, fontFace: TITLEF, fontSize: 18, bold: true, color: NAVY, margin: 0 });
  s.addText(st[1], { x: M + 1.05, y: y + 0.4, w: 6.0, h: 0.6, fontFace: BODYF, fontSize: 14, color: GRAY, margin: 0, valign: "top" });
});
card(s, 8.2, 2.0, 4.5, 4.5, NAVY);
s.addText("DEMO AO VIVO", { x: 8.5, y: 2.4, w: 3.9, h: 0.5, fontFace: BODYF, fontSize: 14, bold: true, color: GOLD, charSpacing: 2, margin: 0 });
s.addText("Dashboard Streamlit", { x: 8.5, y: 2.95, w: 3.9, h: 0.6, fontFace: TITLEF, fontSize: 22, bold: true, color: WHITE, margin: 0 });
s.addText([
  { text: "Inputs interativos · gráficos · plano recomendado · explicação · análise what-if.", options: { breakLine: true } },
  { text: "" , options: { breakLine: true }},
  { text: "Vídeo de backup disponível caso a demo ao vivo falhe.", options: { italic: true, color: ICE } },
], { x: 8.5, y: 3.7, w: 3.9, h: 2.5, fontFace: BODYF, fontSize: 14, color: WHITE, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });

// ============ SLIDE 9 — RESULTADOS: PLANO ============
s = pres.addSlide(); s.background = { color: WHITE };
tag(s, "Bloco 4 · Resultados e Crítica"); title(s, "Resultado — Plano Ótimo Recomendado");
s.addChart(pres.charts.BAR, [{
  name: "Unidades", labels: ["Suco\nIntegral", "Polpa\nCongelada", "Geleia\nArtesanal", "Doce\nem Barra", "Néctar\nLight"],
  values: [1368, 1023, 852, 15, 1033],
}], {
  x: M, y: 1.9, w: 7.6, h: 4.9, barDir: "col", chartColors: [NAVY],
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: DARKTXT, dataLabelFontFace: BODYF, dataLabelFontSize: 12,
  showLegend: false, catAxisLabelColor: GRAY, catAxisLabelFontSize: 11, valAxisLabelColor: GRAY,
  valGridLine: { color: "E8EDF6", size: 0.5 }, catGridLine: { style: "none" }, chartArea: { fill: { color: "FFFFFF" } },
});
card(s, 8.45, 1.9, 4.28, 1.7, NAVY);
s.addText("Lucro semanal ótimo", { x: 8.7, y: 2.1, w: 3.8, h: 0.4, fontFace: BODYF, fontSize: 14, color: ICE, margin: 0 });
s.addText("R$ 18.295,64", { x: 8.7, y: 2.5, w: 3.8, h: 0.9, fontFace: TITLEF, fontSize: 32, bold: true, color: GOLD, margin: 0 });
card(s, 8.45, 3.8, 4.28, 3.0, ICEBG);
s.addText("Insight não óbvio", { x: 8.7, y: 4.0, w: 3.8, h: 0.4, fontFace: TITLEF, fontSize: 16, bold: true, color: NAVY, margin: 0 });
s.addText([
  { text: "Doce em Barra", options: { bold: true } },
  { text: " quase não é produzido (15 un.): apesar da boa margem, consome recursos demais por unidade. A otimização revela o que a intuição não vê." },
], { x: 8.7, y: 4.5, w: 3.8, h: 2.2, fontFace: BODYF, fontSize: 14, color: DARKTXT, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });

// ============ SLIDE 10 — RISCO & GARGALO ============
s = pres.addSlide(); s.background = { color: WHITE };
tag(s, "Bloco 4 · Resultados e Crítica"); title(s, "Risco (Monte Carlo) & Gargalo (Simplex)");
s.addText("Distribuição de lucro — 2.000 cenários", { x: M, y: 1.85, w: 6, h: 0.4, fontFace: TITLEF, fontSize: 16, bold: true, color: NAVY, margin: 0 });
const stats = [["Lucro médio", "R$ 17.271,96", NAVY], ["Pior caso (p5)", "R$ 14.678,60", "B85042"], ["Melhor caso (p95)", "R$ 18.296,03", "2C5F2D"]];
stats.forEach((st, i) => {
  const y = 2.35 + i * 1.45;
  card(s, M, y, 5.8, 1.25, ICEBG);
  s.addShape(pres.shapes.RECTANGLE, { x: M, y, w: 0.12, h: 1.25, fill: { color: st[2] }, line: { type: "none" } });
  s.addText(st[0], { x: M + 0.35, y: y + 0.2, w: 3.0, h: 0.85, fontFace: BODYF, fontSize: 15, color: GRAY, margin: 0, valign: "middle" });
  s.addText(st[1], { x: M + 3.3, y: y + 0.2, w: 2.4, h: 0.85, fontFace: TITLEF, fontSize: 22, bold: true, color: NAVY, align: "right", margin: 0, valign: "middle" });
});
// gargalo (preços-sombra)
s.addText("Preços-sombra — onde está o gargalo", { x: 7.0, y: 1.85, w: 6, h: 0.4, fontFace: TITLEF, fontSize: 16, bold: true, color: NAVY, margin: 0 });
s.addChart(pres.charts.BAR, [{ name: "R$/unidade de recurso", labels: ["Orçamento", "Matéria-prima", "Horas máquina"], values: [1.23, 0.68, 0.0] }], {
  x: 6.9, y: 2.35, w: 5.9, h: 2.6, barDir: "bar", chartColors: [GOLD],
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: DARKTXT, dataLabelFontSize: 12,
  dataLabelFormatCode: "0.00", valAxisMaxVal: 1.5,
  showLegend: false, catAxisLabelColor: NAVY, catAxisLabelFontSize: 13, valAxisHidden: true,
  valGridLine: { style: "none" }, catGridLine: { style: "none" }, chartArea: { fill: { color: "FFFFFF" } },
});
card(s, 6.9, 5.2, 5.83, 1.6, NAVY);
s.addText([
  { text: "Orçamento é o gargalo dominante:  ", options: { bold: true, color: GOLD } },
  { text: "cada R$ 1 a mais gera R$ 1,23 de lucro. Horas de máquina sobram (preço-sombra zero)." , options: { color: WHITE } },
], { x: 7.2, y: 5.2, w: 5.3, h: 1.6, fontFace: BODYF, fontSize: 14.5, valign: "middle", margin: 0, lineSpacingMultiple: 1.1 });

// ============ SLIDE 11 — SENSIBILIDADE ============
s = pres.addSlide(); s.background = { color: WHITE };
tag(s, "Bloco 4 · Resultados e Crítica"); title(s, "Análise de Sensibilidade — Orçamento");
s.addChart(pres.charts.LINE, [{ name: "Lucro ótimo (R$)", labels: ["−20%", "−10%", "base", "+10%", "+20%"], values: [14700, 16500, 18296, 18379, 18379] }], {
  x: M, y: 1.95, w: 7.6, h: 4.7, chartColors: [GOLD], lineSize: 4, lineSmooth: false,
  showLegend: false, catAxisLabelColor: GRAY, catAxisLabelFontSize: 13, valAxisLabelColor: GRAY,
  valAxisMinVal: 13000, valAxisMaxVal: 19000, valGridLine: { color: "E8EDF6", size: 0.5 },
  showValue: true, dataLabelColor: NAVY, dataLabelFontSize: 12, dataLabelPosition: "t",
  chartArea: { fill: { color: "FFFFFF" } },
});
card(s, 8.45, 1.95, 4.28, 4.7, NAVY);
s.addText("Retornos decrescentes", { x: 8.75, y: 2.25, w: 3.7, h: 0.5, fontFace: TITLEF, fontSize: 20, bold: true, color: WHITE, margin: 0 });
s.addText([
  { text: "Aumentar o orçamento eleva o lucro até cerca de ", },
  { text: "+10%", options: { bold: true, color: GOLD } },
  { text: ". A partir daí a ", },
  { text: "matéria-prima passa a restringir", options: { bold: true, color: GOLD } },
  { text: " e o lucro estabiliza em R$ 18.378,94." },
], { x: 8.75, y: 2.95, w: 3.7, h: 2.4, fontFace: BODYF, fontSize: 15, color: ICE, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
s.addText("→ orienta onde investir.", { x: 8.75, y: 5.7, w: 3.7, h: 0.6, fontFace: BODYF, fontSize: 15, italic: true, color: GOLD, margin: 0 });

// ============ SLIDE 12 — XAI ============
s = pres.addSlide(); s.background = { color: NAVY };
tag(s, "Bloco 4 · Resultados e Crítica", true); title(s, "Explicabilidade (XAI) — sem caixa-preta", true);
s.addText("“Um gestor raramente aceita uma decisão vinda de uma caixa-preta.” — Shimizu", {
  x: M, y: 1.8, w: 12, h: 0.5, fontFace: BODYF, fontSize: 17, italic: true, color: ICE, margin: 0 });
const xai = [
  ["Preços-sombra", "SIMPLEX", "Por que o plano é ótimo e onde está o gargalo — explicabilidade nativa da Pesquisa Operacional."],
  ["SHAP", "MACHINE LEARNING", "O que dirige a previsão de demanda: sazonalidade, tendência e vendas recentes."],
  ["Linguagem natural", "LLM (CLAUDE)", "Traduz os números em um parágrafo executivo em português, pronto para o comitê."],
];
xai.forEach((it, i) => {
  const x = M + i * 4.05, y = 2.7;
  card(s, x, y, 3.8, 3.6, NAVY2);
  s.addText(it[1], { x: x + 0.3, y: y + 0.3, w: 3.2, h: 0.35, fontFace: BODYF, fontSize: 12, bold: true, color: GOLD, charSpacing: 1.5, margin: 0 });
  s.addText(it[0], { x: x + 0.3, y: y + 0.75, w: 3.2, h: 0.9, fontFace: TITLEF, fontSize: 20, bold: true, color: WHITE, margin: 0, valign: "top" });
  s.addText(it[2], { x: x + 0.3, y: y + 1.7, w: 3.2, h: 1.7, fontFace: BODYF, fontSize: 14, color: ICE, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
});

// ============ SLIDE 13 — CRÍTICA ============
s = pres.addSlide(); s.background = { color: WHITE };
tag(s, "Bloco 4 · Resultados e Crítica"); title(s, "O que aprendeu · Onde falha · Próximos passos");
const crit = [
  ["O que a IA aprendeu", "2C5F2D", ["Padrões sazonais da demanda", "Quais produtos priorizar sob escassez", "Qual recurso limita o lucro (orçamento)"]],
  ["Onde ela falha", "B85042", ["Dados sintéticos não capturam choques reais", "Viés do histórico se propaga à previsão", "Linearidade ignora ganhos de escala"]],
  ["Próximos passos", NAVY, ["Validar com dados reais da empresa", "Programação estocástica de 2 estágios", "Integração ao ERP para uso semanal"]],
];
crit.forEach((c, i) => {
  const x = M + i * 4.05, y = 2.0;
  card(s, x, y, 3.8, 4.7, ICEBG);
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: 3.8, h: 0.7, fill: { color: c[1] }, line: { type: "none" } });
  s.addText(c[0], { x: x + 0.25, y: y, w: 3.3, h: 0.7, fontFace: TITLEF, fontSize: 16, bold: true, color: WHITE, valign: "middle", margin: 0 });
  s.addText(c[2].map((t, j) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: true, paraSpaceAfter: 10 } })),
    { x: x + 0.3, y: y + 0.95, w: 3.2, h: 3.6, fontFace: BODYF, fontSize: 14, color: DARKTXT, margin: 0, valign: "top" });
});

// ============ SLIDE 14 — FECHAMENTO ============
s = pres.addSlide(); s.background = { color: NAVY };
s.addShape(pres.shapes.OVAL, { x: 10.4, y: -1.0, w: 4.0, h: 4.0, fill: { color: NAVY2 }, line: { type: "none" } });
s.addShape(pres.shapes.OVAL, { x: 11.6, y: 5.4, w: 2.3, h: 2.3, fill: { color: GOLD, transparency: 40 }, line: { type: "none" } });
s.addText("DECIDAI", { x: M, y: 2.2, w: 11, h: 0.5, fontFace: BODYF, fontSize: 15, bold: true, color: GOLD, charSpacing: 3, margin: 0 });
s.addText("De dados a uma decisão defensável.", { x: M, y: 2.8, w: 11, h: 1.4, fontFace: TITLEF, fontSize: 44, bold: true, color: WHITE, margin: 0 });
s.addText("Previsão · Simulação · Otimização · Explicabilidade — um SAD que recomenda e justifica.", {
  x: M, y: 4.4, w: 10.5, h: 0.7, fontFace: BODYF, fontSize: 18, color: ICE, margin: 0 });
s.addText("Obrigado!  ·  Perguntas?", { x: M, y: 5.7, w: 11, h: 0.6, fontFace: TITLEF, fontSize: 22, bold: true, color: GOLD, margin: 0 });

pres.writeFile({ fileName: path.join(__dirname, "Apresentacao_DecidAI.pptx") }).then((f) => console.log("OK:", f));
