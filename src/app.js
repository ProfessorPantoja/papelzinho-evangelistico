// app.js — Integrador (NÃO é de nenhum agente de módulo).
// Liga os controles da UI aos três módulos via os contratos de CONTRACTS.md.
import { listThemes, VERSES } from "./data/verses.js";
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

// --- Alternar blocos por modo -------------------------------------------------
function applyModeVisibility() {
  state.mode = document.querySelector('input[name="mode"]:checked').value;
  document.querySelectorAll(".mode-block").forEach((el) => {
    const modes = el.dataset.mode.split(" ");
    el.style.display = modes.includes(state.mode) ? "" : "none";
  });
}

// --- Busca / seleção manual ---------------------------------------------------
function renderSearch() {
  const q = $("#search").value.trim();
  const box = $("#searchResults");
  box.innerHTML = "";
  if (!q) return;
  let results = [];
  try {
    results = searchVerses(q).slice(0, 12);
  } catch (e) {
    console.warn(e);
  }
  for (const v of results) {
    const div = document.createElement("div");
    div.className = "result";
    div.innerHTML = `<strong>${v.ref}</strong> <span>${v.text}</span>`;
    div.onclick = () => {
      if (!state.picked.find((p) => p.id === v.id)) state.picked.push(v);
      renderPicked();
      generate();
    };
    box.appendChild(div);
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
    x.textContent = "×";
    x.onclick = () => {
      state.picked.splice(i, 1);
      renderPicked();
      generate();
    };
    chip.appendChild(x);
    box.appendChild(chip);
  });
}

// --- Coletar versículos conforme o modo --------------------------------------

/** Repete ciclicamente a lista até fechar a última folha A4 (múltiplo de perPage). */
function cycleToFillPage(list) {
  if (!list.length) return list;
  const perPage = capacityPerPage($("#size").value);
  const target = Math.ceil(list.length / perPage) * perPage;
  const out = [];
  for (let i = 0; i < target; i++) out.push(list[i % list.length]);
  return out;
}

function collectVerses() {
  const theme = $("#theme").value || undefined;
  const count = parseInt($("#count").value, 10) || 0; // 0 = auto
  // Quando "auto" (0), preenche exatamente UMA folha A4 do tamanho escolhido.
  const wanted = count > 0 ? count : capacityPerPage($("#size").value);
  const sameVerse = $("#sameVerse").checked;
  const fillPage = $("#fillPage").checked;

  try {
    switch (state.mode) {
      case "random":
      case "generate": {
        const opts = theme ? { themes: [theme] } : {};
        if (sameVerse) {
          // Um único versículo repetido em todos os papelzinhos.
          const one = getRandomVerses(1, opts);
          return one.length ? new Array(wanted).fill(one[0]) : [];
        }
        return state.mode === "generate"
          ? generateByTheme(theme || "", wanted)
          : getRandomVerses(wanted, opts);
      }
      case "manual": {
        const picked = state.picked.slice();
        return fillPage ? cycleToFillPage(picked) : picked;
      }
      case "paste": {
        const pasted = parsePastedText($("#pasteText").value);
        return fillPage ? cycleToFillPage(pasted) : pasted;
      }
      default:
        return [];
    }
  } catch (e) {
    console.error("Erro coletando versículos:", e);
    return [];
  }
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
    data = JSON.parse(localStorage.getItem(SETTINGS_KEY));
  } catch (e) {
    return;
  }
  if (!data || typeof data !== "object") return;

  const setVal = (sel, val) => {
    const el = $(sel);
    if (val !== undefined && val !== null && el) el.value = val;
  };
  if (data.mode) {
    const radio = document.querySelector(`input[name="mode"][value="${data.mode}"]`);
    if (radio) radio.checked = true;
  }
  setVal("#theme", data.theme);
  setVal("#count", data.count);
  if (typeof data.sameVerse === "boolean") $("#sameVerse").checked = data.sameVerse;
  if (typeof data.fillPage === "boolean") $("#fillPage").checked = data.fillPage;
  // selects só aceitam valores que existem nas opções; inválidos caem no atual.
  if (data.size && TRACT_SIZES.some((s) => s.id === data.size)) setVal("#size", data.size);
  setVal("#fontScale", data.fontScale);
  $("#fontScaleVal").textContent = Math.round(($("#fontScale").value || 1) * 100) + "%";
  if (data.template && TEMPLATES.some((t) => t.id === data.template)) setVal("#template", data.template);
  setVal("#overlay", data.overlay);
  $("#overlayVal").textContent = Math.round(($("#overlay").value || 0) * 100) + "%";
  setVal("#footerText", data.footer);
  setVal("#pasteText", data.pasteText);
  if (Array.isArray(data.pickedIds)) {
    state.picked = data.pickedIds
      .map((id) => VERSES.find((v) => v.id === id))
      .filter(Boolean);
  }
}

