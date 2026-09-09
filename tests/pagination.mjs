import assert from "node:assert/strict";
import { arrangeVerses } from "../src/pagination.js";
import { capacityPerPage } from "../src/layout.js";

const pool = Array.from({ length: 20 }, (_, id) => ({ id }));
const original = pool.slice();
const auto = (size) => arrangeVerses(pool, { perPage: capacityPerPage(size), autoFill: true });
assert.equal(auto("medium").length, 9);
assert.equal(auto("mini").length, 20);
assert.equal(auto("large").length, 4);
assert.deepEqual(auto("medium"), pool.slice(0, 9));
assert.equal(new Set(auto("mini")).size, 20);
assert.deepEqual(pool, original);

// As repetições vêm sempre da seleção original, mesmo após trocar de tamanho.
const picked = pool.slice(0, 3);
assert.deepEqual(arrangeVerses(picked, { perPage: 4, fillPage: true }), [...picked, picked[0]]);
assert.deepEqual(arrangeVerses(picked, { perPage: 9, fillPage: true }), [...picked, ...picked, ...picked]);
assert.deepEqual(arrangeVerses(pool.slice(0, 11), { perPage: 9 }), pool.slice(0, 11));
assert.equal(arrangeVerses(pool.slice(0, 11), { perPage: 9, fillPage: true }).length, 18);
assert.deepEqual(arrangeVerses([], { perPage: 9, autoFill: true }), []);
const same = Array(20).fill(pool[0]);
assert.deepEqual(arrangeVerses(same, { perPage: 4, autoFill: true }), Array(4).fill(pool[0]));
console.log("pagination: preenchimento e seleção estável aprovados");
