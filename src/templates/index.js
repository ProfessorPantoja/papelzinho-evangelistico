// templates/index.js — DONO: Agente "templates".
// Artes de fundo para os papeizinhos. Cada template aplica uma arte ao
// elemento `.tract-bg` (position:absolute; inset:0;) que fica ATRÁS do
// conteúdo (`.tract-content`). Tudo feito com CSS e/ou SVG inline — sem
// imagens externas. Cores suaves e bom contraste para não atrapalhar a
// leitura do versículo (texto escuro) e economizar tinta na impressão.

export const DEFAULT_TEMPLATE_ID = "plain";

/**
 * Helper: define a classe base + a classe do template e zera qualquer
 * SVG/markup de uma aplicação anterior (templates podem ser trocados em
 * cima do mesmo elemento).
 * @param {HTMLElement} bgEl
 * @param {string} cls
 */
function setBg(bgEl, cls) {
  bgEl.className = "tract-bg " + cls;
  bgEl.innerHTML = "";
}

/**
 * Helper: insere SVG inline que preenche todo o fundo.
 * O SVG usa preserveAspectRatio="none" via viewBox + width/height 100%
 * para acompanhar qualquer proporção de papelzinho.
 * @param {HTMLElement} bgEl
 * @param {string} svg
 */
function injectSvg(bgEl, svg) {
  bgEl.insertAdjacentHTML("beforeend", svg);
}

