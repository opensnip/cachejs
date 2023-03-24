const Cache = require("../index.cjs");

describe("MRU Cache test", () => {
  let cache = null;
  beforeEach(() => {
    cache = new Cache({ maxLength: 4, ttl: 100, evictionPolicy: "MRU" });
  });

  test("Set data in cache", () => {
    cache.set("a", 10);
    expect(cache.has("a")).toEqual(true);
  });

  test("Set max data in cache", () => {
    cache.set("a", 10);
    cache.set("b", 20);
    cache.set("c", 30);
    cache.set("d", 40);
    cache.set("e", 50);
    expect(cache.has("d")).toEqual(false);
  });

  test("Get data from cache", () => {
    cache.set("a", 10);
    expect(cache.get("a")).toEqual(10);
    cache.set("b", { a: 10, b: 20 });
    expect(cache.get("b")).toEqual({ a: 10, b: 20 });
    expect(cache.get("c")).toEqual(undefined);
  });

  test("Change get return value using callback function", () => {
    cache.set("a", undefined);
    expect(
      cache.get("a", (err, value) => {
        if (!err) return value;
        return null;
      })
    ).toEqual(undefined);
    expect(
      cache.get("b", (err, value) => {
        if (!err) return value;
        return null;
      })
    ).toEqual(null);
  });

  test("Check data exists in cache", () => {
    cache.set("a", 10);
    expect(cache.has("a")).toEqual(true);
    expect(cache.has("b")).toEqual(false);
  });

  test("Delete data from cache", () => {
    cache.set("a", 10);
    expect(cache.has("a")).toEqual(true);
    cache.delete("a");
    expect(cache.has("a")).toEqual(false);
  });

  test("Delete all data from cache", () => {
    cache.set("a", 10);
    cache.set("b", 20);
    expect(cache.has("a")).toEqual(true);
    cache.clear();
    expect(cache.has("a")).toEqual(false);
  });

  test("Evict data from cache", () => {
    cache.set("a", 10);
    cache.set("b", 20);
    cache.set("c", 30);
    cache.set("d", 40);
    cache.set("e", 50);
    expect(cache.toArray()).toEqual([
      { e: 50 },
      { c: 30 },
      { b: 20 },
      { a: 10 },
    ]);
  });

  test("Evict data from cache", () => {
    cache.set("a", 10);
    cache.set("b", 20);
    cache.set("c", 30);
    cache.set("d", 40);
    cache.get("b");
    cache.set("e", 50);
    expect(cache.toArray()).toEqual([
      { e: 50 },
      { d: 40 },
      { c: 30 },
      { a: 10 },
    ]);
  });

  test("Evict data from cache", () => {
    cache.set("a", 10);
    cache.set("b", 20);
    cache.set("c", 30);
    cache.set("d", 40);
    cache.get("d");
    cache.set("e", 50);
    expect(cache.toArray()).toEqual([
      { e: 50 },
      { c: 30 },
      { b: 20 },
      { a: 10 },
    ]);
  });

  test("Check ttl for cache", async () => {
    cache.set("a", 10);
    cache.set("b", 20, { ttl: 0 });
    expect(cache.has("a")).toEqual(true);
    expect(cache.has("b")).toEqual(true);
    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 200);
    });
    expect(cache.has("a")).toEqual(false);
    expect(cache.has("b")).toEqual(true);
  });

  test("Get all data as array", async () => {
    cache.set("a", 10);
    cache.set("b", 20, { ttl: 0 });
    expect(cache.toArray()).toEqual([{ b: 20 }, { a: 10 }]);
    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 200);
    });
    expect(cache.toArray()).toEqual([{ b: 20 }]);
  });
});
