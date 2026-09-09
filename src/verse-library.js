import { VERSES, listThemes } from "./data/verses.js";
import { searchVerses } from "./selection.js";

export function verseSourceUrl(verse) {
  const slug = verse.id.match(/^([1-3]?[a-z]+)/)[1];
  const passage = verse.ref.match(/(\d+):(\d+(?:-\d+)?)$/);
  return `https://www.biblias.com.br/acfonline#${slug}${passage[1]}ver${passage[2]}`;
}

// O painel usa a mesma seleção do editor; a consulta não depende de rede.
export function initVerseLibrary({ getPicked, toggleVerse, usePicked }) {
  const dialog = document.querySelector("#verseLibrary");
  const search = dialog.querySelector("#librarySearch");
  const book = dialog.querySelector("#libraryBook");
  const theme = dialog.querySelector("#libraryTheme");
  const sort = dialog.querySelector("#librarySort");
  const selectedOnly = dialog.querySelector("#librarySelectedOnly");
  const grid = dialog.querySelector("#libraryCards");
  const summary = dialog.querySelector("#librarySummary");
  const useButton = dialog.querySelector("#libraryUse");
  const bookOf = (verse) => verse.ref.replace(/\s+\d+:.*$/, "");
  const books = [...new Set(VERSES.map(bookOf))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  for (const [select, values] of [[book, books], [theme, listThemes()]]) {
    for (const value of values) select.add(new Option(value, value));
  }

  function render({ focusId = null } = {}) {
    const picked = new Set(getPicked().map((verse) => verse.id));
    const matches = search.value.trim() ? searchVerses(search.value) : VERSES;
    const results = matches.filter((verse) =>
      (!book.value || bookOf(verse) === book.value) &&
      (!theme.value || verse.themes.includes(theme.value)) &&
      (!selectedOnly.checked || picked.has(verse.id))
    );
    // Ordena só a lista de consulta; a sequência dos escolhidos não muda.
    if (sort.value === "longest") results.sort((a, b) => b.text.length - a.text.length);
    if (sort.value === "shortest") results.sort((a, b) => a.text.length - b.text.length);
    summary.textContent = `${results.length} de ${VERSES.length} trechos · ${picked.size} escolhidos`;
    useButton.textContent = `Usar ${picked.size} ${picked.size === 1 ? "escolhido" : "escolhidos"} na folha`;
    useButton.disabled = picked.size === 0;
    const scrollTop = grid.scrollTop;
    const fragment = document.createDocumentFragment();
    for (const verse of results) {
      const card = document.createElement("article");
      card.className = "library-card";
      const heading = document.createElement("h3");
      heading.textContent = verse.ref;
      const text = document.createElement("p");
      text.className = "library-verse-text";
      text.textContent = verse.text;
      const tags = document.createElement("p");
      tags.className = "library-tags";
      tags.textContent = `${verse.text.length} caracteres · ${verse.themes.join(" · ")}`;
      card.append(heading, text, tags);
      if (verse.context) {
        const context = document.createElement("p");
        context.className = "library-context";
        context.textContent = `Para ler no contexto: ${verse.context}`;
        card.append(context);
      }
      const actions = document.createElement("div");
      actions.className = "library-card-actions";
      const select = document.createElement("button");
      select.type = "button";
      select.dataset.verseId = verse.id;
      select.setAttribute("aria-pressed", String(picked.has(verse.id)));
      select.setAttribute("aria-label", `${picked.has(verse.id) ? "Remover" : "Escolher"} ${verse.ref}`);
      select.textContent = picked.has(verse.id) ? "✓ Escolhido · remover" : "+ Escolher";
      select.addEventListener("click", () => {
        toggleVerse(verse);
        render({ focusId: verse.id });
      });
      const source = document.createElement("a");
      source.href = verseSourceUrl(verse);
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = "Ler na ACF ↗";
      source.setAttribute("aria-label", `Ler ${verse.ref} na ACF oficial (nova aba)`);
      actions.append(select, source);
      card.append(actions);
      fragment.append(card);
    }
    if (!results.length) {
      const empty = document.createElement("p");
      empty.className = "library-empty";
      empty.textContent = "Nenhum trecho com estes filtros. Limpe os filtros para ver todos.";
      fragment.append(empty);
    }
    grid.replaceChildren(fragment);
    grid.scrollTop = focusId ? scrollTop : 0;
    if (focusId) {
      const button = [...grid.querySelectorAll("button")].find((item) => item.dataset.verseId === focusId);
      (button || selectedOnly).focus({ preventScroll: true });
    }
  }

  document.querySelector("#openVerseLibrary").addEventListener("click", () => {
    render();
    dialog.showModal();
    search.focus();
  });
  dialog.querySelector("#libraryClose").addEventListener("click", () => dialog.close());
  search.addEventListener("input", () => render());
  for (const control of [book, theme, sort, selectedOnly]) control.addEventListener("change", () => render());
  dialog.querySelector("#libraryReset").addEventListener("click", () => {
    search.value = book.value = theme.value = "";
    selectedOnly.checked = false;
    sort.value = "default";
    render();
    search.focus();
  });
  useButton.addEventListener("click", () => {
    usePicked();
    dialog.close();
  });
}
