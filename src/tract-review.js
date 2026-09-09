import { MANUAL_FONT } from "./layout.js";

// A amostra é uma cópia visual. Medições e alterações usam sempre o papelzinho da folha.
export function initTractReview({ getTracts, isPending, onFontChange }) {
  const $ = (selector) => document.querySelector(selector);
  const dialog = $("#tractReview");
  const pick = $("#reviewPick");
  const onlyAttention = $("#reviewOnlyAttention");
  const sample = $("#reviewSample");
  const input = $("#reviewFont");
  const less = $("#reviewFontLess");
  const more = $("#reviewFontMore");
  const reset = $("#reviewFontReset");
  const message = $("#reviewMessage");
  const session = new Set();
  let selectedIndex = null;
  const indexOf = (tract) => Number(tract.dataset.tractIndex);
  const needsAttention = (tract) => tract.classList.contains("is-overflowing") || tract.classList.contains("has-small-font");
  const current = () => getTracts().find((tract) => indexOf(tract) === selectedIndex);

  function update() {
    if (!dialog.open) return;
    const tracts = getTracts();
    tracts.filter(needsAttention).forEach((tract) => session.add(indexOf(tract)));
    const choices = onlyAttention.checked ? tracts.filter((tract) => session.has(indexOf(tract))) : tracts;
    if (!choices.some((tract) => indexOf(tract) === selectedIndex)) selectedIndex = choices.length ? indexOf(choices[0]) : null;
    pick.replaceChildren();
    for (const tract of choices) {
      const page = tract.closest(".a4-page").dataset.page;
      const label = tract.classList.contains("is-overflowing") ? "cortado"
        : tract.classList.contains("has-small-font") ? "fonte pequena" : "cabe";
      pick.add(new Option(`Folha ${page} · nº ${indexOf(tract) + 1} · ${tract.dataset.verseRef} · ${label}`, String(indexOf(tract))));
    }
    pick.value = selectedIndex === null ? "" : String(selectedIndex);
    const tract = current();
    const pending = isPending();
    const fontPt = tract ? parseFloat(tract.querySelector(".tract-text").style.fontSize) : null;
    tracts.forEach((item) => item.classList.toggle("is-reviewing", item === tract));
    sample.replaceChildren();
    if (tract) {
      const clone = tract.cloneNode(true);
      clone.classList.remove("is-reviewing", "is-overflowing", "has-small-font");
      clone.removeAttribute("data-tract-index");
      sample.append(clone);
    }
    input.value = Number.isFinite(fontPt) ? String(Math.round(fontPt * 100) / 100) : "";
    input.disabled = less.disabled = more.disabled = reset.disabled = !tract || pending;
    if (!pending && tract) {
      less.disabled = fontPt <= MANUAL_FONT.minPt;
      more.disabled = fontPt >= MANUAL_FONT.maxPt;
      reset.disabled = tract.dataset.manualFont !== "true";
    }
    pick.disabled = choices.length === 0;
    $("#reviewNext").disabled = choices.length < 2;
    if (!tract) {
      message.textContent = "Nenhum papelzinho para revisar. Desmarque o filtro para ver todos.";
    } else if (pending) {
      message.textContent = "Aguarde a conferência da folha…";
    } else {
      const fit = tract.classList.contains("is-overflowing")
        ? "O texto ainda está cortado. Reduza a fonte; a impressão continua bloqueada."
        : "O texto cabe neste papelzinho.";
      const readability = fontPt < MANUAL_FONT.reviewBelowPt
        ? " Fonte abaixo de 7 pt: confira se a leitura fica confortável no papel." : "";
      const mode = tract.dataset.manualFont === "true" ? "Ajuste individual." : "Ajuste automático.";
      message.textContent = `${fit}${readability} ${mode}`;
    }
    message.classList.toggle("is-warning", Boolean(tract && needsAttention(tract)));
  }

  function apply(value) {
    const tract = current();
    if (!tract || isPending()) return;
    if (value !== null && !Number.isFinite(value)) { update(); return; }
    onFontChange(indexOf(tract), value);
    update();
  }

  $("#reviewTexts").addEventListener("click", () => {
    if (isPending()) return;
    session.clear();
    const tracts = getTracts();
    tracts.filter(needsAttention).forEach((tract) => session.add(indexOf(tract)));
    selectedIndex = null;
    onlyAttention.checked = session.size > 0;
    dialog.showModal();
    update();
    pick.focus();
  });
  pick.addEventListener("change", () => { selectedIndex = Number(pick.value); update(); });
  onlyAttention.addEventListener("change", update);
  less.addEventListener("click", () => apply(Number(input.value) - MANUAL_FONT.stepPt));
  more.addEventListener("click", () => apply(Number(input.value) + MANUAL_FONT.stepPt));
  input.addEventListener("change", () => apply(input.value.trim() ? Number(input.value) : NaN));
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { event.preventDefault(); apply(input.value.trim() ? Number(input.value) : NaN); }
  });
  reset.addEventListener("click", () => apply(null));
  $("#reviewNext").addEventListener("click", () => {
    pick.selectedIndex = (pick.selectedIndex + 1) % pick.options.length;
    selectedIndex = Number(pick.value);
    update();
  });
  $("#reviewClose").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => getTracts().forEach((tract) => tract.classList.remove("is-reviewing")));
  return { update, close: () => { if (dialog.open) dialog.close(); } };
}
