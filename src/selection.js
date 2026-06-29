// selection.js — STUB inicial. DONO: Agente "data". Melhorar conforme CONTRACTS.md.
import { VERSES } from "./data/verses.js";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getRandomVerses(count, opts = {}) {
  let pool = VERSES;
  if (opts.themes && opts.themes.length) {
    pool = pool.filter((v) => v.themes.some((t) => opts.themes.includes(t)));
  }
  if (!pool.length) return [];
  const out = [];
  // repete o pool embaralhado até atingir count (sem repetir antes de esgotar)
  while (out.length < count) {
    for (const v of shuffle(pool)) {
      out.push(v);
      if (out.length >= count) break;
    }
  }
  return out;
}

export function searchVerses(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return VERSES.filter(
    (v) => v.ref.toLowerCase().includes(q) || v.text.toLowerCase().includes(q)
  );
}

export function parsePastedText(text) {
  const blocks = text
    .split(/\n\s*\n|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return blocks.map((block, i) => {
    // tenta separar "Ref - texto" ou "Ref: texto"
    const m = block.match(/^(.{2,40}?\d+[:.]\d+[\d,\-\s]*)\s*[-–:]\s*(.+)$/s);
    if (m) {
      return { id: `paste-${i}`, ref: m[1].trim(), text: m[2].trim(), themes: [] };
    }
    return { id: `paste-${i}`, ref: "", text: block, themes: [] };
  });
}

export function generateByTheme(theme, count) {
  if (!theme) return getRandomVerses(count);
  return getRandomVerses(count, { themes: [theme] });
}
