// layout.js — Diagramação A4 dos papeizinhos. DONO: Agente "layout".
// Monta uma ou mais folhas A4 com os papeizinhos lado a lado, aproveitando
// o máximo do papel, com auto-ajuste de fonte e marcas de corte para recorte.

/**
 * Presets de tamanho pensados para MAXIMIZAR papeizinhos por A4 (210×297mm).
 * Com margem de 8mm e gap de 3mm (ver A4 abaixo), a área útil é 194×281mm.
 * Cada medida foi escolhida para encaixar quase 100% da área útil (ver col/lin):
 *
 *  - mini    45.5×53.5 -> 4 col × 5 lin = 20 por folha (campanhas, texto curto)
 *  - small   62×68     -> 3 col × 4 lin = 12 por folha (econômico)
 *  - medium  62×91     -> 3 col × 3 lin =  9 por folha (boa leitura) [PADRÃO]
 *  - card    90×53.5   -> 2 col × 5 lin = 10 por folha (cartão de visita, deitado)
 *  - large   94×135    -> 2 col × 2 lin =  4 por folha (versículos longos)
 *
 * Os números de col/lin acima são referência (área ~98-99% aproveitada): o
 * cálculo real é feito em computeGrid() a partir das medidas, margem e gap.
 */
export const TRACT_SIZES = [
  { id: "mini", label: "Mini", wMm: 45.5, hMm: 53.5 },
  { id: "small", label: "Pequeno", wMm: 62, hMm: 68 },
  { id: "medium", label: "Médio", wMm: 62, hMm: 91 },
  { id: "card", label: "Cartão de visita", wMm: 90, hMm: 53.5 },
  { id: "large", label: "Grande", wMm: 94, hMm: 135 },
];

export const DEFAULT_SIZE_ID = "medium";

// Geometria da folha. Margem externa da folha + espaçamento entre papeizinhos.
const A4 = { wMm: 210, hMm: 297, marginMm: 8, gapMm: 3 };

// Estilo das marcas de corte: "dashed" (linha pontilhada na borda da célula)
// ou "marks" (cantinhos / crop marks discretos nos vértices). Alterar aqui
// para trocar globalmente o visual de recorte.
const CROP_STYLE = "marks"; // "marks" | "dashed"

// Auto-fit: limites de tamanho de fonte (em pt) para o corpo do versículo.
const AUTOFIT = { maxPt: 13, minPt: 5.5, stepPt: 0.5 };
export const MANUAL_FONT = Object.freeze({ minPt: 3, maxPt: 24, stepPt: 0.5, reviewBelowPt: 7 });

/** Ajusta somente esta cópia. null devolve o controle ao auto-ajuste. */
export function setTractFontSize(tract, fontPt = null) {
  if (!tract) return;
  const manual = fontPt !== null && Number.isFinite(Number(fontPt));
  tract._manualFontPt = manual
    ? Math.min(MANUAL_FONT.maxPt, Math.max(MANUAL_FONT.minPt, Number(fontPt)))
    : null;
  tract.dataset.manualFont = String(manual);
  autofitTract(tract);
}

/** Resolve o preset de tamanho a partir do id (com fallback seguro). */
function resolveSize(sizeId) {
  return TRACT_SIZES.find((s) => s.id === sizeId) || TRACT_SIZES[0];
}

/** Calcula colunas/linhas que cabem na área útil da A4 para um dado tamanho. */
function computeGrid(size) {
  const usableW = A4.wMm - 2 * A4.marginMm;
  const usableH = A4.hMm - 2 * A4.marginMm;
  // (n células)*w + (n-1)*gap <= usable  =>  n <= (usable+gap)/(w+gap)
  const cols = Math.max(1, Math.floor((usableW + A4.gapMm) / (size.wMm + A4.gapMm)));
  const rows = Math.max(1, Math.floor((usableH + A4.gapMm) / (size.hMm + A4.gapMm)));
  return { cols, rows, perPage: cols * rows };
}

/** Quantos papeizinhos cabem em UMA folha A4 para o tamanho dado (id). */
export function capacityPerPage(sizeId) {
  return computeGrid(resolveSize(sizeId)).perPage;
}

