const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const base = "https://maykonlong.github.io/studio_di_catarina/";
const decode = (s) => s.replaceAll("&amp;", "&").replaceAll("&quot;", '"');
const nodes = [...html.matchAll(/<([a-z][\w-]*)\b([^>]*?)>/gi)].map((match) => ({
  tag: match[1].toLowerCase(),
  attrs: Object.fromEntries([...match[2].matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)].map((a) => [a[1], decode(a[2])])),
}));

test("unique anchors, local assets and accessible image/form names", () => {
  const ids = nodes.map((n) => n.attrs.id).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, "Duplicate IDs");
  assert.equal(nodes.filter((n) => n.tag === "h1").length, 1);
  for (const { tag, attrs } of nodes) {
    for (const key of ["href", "src"]) {
      const value = attrs[key];
      if (!value) continue;
      if (value.startsWith("#")) assert.ok(ids.includes(value.slice(1)), value);
      else if (!/^[a-z]+:/i.test(value)) {
        assert.ok(fs.statSync(path.join(root, value.split("?")[0])).isFile(), value);
      }
    }
    if (tag === "img") {
      assert.ok("alt" in attrs, "Missing image alt");
      assert.ok(attrs.width && attrs.height, "Missing reserved image dimensions");
    }
    if (tag === "input" || tag === "select") {
      assert.ok(nodes.some((n) => n.tag === "label" && n.attrs.for === attrs.id), "Unlabelled form field");
    }
    if (attrs.target === "_blank") assert.ok(attrs.rel?.includes("noopener"), "Unprotected new tab");
  }
});

test("production URLs, approved contacts and real photo references stay consistent", () => {
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.url, base);
  assert.equal(schema.telephone, "+5511910618237");
  assert.equal(schema.address.streetAddress, "Rua Frei Henrique Soares de Coimbra, 77 — Parque Imperial");
  assert.equal(nodes.find((n) => n.attrs.rel === "canonical").attrs.href, base);
  for (const n of nodes.filter((n) => n.attrs.href?.includes("wa.me/"))) {
    assert.equal(new URL(n.attrs.href).pathname, "/5511910618237");
  }
  const sources = Object.values(JSON.parse(read("assets/images/real/sources.json")));
  for (const photo of sources) {
    assert.ok(nodes.some((n) => n.attrs.src === photo.file));
    assert.ok(nodes.some((n) => n.attrs.href === photo.source));
    assert.ok(nodes.some((n) => n.attrs["data-reference"] === photo.source));
  }
  for (const match of read("sitemap.xml").matchAll(/<(?:image:)?loc>(.*?)<\//g)) assert.ok(match[1].startsWith(base));
  assert.ok(read("llms.txt").includes("Coimbra, 77"));
  assert.doesNotMatch(html, /fachada|studiodicatarina\.com\.br|Coimbra, 251/i);
});

test("versioned styles/scripts are available offline and mobile is the CSS base", () => {
  const sw = read("sw.js");
  const assets = [...sw.split("const ASSETS = [")[1].split("].map")[0].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  for (const asset of assets) assert.ok(fs.existsSync(path.join(root, asset.split("?")[0])), asset);
  for (const value of ["styles.css", "script.js"]) {
    const node = nodes.find((n) => (n.attrs.href || n.attrs.src || "").startsWith(value));
    const url = node.attrs.href || node.attrs.src;
    assert.match(url, /\?v=/, "Assets must bypass the legacy unversioned cache");
    assert.ok(assets.includes(url), "HTML and offline URLs differ");
  }
  assert.doesNotMatch(read("styles.css"), /@media\s*\(max-width/);
  JSON.parse(read("manifest.json"));
});
