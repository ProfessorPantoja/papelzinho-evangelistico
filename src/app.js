// app.js — Integrador (NÃO é de nenhum agente de módulo).
// Liga os controles da UI aos três módulos via os contratos de CONTRACTS.md.
import { listThemes, VERSES } from "./data/verses.js";
import { arrangeVerses } from "./pagination.js";
import { sanitizeSettings } from "./settings.js";
import {
  getRandomVerses,
  searchVerses,
  parsePastedText,
  generateByTheme,
} from "./selection.js";
import {
  TRACT_SIZES,
  DEFAULT_SIZE_ID,
  renderSheet,
  capacityPerPage,
} from "./layout.js";
import {
  TEMPLATES,
  DEFAULT_TEMPLATE_ID,
  getTemplate,
  makeImageTemplate,
} from "./templates/index.js";
import {
  composeFooter,
  clampCount,
  getPageCount,
  getPrintReadiness,
  measurementsOverflow,
  validateImageDimensions,
  validateImageFile,
} from "./quality.js";

const $ = (sel) => document.querySelector(sel);
const sheetContainer = $("#sheetContainer");

/** Debounce simples para entradas de texto (evita re-render a cada tecla). */
function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

const state = {
  mode: "random",
  picked: [], // Verse[] no modo manual
  customImage: null, // data URL da imagem de fundo enviada pelo usuário
  zoom: 1, // fator de zoom do preview (1 = 100%)
  fitZoom: true,
  currentVerses: [], // Mantém a seleção estável durante ajustes visuais.
  appliedSelection: { verses: [], autoFill: false, fillPage: false },
  selectionDirty: false,
  overflowCount: 0,
  layoutPending: false,
  layoutVersion: 0,
  imagePending: false,
  imageLoadToken: 0,
};

// Largura de uma folha A4 em px CSS (210mm a 96dpi ≈ 793.7px).
const A4_WIDTH_PX = 794;

// --- Popular selects ----------------------------------------------------------
function fillThemes() {
  const sel = $("#theme");
  try {
    for (const t of listThemes()) {
      const o = document.createElement("option");
      o.value = t;
      o.textContent = t;
      sel.appendChild(o);
    }
  } catch (e) {
    console.warn("listThemes indisponível:", e);
  }
}

function fillSizes() {
  const sel = $("#size");
  for (const s of TRACT_SIZES) {
    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = `${s.label} (${s.wMm}×${s.hMm} mm)`;
    sel.appendChild(o);
  }
  sel.value = DEFAULT_SIZE_ID;
}

function fillTemplates() {
  const sel = $("#template");
  for (const t of TEMPLATES) {
    const o = document.createElement("option");
    o.value = t.id;
    o.textContent = t.name;
    sel.appendChild(o);
  }
  sel.value = DEFAULT_TEMPLATE_ID;
}

function resolveActiveTemplate() {
  if ($("#template").value === "custom" && state.customImage) {
    return makeImageTemplate(state.customImage, {
      overlay: parseFloat($("#overlay").value) || 0,
    });
  }
  return getTemplate($("#template").value);
}

function renderTemplateThumbnail(container, template) {
  container.innerHTML = "";
  const background = document.createElement("span");
  try {
    template.apply(background, { sizeId: "card" });
  } catch (error) {
    console.warn("Miniatura de template indisponível:", error);
    background.className = "tract-bg tpl-plain";
  }

  const sample = document.createElement("span");
  sample.className = "template-mini-content";
  const text = document.createElement("span");
  text.textContent = "Amor que alcança";
  const ref = document.createElement("small");
  ref.textContent = "João 3:16";
  sample.append(text, ref);
  container.append(background, sample);
}

