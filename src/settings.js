import { clampCount } from "./quality.js";

// Aceita apenas preferências conhecidas. Dados antigos ou inválidos não devem
// impedir a abertura do editor nem substituir os padrões por valores vazios.
export function sanitizeSettings(data, { themes = [], sizes = [], templates = [], verseIds = [] } = {}) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  const clean = {};
  const mode = data.mode === "generate" ? "random" : data.mode;
  if (["random", "manual", "paste"].includes(mode)) clean.mode = mode;

  for (const [key, choices] of Object.entries({ theme: ["", ...themes], size: sizes, template: templates })) {
    if (typeof data[key] === "string" && choices.includes(data[key])) clean[key] = data[key];
  }
  for (const key of ["sameVerse", "fillPage", "defaultFooter", "mixTemplates"]) {
    if (typeof data[key] === "boolean") clean[key] = data[key];
  }
  for (const [key, min, max] of [["fontScale", 0.6, 1.6], ["overlay", 0, 0.85], ["count", 0, 120]]) {
    const raw = data[key];
    if (!["number", "string"].includes(typeof raw) || String(raw).trim() === "") continue;
    const value = Number(raw);
    if (!Number.isFinite(value)) continue;
    clean[key] = key === "count" ? clampCount(value) : Math.min(max, Math.max(min, value));
  }
  if (typeof data.footer === "string") clean.footer = data.footer.slice(0, 80);
  if (typeof data.pasteText === "string") clean.pasteText = data.pasteText;
  if (Array.isArray(data.pickedIds)) {
    const known = new Set(verseIds);
    clean.pickedIds = [...new Set(data.pickedIds.filter((id) => known.has(id)))];
  }
  if (Array.isArray(data.templateIds)) {
    clean.templateIds = [...new Set(data.templateIds.filter((id) => templates.includes(id)))];
  }
  return clean;
}