export const TEMPLATES = [
  {
    id: "plain",
    name: "Liso (branco)",
    apply(bgEl) {
      setBg(bgEl, "tpl-plain");
    },
  },

  {
    id: "soft-blue",
    name: "Azul suave",
    apply(bgEl) {
      setBg(bgEl, "tpl-soft-blue");
    },
  },

  {
    id: "kraft",
    name: "Papel kraft (bege)",
    apply(bgEl) {
      setBg(bgEl, "tpl-kraft");
    },
  },

  {
    id: "frame",
    name: "Moldura ornamental",
    apply(bgEl) {
      setBg(bgEl, "tpl-frame");
      // Cantos decorativos em SVG (flores-de-lis estilizadas nos 4 cantos).
      injectSvg(
        bgEl,
        svgWrap(
          `<defs>${corner()}</defs>` +
            `<use href="#pz-corner" x="0" y="0"/>` +
            `<use href="#pz-corner" x="100" y="0" transform="scale(-1,1)" transform-origin="50 0"/>` +
            `<use href="#pz-corner" x="0" y="100" transform="scale(1,-1)" transform-origin="0 50"/>` +
            `<use href="#pz-corner" x="100" y="100" transform="scale(-1,-1)" transform-origin="50 50"/>`,
          "pz-svg-corners"
        )
      );
    },
  },

  {
    id: "cross-watermark",
    name: "Marca d'água de cruz",
    apply(bgEl) {
      setBg(bgEl, "tpl-cross");
      // Cruz central muito discreta, em marca d'água.
      injectSvg(
        bgEl,
        svgWrap(
          `<g class="pz-cross-mark" transform="translate(50 50)">` +
            `<rect x="-6" y="-26" width="12" height="62" rx="3"/>` +
            `<rect x="-22" y="-8" width="44" height="12" rx="3"/>` +
            `</g>`,
          "pz-svg-cross"
        )
      );
    },
  },

  {
    id: "leaves",
    name: "Folhas (orgânico leve)",
    apply(bgEl) {
      setBg(bgEl, "tpl-leaves");
      // Ramo de folhas discreto no canto inferior.
      injectSvg(
        bgEl,
        svgWrap(
          `<g class="pz-leaf-branch">` +
            `<path d="M2 100 C 22 86, 34 70, 40 50" fill="none"/>` +
            leaf(14, 78, -35) +
            leaf(26, 64, -20) +
            leaf(36, 50, -5) +
            leaf(10, 70, 150) +
            leaf(22, 56, 165) +
            `</g>`,
          "pz-svg-leaves"
        )
      );
    },
  },

  {
    id: "rays",
    name: "Raios de luz",
    apply(bgEl) {
      setBg(bgEl, "tpl-rays");
      // Raios suaves saindo do topo, com radial glow no CSS.
      injectSvg(
        bgEl,
        svgWrap(rays(50, -8, 14), "pz-svg-rays")
      );
    },
  },

  {
    id: "dots",
    name: "Pontilhado elegante",
    apply(bgEl) {
      setBg(bgEl, "tpl-dots");
    },
  },

  {
    id: "warm",
    name: "Pêssego suave",
    apply(bgEl) {
      setBg(bgEl, "tpl-warm");
    },
  },

  {
    id: "mint",
    name: "Verde menta",
    apply(bgEl) {
      setBg(bgEl, "tpl-mint");
    },
  },

  {
    id: "lavender",
    name: "Lavanda",
    apply(bgEl) {
      setBg(bgEl, "tpl-lavender");
    },
  },

  {
    id: "dove",
    name: "Pomba (marca d'água)",
    apply(bgEl) {
      setBg(bgEl, "tpl-dove");
      injectSvg(bgEl, svgWrapCentered(dove(), "pz-svg-dove"));
    },
  },

  {
    id: "fish",
    name: "Peixe (marca d'água)",
    apply(bgEl) {
      setBg(bgEl, "tpl-fish");
      injectSvg(bgEl, svgWrapCentered(fish(), "pz-svg-fish"));
    },
  },

  {
    id: "book",
    name: "Bíblia aberta",
    apply(bgEl) {
      setBg(bgEl, "tpl-book");
      injectSvg(bgEl, svgWrapCentered(book(), "pz-svg-book"));
    },
  },

  {
    id: "aurora",
    name: "Aurora (pastel)",
    apply(bgEl) {
      setBg(bgEl, "tpl-aurora");
    },
  },

  {
    id: "waves",
    name: "Ondas do mar",
    apply(bgEl) {
      setBg(bgEl, "tpl-waves");
      injectSvg(
        bgEl,
        svgWrap(
          `<g class="pz-waves">` +
            `<path class="w1" d="M0 84 C 12 80, 22 88, 34 86 C 48 84, 58 78, 70 80 C 82 82, 92 88, 100 85 L100 100 L0 100 Z"/>` +
            `<path class="w2" d="M0 91 C 14 87, 26 94, 40 92 C 54 90, 66 86, 78 89 C 88 91, 95 94, 100 92 L100 100 L0 100 Z"/>` +
            `</g>`,
          "pz-svg-waves"
        )
      );
    },
  },

  {
    id: "wheat",
    name: "Trigo (colheita)",
    apply(bgEl) {
      setBg(bgEl, "tpl-wheat");
      injectSvg(
        bgEl,
        svgWrap(
          `<g class="pz-wheat">` +
            wheatStalk(88, 8) +
            wheatStalk(95, -6) +
            `</g>`,
          "pz-svg-wheat"
        )
      );
    },
  },

  {
    id: "stars",
    name: "Céu estrelado (suave)",
    apply(bgEl) {
      setBg(bgEl, "tpl-stars");
      injectSvg(bgEl, svgWrap(stars(), "pz-svg-stars"));
    },
  },

  {
    id: "heart",
    name: "Coração (marca d'água)",
    apply(bgEl) {
      setBg(bgEl, "tpl-heart");
      injectSvg(bgEl, svgWrapCentered(heart(), "pz-svg-heart"));
    },
  },

  {
    id: "anchor",
    name: "Âncora da esperança",
    apply(bgEl) {
      setBg(bgEl, "tpl-anchor");
      injectSvg(bgEl, svgWrapCentered(anchor(), "pz-svg-anchor"));
    },
  },

  {
    id: "vine",
    name: "Videira",
    apply(bgEl) {
      setBg(bgEl, "tpl-vine");
      injectSvg(
        bgEl,
        svgWrap(
          `<g class="pz-vine">` +
            `<path class="pz-vine-stem" d="M-2 8 C 20 4, 40 12, 60 8 C 78 5, 92 9, 102 6" fill="none"/>` +
            leaf(12, 7, -30) +
            leaf(30, 9, 20) +
            leaf(50, 8, -25) +
            leaf(70, 7, 15) +
            leaf(88, 8, -20) +
            grapes(22, 13) +
            grapes(62, 12) +
            `</g>`,
          "pz-svg-vine"
        )
      );
    },
  },

  {
    id: "rainbow",
    name: "Arco-íris (promessa)",
    apply(bgEl) {
      setBg(bgEl, "tpl-rainbow");
      injectSvg(bgEl, svgWrap(rainbowArcs(), "pz-svg-rainbow"));
    },
  },
];

/* ----------------------- helpers de SVG ----------------------- */

// Envólucro padrão: viewBox 0..100 nos dois eixos, esticado para preencher.
function svgWrap(inner, cls) {
  return (
    `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" ` +
    `viewBox="0 0 100 100" preserveAspectRatio="none" ` +
    `width="100%" height="100%" aria-hidden="true" focusable="false">` +
    inner +
    `</svg>`
  );
}