function syncTemplateChooser() {
  const active = resolveActiveTemplate();
  $("#selectedTemplateName").textContent = active.name;
  $("#galleryTemplateName").textContent = active.name;
  $("#templateChooserButton").setAttribute(
    "aria-label",
    `Escolher arte de fundo. Selecionada: ${active.name}`
  );
  renderTemplateThumbnail($("#selectedTemplatePreview"), active);

  document.querySelectorAll(".template-option").forEach((button) => {
    const selected = button.dataset.templateId === $("#template").value;
    button.setAttribute("aria-checked", selected ? "true" : "false");
    button.tabIndex = selected ? 0 : -1;
  });
}

function applyTemplateChoice(templateId, { close = false } = {}) {
  const select = $("#template");
  if (!TEMPLATES.some((template) => template.id === templateId)) return;
  select.value = templateId;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  if (close) $("#templateDialog").close();
}

function initTemplateChooser() {
  const field = $("#templateField");
  const gallery = $("#templateGallery");
  const trigger = $("#templateChooserButton");
  const dialog = $("#templateDialog");
  const fragment = document.createDocumentFragment();

  try {
    for (const template of TEMPLATES) {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "template-option";
      option.dataset.templateId = template.id;
      option.setAttribute("role", "radio");
      option.setAttribute("aria-label", template.name);

      const thumb = document.createElement("span");
      thumb.className = "template-thumb";
      thumb.setAttribute("aria-hidden", "true");
      renderTemplateThumbnail(thumb, template);

      const label = document.createElement("span");
      label.className = "template-option-label";
      label.textContent = template.name;
      option.append(thumb, label);
      option.addEventListener("click", () =>
        applyTemplateChoice(template.id, { close: true })
      );
      fragment.appendChild(option);
    }
  } catch (error) {
    console.warn("Galeria de templates indisponível; usando o seletor padrão.", error);
    return;
  }

  gallery.appendChild(fragment);
  gallery.addEventListener("keydown", (event) => {
    const current = event.target.closest(".template-option");
    if (!current) return;
    const buttons = [...gallery.querySelectorAll(".template-option")];
    const index = buttons.indexOf(current);
    let nextIndex;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % buttons.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (index - 1 + buttons.length) % buttons.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = buttons.length - 1;
    else return;

    event.preventDefault();
    const next = buttons[nextIndex];
    next.focus();
    applyTemplateChoice(next.dataset.templateId);
  });

  trigger.addEventListener("click", () => {
    syncTemplateChooser();
    dialog.showModal();
    requestAnimationFrame(() => {
      const selected = gallery.querySelector('[aria-checked="true"]');
      (selected || gallery.querySelector(".template-option"))?.focus();
    });
  });

  $("#template").tabIndex = -1;
  $("#template").setAttribute("aria-hidden", "true");
  field.classList.add("is-enhanced");
  trigger.hidden = false;
  syncTemplateChooser();
}

// Garante que exista a opção "Imagem própria" no select de templates.
function ensureCustomOption() {
  const sel = $("#template");
  if (!sel.querySelector('option[value="custom"]')) {
    const o = document.createElement("option");
    o.value = "custom";
    o.textContent = "Imagem própria";
    sel.appendChild(o);
  }
}

function removeCustomOption() {
  const o = $("#template").querySelector('option[value="custom"]');
  if (o) o.remove();
}

function setImageError(message = "") {
  const input = $("#bgImage");
  const error = $("#bgImageError");
  error.textContent = message;
  error.hidden = !message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function setImagePending(pending) {
  state.imagePending = pending;
  $("#bgImage").setAttribute("aria-busy", String(pending));
  syncPrintAvailability();
  updatePreviewStatus();
}

function readImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const dimensions = { width: image.naturalWidth, height: image.naturalHeight };
      URL.revokeObjectURL(url);
      resolve(dimensions);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("A imagem está corrompida ou usa um formato incompatível."));
    };
    image.src = url;
  });
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem escolhida."));
    reader.readAsDataURL(file);
  });
}

