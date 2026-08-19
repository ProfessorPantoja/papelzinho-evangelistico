// quality.js — regras puras de validação e preflight, testáveis sem DOM.

export const IMAGE_LIMITS = Object.freeze({
  maxBytes: 10 * 1024 * 1024,
  maxDimension: 8192,
  maxPixels: 32_000_000,
});

export const DEFAULT_FOOTER_TEXT =
  "IGREJA ADMPF - Descida do Metrô Eng. da Rainha - Ou visite uma igreja próxima.";

export function composeFooter(useDefault, extraText = "") {
  const extra = String(extraText ?? "").replace(/\s+/g, " ").trim();
  if (useDefault && extra) return `${DEFAULT_FOOTER_TEXT}\n${extra}`;
  if (useDefault) return DEFAULT_FOOTER_TEXT;
  return extra;
}

export function clampCount(value, max = 120) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(max, Math.max(0, parsed));
}

export function getPageCount(totalItems, itemsPerPage) {
  const total = Math.max(0, Number(totalItems) || 0);
  const capacity = Math.max(1, Number(itemsPerPage) || 1);
  return total ? Math.ceil(total / capacity) : 0;
}

export function measurementsOverflow(
  { scrollHeight = 0, clientHeight = 0, scrollWidth = 0, clientWidth = 0 } = {},
  tolerance = 1
) {
  return (
    scrollHeight > clientHeight + tolerance ||
    scrollWidth > clientWidth + tolerance
  );
}

export function validateImageFile(file, limits = IMAGE_LIMITS) {
  if (!file) return "Escolha uma imagem para continuar.";
  if (!String(file.type || "").toLowerCase().startsWith("image/")) {
    return "O arquivo escolhido não é uma imagem válida.";
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    return "A imagem está vazia ou não pôde ser lida.";
  }
  if (file.size > limits.maxBytes) {
    return "A imagem ultrapassa o limite de 10 MB.";
  }
  return "";
}

export function validateImageDimensions(width, height, limits = IMAGE_LIMITS) {
  const w = Number(width) || 0;
  const h = Number(height) || 0;
  if (w <= 0 || h <= 0) return "Não foi possível identificar as dimensões da imagem.";
  if (w > limits.maxDimension || h > limits.maxDimension) {
    return `A imagem excede ${limits.maxDimension} px em um dos lados.`;
  }
  if (w * h > limits.maxPixels) {
    return "A imagem ultrapassa o limite de 32 megapixels.";
  }
  return "";
}

export function getPrintReadiness({
  hasItems,
  selectionDirty,
  layoutPending,
  overflowCount,
} = {}) {
  if (!hasItems) return { ready: false, reason: "empty" };
  if (selectionDirty) return { ready: false, reason: "selection-pending" };
  if (layoutPending) return { ready: false, reason: "layout-pending" };
  if (overflowCount > 0) return { ready: false, reason: "overflow" };
  return { ready: true, reason: "ready" };
}
