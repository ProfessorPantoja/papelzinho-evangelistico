// app.js — Integrador (NÃO é de nenhum agente de módulo).
// Liga os controles da UI aos três módulos via os contratos de CONTRACTS.md.
import { listThemes } from "./data/verses.js";
import {
  getRandomVerses,
  searchVerses,
  parsePastedText,
  generateByTheme,
} from "./selection.js";
import { TRACT_SIZES, DEFAULT_SIZE_ID, renderSheet } from "./layout.js";
import {
  TEMPLATES,
  DEFAULT_TEMPLATE_ID,
  getTemplate,
  makeImageTemplate,
} from "./templates/index.js";

const $ = (sel) => document.querySelector(sel);
const sheetContainer = $("#sheetContainer");

const state = {
  mode: "random",
  picked: [], // Verse[] no modo manual
  customImage: null, // data URL da imagem de fundo enviada pelo usuário
};

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
    };
    chip.appendChild(x);
    box.appendChild(chip);
  });
}

// --- Coletar versículos conforme o modo --------------------------------------
function collectVerses() {
  const theme = $("#theme").value || undefined;
  const count = parseInt($("#count").value, 10) || 0; // 0 = auto
  // Quando "auto", pedimos bastante; o layout corta o que couber na folha.
  const wanted = count > 0 ? count : 60;

  try {
    switch (state.mode) {
      case "random":
        return getRandomVerses(wanted, theme ? { themes: [theme] } : {});
      case "manual":
        return state.picked.slice();
      case "paste":
        return parsePastedText($("#pasteText").value);
      case "generate":
        return generateByTheme(theme || "", wanted);
      default:
        return [];
    }
  } catch (e) {
    console.error("Erro coletando versículos:", e);
    return [];
  }
}

// --- Render principal ---------------------------------------------------------
function generate() {
  const verses = collectVerses();
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
  try {
    renderSheet(sheetContainer, { verses, sizeId, template, fontScale });
  } catch (e) {
    console.error("Erro no layout:", e);
    sheetContainer.innerHTML = `<div class="empty">Erro ao renderizar a folha: ${e.message}</div>`;
  }
}

// --- Eventos ------------------------------------------------------------------
function init() {
  fillThemes();
  fillSizes();
  fillTemplates();
  applyModeVisibility();

  document.querySelectorAll('input[name="mode"]').forEach((r) =>
    r.addEventListener("change", () => {
      applyModeVisibility();
    })
  );
  $("#search").addEventListener("input", renderSearch);
  $("#fontScale").addEventListener("input", (e) => {
    $("#fontScaleVal").textContent = Math.round(e.target.value * 100) + "%";
  });

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

  generate();
}

document.addEventListener("DOMContentLoaded", init);