async function applyBackgroundImage(file) {
  const input = $("#bgImage");
  const token = ++state.imageLoadToken;
  setImageError("");

  const metadataError = validateImageFile(file);
  if (metadataError) {
    setImagePending(false);
    input.value = "";
    setImageError(metadataError);
    return;
  }

  setImagePending(true);
  try {
    const dimensions = await readImageDimensions(file);
    if (token !== state.imageLoadToken) return;
    const dimensionError = validateImageDimensions(dimensions.width, dimensions.height);
    if (dimensionError) throw new Error(dimensionError);
    const dataUrl = await readAsDataUrl(file);
    if (token !== state.imageLoadToken) return;

    state.customImage = dataUrl;
    ensureCustomOption();
    $("#template").value = "custom";
    $("#bgImageClear").hidden = false;
    $("#overlayField").hidden = false;
    syncTemplateChooser();
    renderCurrentSelection();
  } catch (error) {
    if (token !== state.imageLoadToken) return;
    input.value = "";
    setImageError(error.message || "Não foi possível usar esta imagem.");
  } finally {
    if (token === state.imageLoadToken) setImagePending(false);
  }
}

// --- Alternar blocos por modo -------------------------------------------------
function applyModeVisibility() {
  const checked = document.querySelector('input[name="mode"]:checked');
  state.mode = checked ? checked.value : "random";
  document.querySelectorAll(".mode-block").forEach((el) => {
    const modes = el.dataset.mode.split(" ");
    el.hidden = !modes.includes(state.mode);
  });
  updateGenerateLabel();
}

// --- Busca / seleção manual ---------------------------------------------------
function renderSearch() {
  const q = $("#search").value.trim();
  const box = $("#searchResults");
  box.innerHTML = "";
  $("#search").setAttribute("aria-expanded", q ? "true" : "false");
  if (!q) return;
  let results = [];
  try {
    results = searchVerses(q).slice(0, 12);
  } catch (e) {
    console.warn(e);
  }
  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "search-empty";
    empty.textContent = "Nenhum versículo encontrado.";
    box.appendChild(empty);
  }
  for (const v of results) {
    const result = document.createElement("button");
    result.type = "button";
    result.className = "result";
    result.setAttribute("aria-label", `Adicionar ${v.ref}`);
    const ref = document.createElement("strong");
    ref.textContent = v.ref;
    const text = document.createElement("span");
    text.textContent = v.text;
    result.append(ref, text);
    result.addEventListener("click", () => {
      if (!state.picked.find((p) => p.id === v.id)) state.picked.push(v);
      renderPicked();
      refreshSelection();
    });
    box.appendChild(result);
  }
}

function renderPicked() {
  const box = $("#picked");
  box.innerHTML = "";
  state.picked.forEach((v, i) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = v.ref;
    const x = document.createElement("button");
    x.type = "button";
    x.textContent = "×";
    x.setAttribute("aria-label", `Remover ${v.ref}`);
    x.onclick = () => {
      state.picked.splice(i, 1);
      renderPicked();
      refreshSelection();
    };
    chip.appendChild(x);
    box.appendChild(chip);
  });
}

// --- Coletar versículos conforme o modo --------------------------------------

function collectVerses() {
  const theme = $("#theme").value || undefined;
  const count = clampCount($("#count").value); // 0 = auto
  // Reserva uma seleção estável para qualquer tamanho no modo automático.
  // Só a capacidade do tamanho atual será exibida; mudar o tamanho não ressorteia.
  const wanted = count > 0 ? count : Math.max(...TRACT_SIZES.map((size) => capacityPerPage(size.id)));
  const sameVerse = $("#sameVerse").checked;

  try {
    switch (state.mode) {
      case "random":
      case "generate": {
        const opts = theme ? { themes: [theme] } : {};
        if (sameVerse) {
          // Um único versículo repetido em todos os papeizinhos.
          const one = getRandomVerses(1, opts);
          return one.length ? new Array(wanted).fill(one[0]) : [];
        }
        return state.mode === "generate"
          ? generateByTheme(theme || "", wanted)
          : getRandomVerses(wanted, opts);
      }
      case "manual": {
        return state.picked.slice();
      }
      case "paste": {
        return parsePastedText($("#pasteText").value);
      }
      default:
        return [];
    }
  } catch (e) {
    console.error("Erro coletando versículos:", e);
    return [];
  }
}

