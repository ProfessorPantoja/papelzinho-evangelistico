// Compõe as folhas sem alterar ou sortear novamente a seleção aplicada.
export function arrangeVerses(verses, { perPage, autoFill = false, fillPage = false }) {
  if (!verses.length) return [];
  const capacity = Math.max(1, Math.floor(Number(perPage) || 1));
  const total = autoFill
    ? capacity
    : fillPage
      ? Math.ceil(verses.length / capacity) * capacity
      : verses.length;
  return Array.from({ length: total }, (_, index) => verses[index % verses.length]);
}
