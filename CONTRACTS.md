# CONTRATOS DE MÓDULO (LER ANTES DE CODAR)

> Este arquivo é a "lei" do projeto. Cada agente implementa **somente os arquivos do seu módulo**
> e **NÃO altera** `index.html`, `src/app.js` nem `src/styles/main.css` (são do integrador).
> Mantenha EXATAMENTE as assinaturas abaixo, para que o merge seja limpo e tudo se encaixe.

Stack: **HTML + CSS + JavaScript puro (ES modules)**. Sem build, sem dependências npm.
A app abre direto no navegador (`index.html`) e imprime via `Ctrl+P` (Salvar como PDF, A4).

---

## Tipo de dado central

```js
/**
 * @typedef {Object} Verse
 * @property {string} id      - identificador único (ex.: "jo3-16")
 * @property {string} ref     - referência exibida (ex.: "João 3:16")
 * @property {string} text    - texto do versículo (ACF)
 * @property {string[]} themes- temas (ex.: ["salvação","amor"])
 */
```

---

## Módulo 1 — Dados & Seleção  (DONO: Agente "data")
Arquivos: `src/data/verses.js`, `src/selection.js`

`src/data/verses.js` deve exportar:
```js
export const VERSES = [ /* Verse[] — banco curado ACF, quanto mais melhor */ ];
export function listThemes()            // -> string[] (temas únicos, ordenados)
```

`src/selection.js` deve exportar:
```js
export function getRandomVerses(count, opts = {})   // opts.themes?: string[]  -> Verse[] (sem repetir até esgotar)
export function searchVerses(query)                 // busca em ref e text     -> Verse[]
export function parsePastedText(text)               // 1+ versículos colados    -> Verse[] (gera id/ref se faltar)
export function generateByTheme(theme, count)       // filtra por tema          -> Verse[]
```

---

## Módulo 2 — Layout / Diagramação A4  (DONO: Agente "layout")
Arquivos: `src/layout.js`, `src/styles/print.css`, `src/styles/layout.css`

`src/layout.js` deve exportar:
```js
export const TRACT_SIZES = [ { id, label, wMm, hMm } /* presets de tamanho */ ];
export const DEFAULT_SIZE_ID = "...";
/**
 * Renderiza dentro de containerEl uma ou mais páginas A4 com os papelzinhos.
 * - Faz o grid lado a lado preenchendo a A4.
 * - Para CADA papelzinho cria a estrutura e chama template.apply(innerEl, {sizeId}).
 * - Aplica auto-ajuste de fonte para versículos longos caberem (fontScale = multiplicador do usuário).
 * - Desenha marcas de corte entre os papelzinhos.
 */
export function renderSheet(containerEl, { verses, sizeId, template, fontScale = 1 });
```
Cada papelzinho deve conter o texto (`.tract-text`) e a referência (`.tract-ref`), e um
contêiner de fundo (`.tract-bg`) onde o template aplica a arte. `print.css` garante A4 fiel
(`@page { size: A4; margin: 0 }`) e que só a folha apareça na impressão.

---

## Módulo 3 — Templates de Arte  (DONO: Agente "templates")
Arquivos: `src/templates/index.js`, `src/styles/templates.css`, `src/templates/*` (à vontade)

`src/templates/index.js` deve exportar:
```js
export const TEMPLATES = [ { id, name, apply(bgEl, ctx) } /* >= 4 templates */ ];
export const DEFAULT_TEMPLATE_ID = "plain";   // "plain" = liso/branco
export function getTemplate(id)                // -> template (fallback p/ DEFAULT)
```
`apply(bgEl, ctx)` recebe o `.tract-bg` de um papelzinho e aplica a arte via classes/CSS/SVG.
Deve haver o template `plain` (sem arte). Artes feitas com CSS/SVG (gradientes, molduras,
ornamentos). Fundos suaves para não atrapalhar a leitura do versículo. `ctx.sizeId` disponível.

---

## Regras gerais
- Só mexa nos arquivos do SEU módulo. Não toque em `index.html`, `src/app.js`, `src/styles/main.css`.
- Não adicione dependências/npm. JS puro, ES modules, imports relativos com extensão `.js`.
- Teste mentalmente que a assinatura bate com este contrato — é o que o integrador vai chamar.
