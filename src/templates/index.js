// templates/index.js — STUB inicial. DONO: Agente "templates". Criar >= 4 templates bonitos.

export const DEFAULT_TEMPLATE_ID = "plain";

export const TEMPLATES = [
  {
    id: "plain",
    name: "Liso (branco)",
    apply(bgEl) {
      bgEl.className = "tract-bg tpl-plain";
    },
  },
  {
    id: "soft-blue",
    name: "Azul suave",
    apply(bgEl) {
      bgEl.className = "tract-bg tpl-soft-blue";
    },
  },
  {
    id: "frame",
    name: "Moldura",
    apply(bgEl) {
      bgEl.className = "tract-bg tpl-frame";
    },
  },
];

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}