// Ornamento de canto reutilizável (definição <symbol>-like via <g id>).
function corner() {
  return (
    `<g id="pz-corner" class="pz-corner-art">` +
    `<path d="M3 22 C 3 10, 10 3, 22 3" fill="none"/>` +
    `<path d="M7 18 C 7 11, 11 7, 18 7" fill="none"/>` +
    `<circle cx="22" cy="22" r="1.6"/>` +
    `<path d="M22 9 q 5 0 5 5 q 0 -5 5 -5 q -5 0 -5 -5 q 0 5 -5 5 Z"/>` +
    `</g>`
  );
}

// Uma folhinha em (cx,cy) rotacionada `rot` graus.
function leaf(cx, cy, rot) {
  return (
    `<g class="pz-leaf" transform="translate(${cx} ${cy}) rotate(${rot})">` +
    `<path d="M0 0 C 5 -3, 9 -3, 12 0 C 9 3, 5 3, 0 0 Z"/>` +
    `</g>`
  );
}

// Envólucro centralizado: mantém a proporção do desenho (símbolos não distorcem).
function svgWrapCentered(inner, cls) {
  return (
    `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" ` +
    `viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" ` +
    `width="100%" height="100%" aria-hidden="true" focusable="false">` +
    inner +
    `</svg>`
  );
}

// Pomba voando (símbolo do Espírito Santo / paz), centralizada.
function dove() {
  return (
    `<g class="pz-dove" transform="translate(50 50)">` +
    // asa (varre para cima e para a direita)
    `<path d="M-6 2 C -8 -16, 6 -28, 30 -30 C 14 -22, 6 -10, 6 2 Z"/>` +
    // corpo + cabeça + bico
    `<path d="M-30 8 C -18 2, 0 2, 10 4 C 16 5, 22 4, 26 1 L33 3 L26 6 ` +
    `C 20 10, 10 10, 4 9 C -6 12, -20 12, -30 8 Z"/>` +
    // cauda bifurcada (à esquerda)
    `<path d="M-30 8 L-40 4 L-33 9 L-41 12 L-29 11 Z"/>` +
    `<circle cx="22" cy="2" r="1.2"/>` +
    `</g>`
  );
}

// Peixe (ichthys), símbolo cristão clássico.
function fish() {
  return (
    `<g class="pz-fish" transform="translate(50 50)">` +
    `<path d="M-34 0 C -16 -20, 16 -20, 30 0 C 16 20, -16 20, -34 0 Z" fill="none"/>` +
    `<path d="M26 -10 L40 0 L26 10" fill="none"/>` +
    `<circle cx="-22" cy="-4" r="1.6"/>` +
    `</g>`
  );
}

// Bíblia aberta (duas páginas) com marcador.
function book() {
  return (
    `<g class="pz-book" transform="translate(50 52)">` +
    `<path d="M0 -16 C -10 -22, -26 -22, -34 -18 L-34 16 C -26 12, -10 12, 0 18 Z" fill="none"/>` +
    `<path d="M0 -16 C 10 -22, 26 -22, 34 -18 L34 16 C 26 12, 10 12, 0 18 Z" fill="none"/>` +
    `<line x1="0" y1="-16" x2="0" y2="18"/>` +
    `<line x1="-26" y1="-12" x2="-8" y2="-9"/>` +
    `<line x1="-26" y1="-5" x2="-8" y2="-2"/>` +
    `<line x1="-26" y1="2" x2="-8" y2="5"/>` +
    `<line x1="8" y1="-9" x2="26" y2="-12"/>` +
    `<line x1="8" y1="-2" x2="26" y2="-5"/>` +
    `<line x1="8" y1="5" x2="26" y2="2"/>` +
    `</g>`
  );
}

// Espiga de trigo: haste vertical em x (base no rodapé) com grãos alternados.
function wheatStalk(x, rot) {
  let grains = "";
  for (let i = 0; i < 6; i++) {
    const y = 78 - i * 7;
    grains +=
      `<ellipse cx="${x - 2.2}" cy="${y}" rx="2.6" ry="1.4" ` +
      `transform="rotate(-28 ${x - 2.2} ${y})"/>` +
      `<ellipse cx="${x + 2.2}" cy="${y - 3.5}" rx="2.6" ry="1.4" ` +
      `transform="rotate(28 ${x + 2.2} ${y - 3.5})"/>`;
  }
  return (
    `<g transform="rotate(${rot} ${x} 100)">` +
    `<path d="M${x} 100 L${x} 34" fill="none"/>` +
    grains +
    `</g>`
  );
}

