import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("build creates a self-contained seminar page", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /RMTA China — Online Seminar/);
  assert.match(html, /Benoît Collins/);
  assert.match(html, /Join mailing list/);
  assert.match(html, /sites\.google\.com\/view\/zhigangbaohomepage/);
  assert.match(html, /zhenyu-liao\.github\.io/);
  assert.match(html, /yyxu3624\.github\.io\/homepage/);
  assert.match(html, /lunzhangmaths\.github\.io/);
  assert.match(html, /View poster/);
  assert.doesNotMatch(html, /poster-placeholder|poster-button/);
  assert.match(html, /mathjax@4\/tex-chtml\.js/);
  assert.match(html, /inlineMath/);
  assert.ok(html.includes("\\\\frac{1}{\\\\sqrt{M}}"));
  assert.doesNotMatch(html, /matrix-field|A shared forum/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|_next\//);
});
