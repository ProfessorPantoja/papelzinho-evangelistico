import assert from "node:assert/strict";
import {
  IMAGE_LIMITS,
  clampCount,
  getPageCount,
  getPrintReadiness,
  measurementsOverflow,
  validateImageDimensions,
  validateImageFile,
} from "../src/quality.js";

assert.equal(clampCount(-8), 0);
assert.equal(clampCount("17.9"), 17);
assert.equal(clampCount(999), 120);
assert.equal(getPageCount(21, 9), 3);
assert.equal(getPageCount(0, 9), 0);

assert.equal(measurementsOverflow({ scrollHeight: 101, clientHeight: 100 }), false);
assert.equal(measurementsOverflow({ scrollHeight: 102, clientHeight: 100 }), true);
assert.equal(measurementsOverflow({ scrollWidth: 122, clientWidth: 120 }), true);

assert.match(validateImageFile({ type: "text/plain", size: 20 }), /não é uma imagem/);
assert.match(
  validateImageFile({ type: "image/png", size: IMAGE_LIMITS.maxBytes + 1 }),
  /10 MB/
);
assert.equal(validateImageFile({ type: "image/webp", size: 1024 }), "");
assert.match(validateImageDimensions(9000, 100), /8192 px/);
assert.match(validateImageDimensions(8000, 5000), /32 megapixels/);
assert.equal(validateImageDimensions(2400, 1800), "");

assert.deepEqual(
  getPrintReadiness({ hasItems: true, selectionDirty: true }),
  { ready: false, reason: "selection-pending" }
);
assert.deepEqual(
  getPrintReadiness({ hasItems: true, overflowCount: 1 }),
  { ready: false, reason: "overflow" }
);
assert.deepEqual(
  getPrintReadiness({ hasItems: true, layoutPending: false, overflowCount: 0 }),
  { ready: true, reason: "ready" }
);

console.log("smoke: 17 verificações aprovadas");
