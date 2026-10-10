const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const code = fs.readFileSync(require("node:path").join(__dirname, "../sw.js"), "utf8");

function worker({ fetch, match = async () => undefined, put = async () => {}, keys = [] } = {}) {
  const handlers = {}, removed = [], writes = [];
  const cache = { match, put: async (...args) => { writes.push(args[0]); return put(...args); }, addAll: async () => {} };
  const self = { location: { href: "https://example.com/studio/sw.js" }, addEventListener: (name, fn) => { handlers[name] = fn; }, clients: { claim: async () => {} }, skipWaiting: async () => {} };
  vm.runInNewContext(code, { self, URL, Response, fetch, caches: { open: async () => cache, keys: async () => keys, delete: async (key) => removed.push(key) } });
  return { handlers, removed, writes };
}
async function request(w, url, mode = "navigate", method = "GET") {
  let result;
  w.handlers.fetch({ request: { url, mode, method }, respondWith: (response) => { result = response; } });
  return result;
}

test("fresh online HTML wins even when writing the cache fails", async () => {
  const w = worker({ fetch: async () => new Response("fresh"), match: async () => new Response("stale"), put: async () => { throw new Error("Quota exceeded"); } });
  assert.equal(await (await request(w, "https://example.com/studio/")).text(), "fresh");
});
test("offline navigation falls back to the cached home, assets fail with 503", async () => {
  const w = worker({ fetch: async () => { throw new Error("Offline"); }, match: async (r) => r === "https://example.com/studio/index.html" ? new Response("offline home") : undefined });
  assert.equal(await (await request(w, "https://example.com/studio/?campaign=mobile")).text(), "offline home");
  assert.equal((await request(w, "https://example.com/studio/missing.css", "same-origin")).status, 503);
});
test("other origins, other projects and POST requests are not intercepted", async () => {
  const w = worker();
  assert.equal(await request(w, "https://other.example/studio/"), undefined);
  assert.equal(await request(w, "https://example.com/other/"), undefined);
  assert.equal(await request(w, "https://example.com/studio/", "navigate", "POST"), undefined);
});
test("activation removes obsolete studio caches while preserving unrelated caches", async () => {
  const current = code.match(/const VERSION = "([^"]+)"/)[1];
  const w = worker({ keys: ["studio-di-catarina-v3", "di-catarina-v10", current, "another-site"] });
  let done;
  w.handlers.activate({ waitUntil: (p) => { done = p; } });
  await done;
  assert.deepEqual(w.removed, ["studio-di-catarina-v3", "di-catarina-v10"]);
});