// --- Zoom do preview ----------------------------------------------------------
function applyZoom(z) {
  state.zoom = Math.min(3, Math.max(0.2, z));
  // `zoom` (e não transform) para o scroll acompanhar o tamanho renderizado.
  sheetContainer.style.zoom = state.zoom;
  $("#zoomVal").textContent = Math.round(state.zoom * 100) + "%";
}

function zoomToFit() {
  const scroll = $("#previewScroll");
  if (!scroll) return;
  const available = scroll.clientWidth - 48; // desconta o padding do preview
  applyZoom(available / A4_WIDTH_PX);
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
    `${versesCount} ${plural(versesCount, "papelzinho", "papelzinhos")} · ` +
    `${size ? `${size.wMm}×${size.hMm} mm` : ""} · ` +
    `${perPage} por folha · ${pages} ${plural(pages, "folha A4", "folhas A4")}`;
}

// --- Render principal ---------------------------------------------------------
function generate() {
  const verses = collectVerses();
  updateSheetInfo(verses.length);
  if (!verses.length) {
    sheetContainer.innerHTML =
      '<div class="empty">Nenhum versículo selecionado. Escolha uma opção e clique em "Gerar".</div>';
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
  const footer = $("#footerText").value.trim();
  try {
    renderSheet(sheetContainer, { verses, sizeId, template, fontScale, footer });
  } catch (e) {
    console.error("Erro no layout:", e);
    sheetContainer.innerHTML = `<div class="empty">Erro ao renderizar a folha: ${e.message}</div>`;
  }
  saveSettings();
}

// --- Eventos ------------------------------------------------------------------
function init() {
  fillThemes();
  fillSizes();
  fillTemplates();
  restoreSettings(); // aplica preferências salvas antes de ligar os eventos
  applyModeVisibility();
  renderPicked();

  document.querySelectorAll('input[name="mode"]').forEach((r) =>
    r.addEventListener("change", () => {
      applyModeVisibility();
      generate();
    })
  );
  $("#search").addEventListener("input", renderSearch);
  $("#fontScale").addEventListener("input", (e) => {
    $("#fontScaleVal").textContent = Math.round(e.target.value * 100) + "%";
    generate();
  });
  // Mudar tamanho, tema ou quantidade reflete na hora no preview.
  $("#size").addEventListener("change", generate);
  $("#theme").addEventListener("change", generate);
  $("#count").addEventListener("input", debounce(generate, 300));
  // Colar/editar texto atualiza o preview ao vivo (com debounce).
  $("#pasteText").addEventListener("input", debounce(generate, 400));
  $("#sameVerse").addEventListener("change", generate);
  $("#fillPage").addEventListener("change", generate);
  $("#footerText").addEventListener("input", debounce(generate, 400));

  // --- Imagem de fundo própria ---
  $("#bgImage").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.customImage = reader.result;
      ensureCustomOption();
      $("#template").value = "custom";
      $("#bgImageClear").style.display = "";
      $("#overlayField").style.display = "";
      generate();
    };
    reader.readAsDataURL(file);
  });
  $("#bgImageClear").addEventListener("click", () => {
    state.customImage = null;
    $("#bgImage").value = "";
    removeCustomOption();
    $("#template").value = DEFAULT_TEMPLATE_ID;
    $("#bgImageClear").style.display = "none";
    $("#overlayField").style.display = "none";
    generate();
  });
  $("#overlay").addEventListener("input", (e) => {
    $("#overlayVal").textContent = Math.round(e.target.value * 100) + "%";
    generate();
  });
  $("#template").addEventListener("change", () => {
    $("#overlayField").style.display =
      $("#template").value === "custom" && state.customImage ? "" : "none";
    generate();
  });

  $("#btnGenerate").addEventListener("click", generate);
  $("#btnPrint").addEventListener("click", () => window.print());

  // --- Zoom do preview ---
  $("#zoomIn").addEventListener("click", () => applyZoom(state.zoom + 0.1));
  $("#zoomOut").addEventListener("click", () => applyZoom(state.zoom - 0.1));
  $("#zoomFit").addEventListener("click", zoomToFit);

  generate();
  zoomToFit();
}

document.addEventListener("DOMContentLoaded", init);
