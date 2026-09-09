import assert from "node:assert/strict";
import { sanitizeSettings } from "../src/settings.js";

const options = { themes: ["amor"], sizes: ["medium"], templates: ["plain"], verseIds: ["jo3-16"] };
const clean = (data) => sanitizeSettings(data, options);
for (const data of [null, false, 42, "inválido", []]) assert.deepEqual(clean(data), {});
assert.deepEqual(clean({ mode: 'random"]', theme: "apagado", size: "antigo", template: "custom" }), {});
assert.deepEqual(clean({ mode: "generate", count: "17.9", theme: "amor" }), { mode: "random", theme: "amor", count: 17 });
assert.deepEqual(clean({ fontScale: "Infinity", overlay: null, count: {}, sameVerse: "false" }), {});
assert.deepEqual(clean({ fontScale: -5, overlay: 12, count: 999 }), { fontScale: 0.6, overlay: 0.85, count: 120 });
assert.deepEqual(clean({ pickedIds: ["jo3-16", "inexistente", "jo3-16", null] }), { pickedIds: ["jo3-16"] });
assert.equal(clean({ footer: "x".repeat(100) }).footer.length, 80);
assert.deepEqual(clean({ footer: {}, pasteText: ["texto"] }), {});
const valid = { mode: "paste", theme: "", size: "medium", template: "plain", count: 0, fontScale: 1, overlay: 0.35, sameVerse: false, fillPage: true, defaultFooter: true, footer: "Cultos aos domingos", pasteText: "João 3:16 - Porque Deus amou…", pickedIds: ["jo3-16"] };
assert.deepEqual(clean(valid), valid);
console.log("settings: restauração e recuperação de dados inválidos aprovadas");