function normalizeCountInput() {
  const input = $("#count");
  input.value = String(clampCount(input.value));
}

// --- Persistência das preferências (localStorage) ------------------------------
const SETTINGS_KEY = "papelzinho:settings:v1";

function saveSettings() {
  try {
    const data = {
      mode: state.mode,
      theme: $("#theme").value,
      count: $("#count").value,
      sameVerse: $("#sameVerse").checked,
      fillPage: $("#fillPage").checked,
      size: $("#size").value,
      fontScale: $("#fontScale").value,
      // imagem própria não é persistida (data URL pode estourar a cota);
      // se o template ativo é "custom", guarda o padrão no lugar.
      template: $("#template").value === "custom" ? DEFAULT_TEMPLATE_ID : $("#template").value,
      overlay: $("#overlay").value,
      defaultFooter: $("#defaultFooter").checked,
      footer: $("#footerText").value,
      pasteText: $("#pasteText").value,
      pickedIds: state.picked.map((v) => v.id),
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
  } catch (e) {
    // localStorage indisponível (modo privado etc.) não deve quebrar o app.
  }
}

function restoreSettings() {
  let data;
  try {
    data = sanitizeSettings(JSON.parse(localStorage.getItem(SETTINGS_KEY)), {
      themes: listThemes(),
      sizes: TRACT_SIZES.map((size) => size.id),
      templates: TEMPLATES.map((template) => template.id),
      verseIds: VERSES.map((verse) => verse.id),
    });
  } catch (e) {
    return;
  }
  const setVal = (sel, val) => {
    const el = $(sel);
    if (val !== undefined && val !== null && el) el.value = val;
  };
  if (data.mode) {
    const radio = [...document.querySelectorAll('input[name="mode"]')]
      .find((input) => input.value === data.mode);
    if (radio) radio.checked = true;
  }
  setVal("#theme", data.theme);
  setVal("#count", data.count);
  if (typeof data.sameVerse === "boolean") $("#sameVerse").checked = data.sameVerse;
  if (typeof data.fillPage === "boolean") $("#fillPage").checked = data.fillPage;
  setVal("#size", data.size);
  setVal("#fontScale", data.fontScale);
  $("#fontScaleVal").textContent = Math.round(($("#fontScale").value || 1) * 100) + "%";
  setVal("#template", data.template);
  setVal("#overlay", data.overlay);
  $("#overlayVal").textContent = Math.round(($("#overlay").value || 0) * 100) + "%";
  if (typeof data.defaultFooter === "boolean") {
    $("#defaultFooter").checked = data.defaultFooter;
  }
  setVal("#footerText", data.footer);
  setVal("#pasteText", data.pasteText);
  if (Array.isArray(data.pickedIds)) {
    state.picked = data.pickedIds
      .map((id) => VERSES.find((v) => v.id === id))
      .filter(Boolean);
  }
  normalizeCountInput();
}

// --- Zoom do preview ----------------------------------------------------------
function applyZoom(z, { fit = false } = {}) {
  state.zoom = Math.min(3, Math.max(0.2, z));
  state.fitZoom = fit;
  // `zoom` (e não transform) para o scroll acompanhar o tamanho renderizado.
  sheetContainer.style.zoom = state.zoom;
  $("#zoomVal").textContent = Math.round(state.zoom * 100) + "%";
}

function zoomToFit() {
  const scroll = $("#previewScroll");
  if (!scroll) return;
  const styles = getComputedStyle(scroll);
  const available =
    scroll.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
  applyZoom(Math.max(0.2, available / A4_WIDTH_PX), { fit: true });
}

// --- Barra de informações da folha ---------------------------------------------
function updateSheetInfo(versesCount) {
  const info = $("#sheetInfo");
  if (!info) return;
  const sizeId = $("#size").value;
  const size = TRACT_SIZES.find((s) => s.id === sizeId);
  const perPage = capacityPerPage(sizeId);
  if (!versesCount) {
    info.textContent = "";
    return;
  }
  const pages = Math.max(1, Math.ceil(versesCount / perPage));
  const plural = (n, s, p) => (n === 1 ? s : p);
  info.textContent =
    `${versesCount} ${plural(versesCount, "papelzinho", "papeizinhos")} · ` +
    `${size ? `${size.wMm}×${size.hMm} mm` : ""} · ` +
    `${perPage} por folha · ${pages} ${plural(pages, "folha A4", "folhas A4")}`;
}

// --- Render principal ---------------------------------------------------------
function updateGenerateLabel() {
  const label = $("#btnGenerate span");
  if (!label) return;
  if (state.selectionDirty) {
    label.textContent = "Aplicar alterações";
    return;
  }
  const labels = {
    random: "Sortear novos",
    generate: "Gerar por tema",
    manual: "Atualizar escolhidos",
    paste: "Aplicar texto",
  };
  label.textContent = labels[state.mode] || "Atualizar seleção";
}

function markSelectionDirty() {
  state.selectionDirty = true;
  updateGenerateLabel();
  syncPrintAvailability();
  setPreviewStatus(
    "Há alterações de seleção pendentes. Clique em \"Aplicar alterações\" antes de imprimir.",
    "pending"
  );
  saveSettings();
}

function refreshSelection() {
  const randomMode = ["random", "generate"].includes(state.mode);
  state.appliedSelection = {
    verses: collectVerses(),
    autoFill: randomMode && clampCount($("#count").value) === 0,
    fillPage: !randomMode && $("#fillPage").checked,
  };
  state.selectionDirty = false;
  updateGenerateLabel();
  renderCurrentSelection();
}

function setPreviewStatus(message = "", tone = "ready") {
  const status = $("#previewStatus");
  if (!status) return;
  status.textContent = message;
  status.className = `preview-status is-${tone}`;
  status.hidden = !message;
}

function syncPrintAvailability() {
  const button = $("#btnPrint");
  const readiness = getPrintReadiness({
    hasItems: state.currentVerses.length > 0,
    selectionDirty: state.selectionDirty,
    layoutPending: state.layoutPending,
    imagePending: state.imagePending,
    overflowCount: state.overflowCount,
  });
  button.disabled = !readiness.ready;
  button.setAttribute("aria-busy", String(state.layoutPending || state.imagePending));
  button.dataset.disabledReason = readiness.reason;
  document.documentElement.dataset.printReadiness = readiness.reason;
  return readiness;
}

function setPrintPending(pending) {
  state.layoutPending = pending;
  syncPrintAvailability();
}

function measureLayoutStatus() {
  let overflowCount = 0;
  document.querySelectorAll(".tract").forEach((tract) => {
    const content = tract.querySelector(".tract-content");
    const overflows = Boolean(content && measurementsOverflow(content));
    tract.classList.toggle("is-overflowing", overflows);
    if (overflows) overflowCount++;
  });

  state.overflowCount = overflowCount;
  sheetContainer.dataset.overflowCount = String(overflowCount);
  document.documentElement.dataset.layoutStatus = overflowCount ? "overflow" : "ready";
  setPrintPending(false);
  updatePreviewStatus();
  return overflowCount;
}

function updatePreviewStatus() {
  const { overflowCount } = state;
  if (state.imagePending) {
    setPreviewStatus("Carregando a imagem de fundo. Aguarde antes de imprimir…", "checking");
  } else if (state.layoutPending) {
    setPreviewStatus("Conferindo a diagramação…", "checking");
  } else if (overflowCount) {
    const plural = overflowCount === 1 ? "papelzinho está" : "papeizinhos estão";
    setPreviewStatus(
      `${overflowCount} ${plural} com texto cortado. Reduza a fonte, use um tamanho maior ou encurte o rodapé. A impressão foi bloqueada.`,
      "warning"
    );
  } else if (state.selectionDirty) {
    setPreviewStatus(
      "Há alterações de seleção pendentes. Clique em \"Aplicar alterações\" antes de imprimir.",
      "pending"
    );
  } else if (state.currentVerses.length) {
    setPreviewStatus("Prévia conferida e pronta para imprimir.", "ready");
  } else {
    setPreviewStatus("Adicione ao menos um versículo para montar a folha.", "checking");
  }
}

function scheduleLayoutPreflight() {
  const version = state.layoutVersion;
  setPrintPending(true);
  updatePreviewStatus();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (version === state.layoutVersion) measureLayoutStatus();
  }));
}

