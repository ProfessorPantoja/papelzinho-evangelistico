// selection.js — Seleção e busca de versículos. DONO: Agente "data".
import { VERSES } from "./data/verses.js";

/** Remove acentos e normaliza para comparação insensível a acento/maiúsculas. */
function normalize(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Embaralhamento Fisher-Yates (não-mutante). */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Sorteia `count` versículos. Respeita opts.themes (qualquer tema casa).
 * Não repete um versículo antes de esgotar o pool; só repete quando
 * `count` excede o tamanho do pool (depois de já ter usado todos).
 * @param {number} count
 * @param {{themes?: string[]}} [opts]
 * @returns {import("./data/verses.js").Verse[]}
 */
export function getRandomVerses(count, opts = {}) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  if (!n) return [];

  let pool = VERSES;
  if (opts.themes && opts.themes.length) {
    const wanted = opts.themes.map(normalize);
    pool = pool.filter((v) =>
      v.themes.some((t) => wanted.includes(normalize(t)))
    );
  }
  if (!pool.length) return [];

  const out = [];
  // Esgota um embaralhamento completo antes de reembaralhar -> sem repetir
  // até usar todos; permite repetição apenas após esgotar o pool.
  while (out.length < n) {
    for (const v of shuffle(pool)) {
      out.push(v);
      if (out.length >= n) break;
    }
  }
  return out;
}

/**
 * Busca por referência e por texto, insensível a acentos/maiúsculas.
 * Ordena por relevância: matches na referência vêm antes dos matches só no texto.
 * @param {string} query
 * @returns {import("./data/verses.js").Verse[]}
 */
export function searchVerses(query) {
  const q = normalize(query);
  if (!q) return [];

  const refMatches = [];
  const textMatches = [];
  for (const v of VERSES) {
    const inRef = normalize(v.ref).includes(q);
    const inText = normalize(v.text).includes(q);
    if (inRef) refMatches.push(v);
    else if (inText) textMatches.push(v);
  }
  return [...refMatches, ...textMatches];
}

/**
 * Separa um ou mais versículos colados.
 * Detecta "Referência - texto" / "Referência: texto" mesmo com livros
 * numerados (ex.: "1 João 1:9"). Gera id único; se não houver referência
 * detectável, mantém ref vazia e usa o bloco inteiro como texto.
 * @param {string} text
 * @returns {import("./data/verses.js").Verse[]}
 */
export function parsePastedText(text) {
  if (!text || typeof text !== "string") return [];

  const blocks = text
    .split(/\r?\n\s*\r?\n|\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Referência: livro opcional com número inicial (1/2/3), nome do livro,
  // capítulo:versículo (e intervalos/listas tipo 8-9 ou 1,9). Aceita ":" ou ".".
  const refRe =
    /^([1-3]?\s*[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ.\s]*?\s+\d{1,3}[:.]\d{1,3}(?:[-–]\d{1,3})?(?:\s*,\s*\d{1,3})*)\s*[-–:]\s*(.+)$/s;

  return blocks.map((block, i) => {
    const m = block.match(refRe);
    if (m && m[2].trim()) {
      return {
        id: `paste-${i}-${Date.now()}`,
        ref: m[1].replace(/\s+/g, " ").trim(),
        text: m[2].replace(/\s+/g, " ").trim(),
        themes: [],
      };
    }
    return {
      id: `paste-${i}-${Date.now()}`,
      ref: "",
      text: block.replace(/\s+/g, " ").trim(),
      themes: [],
    };
  });
}

/**
 * Filtra por tema (insensível a acento) e completa com aleatórios do tema.
 * Sem tema, sorteia do banco inteiro.
 * @param {string} theme
 * @param {number} count
 * @returns {import("./data/verses.js").Verse[]}
 */
export function generateByTheme(theme, count) {
  if (!theme) return getRandomVerses(count);
  return getRandomVerses(count, { themes: [theme] });
}