// Estrelinhas discretas no alto do cartão (pontos + uma estrela de 4 pontas).
function stars() {
  const pts = [
    [12, 12, 1.0], [30, 7, 0.7], [48, 14, 1.1], [66, 6, 0.8], [84, 12, 1.0],
    [22, 22, 0.6], [58, 24, 0.7], [76, 20, 0.6], [40, 26, 0.5], [90, 26, 0.8],
  ];
  let s = pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("");
  // estrela maior de 4 pontas
  s += `<path d="M50 8 L52 14 L58 16 L52 18 L50 24 L48 18 L42 16 L48 14 Z"/>`;
  return `<g class="pz-stars">${s}</g>`;
}

// Coração centralizado (marca d'água).
function heart() {
  return (
    `<g class="pz-heart" transform="translate(50 48)">` +
    `<path d="M0 -12 C -5 -24, -22 -22, -22 -8 C -22 4, -9 12, 0 20 ` +
    `C 9 12, 22 4, 22 -8 C 22 -22, 5 -24, 0 -12 Z"/>` +
    `</g>`
  );
}

// Âncora (Hebreus 6:19 — “âncora da alma”).
function anchor() {
  return (
    `<g class="pz-anchor" transform="translate(50 50)">` +
    `<circle cx="0" cy="-24" r="4.5" fill="none"/>` +
    `<line x1="0" y1="-19.5" x2="0" y2="13"/>` +
    `<line x1="-11" y1="-9" x2="11" y2="-9"/>` +
    `<path d="M-18 2 C -15 14, 15 14, 18 2" fill="none"/>` +
    `<path d="M-18 2 L-23 -1 L-15 -3 Z"/>` +
    `<path d="M18 2 L23 -1 L15 -3 Z"/>` +
    `</g>`
  );
}

// Cachinho de uvas (3 bagas) para a videira.
function grapes(cx, cy) {
  return (
    `<g class="pz-grapes">` +
    `<circle cx="${cx}" cy="${cy}" r="1.6"/>` +
    `<circle cx="${cx + 2.8}" cy="${cy + 1}" r="1.6"/>` +
    `<circle cx="${cx + 1.2}" cy="${cy + 3.2}" r="1.6"/>` +
    `</g>`
  );
}

// Arcos concêntricos pastéis subindo do rodapé (arco-íris da promessa).
function rainbowArcs() {
  const radii = [58, 50, 42, 34, 26];
  let s = "";
  radii.forEach((r, i) => {
    s += `<path class="pz-rb pz-rb${i + 1}" fill="none" ` +
      `d="M${50 - r} 100 A ${r} ${r} 0 0 1 ${50 + r} 100"/>`;
  });
  return `<g class="pz-rainbow">${s}</g>`;
}

// Conjunto de raios em leque a partir de (ox,oy).
function rays(ox, oy, count) {
  let s = "";
  const spread = 150; // graus totais do leque
  const start = -spread / 2;
  for (let i = 0; i < count; i++) {
    const ang = ((start + (spread * i) / (count - 1)) * Math.PI) / 180;
    const len = 160;
    const x = ox + Math.sin(ang) * len;
    const y = oy + Math.cos(ang) * len;
    s += `<line x1="${ox}" y1="${oy}" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}"/>`;
  }
  return `<g class="pz-rays">${s}</g>`;
}

/**
 * Cria um template a partir de uma imagem enviada pelo usuário (data URL).
 * Aplica um "clareador" branco por cima (overlay 0..0.85) para manter o
 * versículo legível mesmo sobre imagens coloridas/escuras.
 * @param {string} dataUrl  imagem em data URL (ex.: "data:image/png;base64,...")
 * @param {{overlay?: number, name?: string}} [opts]
 */
export function makeImageTemplate(dataUrl, opts = {}) {
  const overlay = Math.min(0.85, Math.max(0, opts.overlay ?? 0.35));
  const v = overlay.toFixed(2);
  return {
    id: "custom",
    name: opts.name || "Imagem própria",
    apply(bgEl) {
      setBg(bgEl, "tpl-custom");
      bgEl.style.backgroundImage =
        `linear-gradient(rgba(255,255,255,${v}), rgba(255,255,255,${v})), url("${dataUrl}")`;
      bgEl.style.backgroundSize = "cover";
      bgEl.style.backgroundPosition = "center";
      bgEl.style.backgroundRepeat = "no-repeat";
    },
  };
}

/**
 * Retorna o template pelo id, com fallback para o DEFAULT (plain).
 * @param {string} id
 */
export function getTemplate(id) {
  return (
    TEMPLATES.find((t) => t.id === id) ||
    TEMPLATES.find((t) => t.id === DEFAULT_TEMPLATE_ID) ||
    TEMPLATES[0]
  );
}