function renderCurrentSelection() {
  state.layoutVersion++;
  state.currentVerses = arrangeVerses(state.appliedSelection.verses, {
    ...state.appliedSelection,
    perPage: capacityPerPage($("#size").value),
  });
  const verses = state.currentVerses;
  updateSheetInfo(verses.length);
  if (!verses.length) {
    sheetContainer.innerHTML =
      '<div class="empty">Nenhum versículo selecionado. Escolha uma opção e clique em "Gerar".</div>';
    state.overflowCount = 0;
    setPrintPending(false);
    setPreviewStatus("Adicione ao menos um versículo para montar a folha.", "checking");
    saveSettings();
    return;
  }
  const sizeId = $("#size").value;
  const fontScale = parseFloat($("#fontScale").value) || 1;
  // Se o usuário enviou uma imagem e o template "custom" está escolhido,
  // monta o template de imagem com o clareador; senão usa um template normal.
  let template;
  if ($("#template").value === "custom" && state.customImage) {
    const overlay = parseFloat($("#overlay").value) || 0;
    template = makeImageTemplate(state.customImage, { overlay });
  } else {
    template = getTemplate($("#template").value);
  }
  const footer = composeFooter(
    $("#defaultFooter").checked,
    $("#footerText").value
  );
  try {
    renderSheet(sheetContainer, { verses, sizeId, template, fontScale, footer });
    scheduleLayoutPreflight();
  } catch (e) {
    console.error("Erro no layout:", e);
    sheetContainer.innerHTML = `<div class="empty">Erro ao renderizar a folha: ${e.message}</div>`;
    state.overflowCount = 1;
    sheetContainer.dataset.overflowCount = "1";
    document.documentElement.dataset.layoutStatus = "error";
    setPrintPending(false);
    setPreviewStatus("Não foi possível conferir a folha. A impressão foi bloqueada.", "warning");
  }
  saveSettings();
}

