// layout.js — STUB inicial. DONO: Agente "layout". Melhorar conforme CONTRACTS.md.
// Diagrama os papelzinhos em grade preenchendo a folha A4.

export const TRACT_SIZES = [
  { id: "small", label: "Pequeno", wMm: 52, hMm: 74 },
  { id: "medium", label: "Médio", wMm: 74, hMm: 105 },
  { id: "card", label: "Cartão", wMm: 90, hMm: 50 },
];
export const DEFAULT_SIZE_ID = "medium";

const A4 = { wMm: 210, hMm: 297, marginMm: 8, gapMm: 3 };

export function renderSheet(containerEl, { verses, sizeId, template, fontScale = 1 }) {
  containerEl.innerHTML = "";
  const size = TRACT_SIZES.find((s) => s.id === sizeId) || TRACT_SIZES[0];

  const usableW = A4.wMm - 2 * A4.marginMm;
  const usableH = A4.hMm - 2 * A4.marginMm;
  const cols = Math.max(1, Math.floor((usableW + A4.gapMm) / (size.wMm + A4.gapMm)));
  const rows = Math.max(1, Math.floor((usableH + A4.gapMm) / (size.hMm + A4.gapMm)));
  const perPage = cols * rows;

  const pages = Math.max(1, Math.ceil(verses.length / perPage));
  let idx = 0;

  for (let p = 0; p < pages; p++) {
    const page = document.createElement("div");
    page.className = "a4-page";
    const grid = document.createElement("div");
    grid.className = "tract-grid";
    grid.style.gridTemplateColumns = `repeat(${cols}, ${size.wMm}mm)`;
    grid.style.gap = `${A4.gapMm}mm`;
    grid.style.padding = `${A4.marginMm}mm`;

    for (let i = 0; i < perPage && idx < verses.length; i++, idx++) {
      const v = verses[idx];
      const tract = document.createElement("div");
      tract.className = "tract";
      tract.style.width = `${size.wMm}mm`;
      tract.style.height = `${size.hMm}mm`;

      const bg = document.createElement("div");
      bg.className = "tract-bg";

      const content = document.createElement("div");
      content.className = "tract-content";
      content.style.fontSize = `${fontScale}em`;
      const text = document.createElement("p");
      text.className = "tract-text";
      text.textContent = `"${v.text}"`;
      const ref = document.createElement("p");
      ref.className = "tract-ref";
      ref.textContent = v.ref ? `${v.ref} — ACF` : "ACF";
      content.appendChild(text);
      content.appendChild(ref);

      tract.appendChild(bg);
      tract.appendChild(content);
      try {
        if (template && typeof template.apply === "function") {
          template.apply(bg, { sizeId: size.id });
        }
      } catch (e) {
        console.warn("template.apply falhou:", e);
      }
      grid.appendChild(tract);
    }
    page.appendChild(grid);
    containerEl.appendChild(page);
  }
}