/** Cria a estrutura DOM de um papelzinho (sem ainda medir/ajustar fonte). */
function buildTract(verse, size, fontScale, template, footer, logo) {
  const tract = document.createElement("div");
  tract.className = "tract crop-" + CROP_STYLE;
  tract.style.width = `${size.wMm}mm`;
  tract.style.height = `${size.hMm}mm`;

  // Fundo: onde o template aplica a arte. Fica ATRÁS do conteúdo.
  const bg = document.createElement("div");
  bg.className = "tract-bg";

  // Conteúdo: versículo + referência.
  const content = document.createElement("div");
  content.className = "tract-content";

  const text = document.createElement("p");
  text.className = "tract-text";
  text.textContent = `“${(verse && verse.text) || ""}”`;

  const ref = document.createElement("p");
  ref.className = "tract-ref";
  ref.textContent = verse && verse.ref ? `${verse.ref} — ACF` : "ACF";

  content.appendChild(text);
  content.appendChild(ref);

  if (logo) {
    const image = document.createElement("img");
    image.className = "tract-logo";
    image.alt = "Logo da igreja";
    image.src = logo;
    content.appendChild(image);
  }

  // Rodapé opcional (igreja/contato) na base do papelzinho.
  if (footer) {
    const foot = document.createElement("p");
    foot.className = "tract-footer";
    foot.textContent = footer;
    content.appendChild(foot);
  }

  tract.appendChild(bg);
  tract.appendChild(content);

  // Cantos / crop marks (4 vértices). Visíveis na tela e na impressão.
  if (CROP_STYLE === "marks") {
    for (const pos of ["tl", "tr", "bl", "br"]) {
      const m = document.createElement("span");
      m.className = "crop-mark crop-" + pos;
      tract.appendChild(m);
    }
  }

  // Aplica a arte do template no fundo.
  try {
    if (template && typeof template.apply === "function") {
      template.apply(bg, { sizeId: size.id });
    }
  } catch (e) {
    console.warn("template.apply falhou:", e);
  }

  // Guarda o fontScale base do usuário para o auto-fit usar como multiplicador.
  tract._fontScale = typeof fontScale === "number" && fontScale > 0 ? fontScale : 1;
  tract._textEl = text;
  return tract;
}

/**
 * Auto-fit de UM papelzinho: reduz a fonte do versículo em passos até o texto
 * caber na área disponível (sem overflow vertical nem horizontal), respeitando
 * um mínimo legível. Usa medição real do DOM (scrollHeight/scrollWidth).
 * O fontScale do usuário multiplica o tamanho base.
 */
function autofitTract(tract) {
  const text = tract._textEl;
  const scale = tract._fontScale || 1;
  // .tract-content é a área onde o texto pode ocupar (já com padding).
  const content = tract.querySelector(".tract-content");
  if (!text || !content) return;
  if (Number.isFinite(tract._manualFontPt)) {
    text.style.fontSize = tract._manualFontPt + "pt";
    return;
  }

  // Começa do tamanho máximo (multiplicado pelo fontScale do usuário) e vai
  // diminuindo enquanto o conteúdo transbordar a célula.
  let pt = AUTOFIT.maxPt * scale;
  const minPt = AUTOFIT.minPt * scale;

  text.style.fontSize = pt + "pt";

  // Limite de iterações como salvaguarda contra loops.
  let guard = 0;
  while (pt > minPt && guard < 80) {
    const overflowsV = content.scrollHeight > content.clientHeight + 1;
    const overflowsH = content.scrollWidth > content.clientWidth + 1;
    if (!overflowsV && !overflowsH) break;
    pt = Math.max(minPt, pt - AUTOFIT.stepPt);
    text.style.fontSize = pt + "pt";
    guard++;
  }
}

/**
 * Renderiza dentro de containerEl uma ou mais páginas A4 com os papeizinhos.
 * @param {HTMLElement} containerEl
 * @param {{verses: Array, sizeId: string, template?: object, templates?: Array, fontScale?: number, footer?: string, logo?: string, fontOverrides?: Map<number, number>}} opts
 */
export function renderSheet(containerEl, { verses, sizeId, template, templates = [], fontScale = 1, footer = "", logo = "", fontOverrides = new Map() } = {}) {
  if (!containerEl) return;
  containerEl.innerHTML = "";

  const list = Array.isArray(verses) ? verses : [];
  const size = resolveSize(sizeId);
  const { cols, perPage } = computeGrid(size);

  // Lista vazia: nada a renderizar (o app.js já trata a mensagem de "vazio",
  // mas garantimos não quebrar caso renderSheet seja chamado direto).
  if (list.length === 0) return;

  const pageCount = Math.max(1, Math.ceil(list.length / perPage));
  const tracts = [];
  let idx = 0;

  for (let p = 0; p < pageCount; p++) {
    const page = document.createElement("div");
    page.className = "a4-page";
    page.dataset.page = String(p + 1);

    const grid = document.createElement("div");
    grid.className = "tract-grid";
    grid.style.gridTemplateColumns = `repeat(${cols}, ${size.wMm}mm)`;
    grid.style.gap = `${A4.gapMm}mm`;
    grid.style.padding = `${A4.marginMm}mm`;

    for (let i = 0; i < perPage && idx < list.length; i++, idx++) {
      const art = templates.length ? templates[idx % templates.length] : template;
      const tract = buildTract(list[idx], size, fontScale, art, footer, logo);
      tract.dataset.tractIndex = String(idx);
      tract.dataset.verseRef = list[idx].ref || "Texto colado";
      tract._manualFontPt = fontOverrides.has(idx) ? fontOverrides.get(idx) : null;
      tract.dataset.manualFont = String(fontOverrides.has(idx));
      grid.appendChild(tract);
      tracts.push(tract);
    }

    page.appendChild(grid);
    containerEl.appendChild(page);
  }

  // Auto-fit é feito DEPOIS de tudo estar no DOM (precisa de medições reais).
  // requestAnimationFrame garante que o layout já foi calculado pelo browser.
  const runAutofit = () => {
    for (const t of tracts) autofitTract(t);
  };
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(runAutofit);
  } else {
    runAutofit();
  }
}