async function printWithPreflight() {
  const readiness = syncPrintAvailability();
  if (!readiness.ready) {
    $("#previewStatus").focus({ preventScroll: false });
    return;
  }

  const version = state.layoutVersion;
  setPrintPending(true);
  setPreviewStatus("Fazendo a conferência final para impressão…", "checking");

  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );
    if (version !== state.layoutVersion) return;
    measureLayoutStatus();
    if (!syncPrintAvailability().ready) {
      $("#previewStatus").focus({ preventScroll: false });
      return;
    }
    openPrintDialog();
  } finally {
    if (version === state.layoutVersion) setPrintPending(false);
  }
}

function openPrintDialog() {
  const perPage = capacityPerPage($("#size").value);
  const pages = getPageCount(state.currentVerses.length, perPage);
  const plural = pages === 1 ? "folha A4" : "folhas A4";
  $("#printDialogSummary").textContent =
    `${state.currentVerses.length} papeizinhos em ${pages} ${plural}.`;
  const dialog = $("#printDialog");
  dialog.dataset.pages = String(pages);
  document.dispatchEvent(
    new CustomEvent("papelzinho:print-preflight", {
      detail: { pages, items: state.currentVerses.length, paper: "A4", scale: 100 },
    })
  );
  dialog.showModal();
}

