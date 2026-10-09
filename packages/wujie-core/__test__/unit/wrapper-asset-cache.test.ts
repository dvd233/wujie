import { clearAssetsCache as coreClearAssetsCache } from "../../src/index";
import { styleCache, scriptCache, embedHTMLCache } from "../../src/entry";

const wrappers = [
  ["Vue2", require("../../../wujie-vue2/index.js").default],
  ["Vue3", require("../../../wujie-vue3/index.js").default],
  ["React", require("../../../wujie-react/index.js").default],
];
const caches = [styleCache, scriptCache, embedHTMLCache];
const urls = ["https://a.example/asset", "https://b.example/asset", "https://c.example/asset"];

describe.each(wrappers)("%s clearAssetsCache", (_name, wrapper) => {
  const { clearAssetsCache } = wrapper;

  beforeEach(() => {
    coreClearAssetsCache();
    caches.forEach((cache) => urls.forEach((url) => (cache[url] = Promise.resolve(url))));
  });

  afterEach(() => coreClearAssetsCache());

  test("exposes the core API through the documented destructuring syntax", () => {
    expect(clearAssetsCache).toBe(coreClearAssetsCache);
  });

  test("clears all resource caches without arguments", () => {
    expect(clearAssetsCache()).toBeUndefined();
    caches.forEach((cache) => expect(Object.keys(cache)).toEqual([]));
  });

  test("clears only the requested URL prefix", () => {
    clearAssetsCache("https://a.example");
    caches.forEach((cache) => expect(Object.keys(cache)).toEqual([urls[1], urls[2]]));
  });

  test("accepts multiple URL prefixes and preserves unrelated assets", () => {
    clearAssetsCache(["https://a.example", "https://c.example"]);
    caches.forEach((cache) => expect(Object.keys(cache)).toEqual([urls[1]]));
  });
});