async function confirmPrint() {
  const dialog = $("#printDialog");
  const button = $("#confirmPrint");
  const version = state.layoutVersion;
  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );
    if (!dialog.open) return;
    if (version === state.layoutVersion) measureLayoutStatus();
    if (version !== state.layoutVersion || !syncPrintAvailability().ready) {
      dialog.close();
      $("#previewStatus").focus({ preventScroll: false });
      return;
    }
    dialog.close();
    window.print();
  } finally {
    button.disabled = false;
    button.setAttribute("aria-busy", "false");
    syncPrintAvailability();
  }
}

// --- Eventos ------------------------------------------------------------------
function init() {
  fillThemes();
  fillSizes();
  fillTemplates();
  restoreSettings(); // aplica preferências salvas antes de ligar os eventos
  applyModeVisibility();
  renderPicked();
  initTemplateChooser();

  document.querySelectorAll('input[name="mode"]').forEach((r) =>
    r.addEventListener("change", () => {
      applyModeVisibility();
      refreshSelection();
    })
  );
  $("#search").addEventListener("input", renderSearch);
  $("#fontScale").addEventListener("input", (e) => {
    $("#fontScaleVal").textContent = Math.round(e.target.value * 100) + "%";
    renderCurrentSelection();
  });
  // Ajustes visuais redesenham a mesma seleção; não sorteiam outros textos.
  $("#size").addEventListener("change", renderCurrentSelection);
  // Tema é uma escolha explícita de conteúdo: aplica a nova seleção na hora.
  $("#theme").addEventListener("change", refreshSelection);
  $("#count").addEventListener("input", markSelectionDirty);
  $("#count").addEventListener("change", () => {
    normalizeCountInput();
    markSelectionDirty();
  });
  $("#pasteText").addEventListener("input", markSelectionDirty);
  $("#sameVerse").addEventListener("change", markSelectionDirty);
  $("#fillPage").addEventListener("change", markSelectionDirty);
  $("#defaultFooter").addEventListener("change", renderCurrentSelection);
  $("#footerText").addEventListener("input", renderCurrentSelection);

  // --- Imagem de fundo própria ---
  $("#bgImage").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    await applyBackgroundImage(file);
  });
  $("#bgImageClear").addEventListener("click", () => {
    state.imageLoadToken++;
    state.customImage = null;
    $("#bgImage").value = "";
    setImagePending(false);
    setImageError("");
    removeCustomOption();
    $("#template").value = DEFAULT_TEMPLATE_ID;
    $("#bgImageClear").hidden = true;
    $("#overlayField").hidden = true;
    syncTemplateChooser();
    renderCurrentSelection();
  });
  $("#overlay").addEventListener("input", (e) => {
    $("#overlayVal").textContent = Math.round(e.target.value * 100) + "%";
    syncTemplateChooser();
    renderCurrentSelection();
  });
  $("#template").addEventListener("change", () => {
    // A escolha mais recente prevalece sobre um upload ainda em andamento.
    if (state.imagePending) {
      state.imageLoadToken++;
      $("#bgImage").value = "";
      setImagePending(false);
    }
    $("#overlayField").hidden = !(
      $("#template").value === "custom" && state.customImage
    );
    syncTemplateChooser();
    renderCurrentSelection();
  });

  $("#btnGenerate").addEventListener("click", refreshSelection);
  $("#btnPrint").addEventListener("click", printWithPreflight);
  $("#confirmPrint").addEventListener("click", confirmPrint);

  // --- Zoom do preview ---
  $("#zoomIn").addEventListener("click", () => applyZoom(state.zoom + 0.1));
  $("#zoomOut").addEventListener("click", () => applyZoom(state.zoom - 0.1));
  $("#zoomFit").addEventListener("click", zoomToFit);
  window.addEventListener(
    "resize",
    debounce(() => {
      if (state.fitZoom) zoomToFit();
    }, 120)
  );

  refreshSelection();
  requestAnimationFrame(zoomToFit);
}

document.addEventListener("DOMContentLoaded", init);
