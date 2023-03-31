const FIFO = require("./fifo.cjs");
const LIFO = require("./lifo.cjs");
const LRU = require("./lru.cjs");
const MRU = require("./mru.cjs");

module.exports = class Cache {
  #cache = null;
  #config = {
    evictionPolicy: "LRU",
    ttl: 0,
    maxLength: 250,
    interval: 0,
    intervalId: null,
    enableInterval: false,
  };

  constructor(options = {}) {
    if (
      typeof options.evictionPolicy !== "undefined" &&
      typeof options.evictionPolicy !== "string"
    ) {
      throw new TypeError("evictionPolicy should be string");
    }

    if (
      (typeof options.maxLength !== "undefined" &&
        typeof options.maxLength !== "number") ||
      options.maxLength < 0
    ) {
      throw new TypeError("maxLength should be positive integer value");
    }

    if (
      (typeof options.ttl !== "undefined" && typeof options.ttl !== "number") ||
      options.ttl < 0
    ) {
      throw new TypeError("ttl should be positive integer value");
    }

    if (
      typeof options.enableInterval !== "undefined" &&
      typeof options.enableInterval !== "boolean"
    ) {
      throw new TypeError("enableInterval should be boolean");
    }

    if (
      (typeof options.interval !== "undefined" &&
        typeof options.interval !== "number") ||
      options.interval < 0
    ) {
      throw new TypeError("interval should be positive integer value");
    }

    options.evictionPolicy = options.evictionPolicy || "LRU";
    options.maxLength =
      typeof options.maxLength === "number" ? options.maxLength : 250;
    options.ttl = typeof options.ttl === "number" ? options.ttl : 0;
    if (
      typeof options.interval === "number" &&
      typeof options.enableInterval !== "boolean"
    ) {
      options.enableInterval = true;
    }
    options.interval =
      typeof options.interval === "number" ? options.interval : 1000 * 60;
    options.enableInterval =
      typeof options.enableInterval === "boolean"
        ? options.enableInterval
        : false;

    this.#config.evictionPolicy = options.evictionPolicy;
    this.#config.maxLength = options.maxLength;
    this.#config.ttl = options.ttl;
    this.#config.interval = options.interval;
    this.#config.enableInterval =
      options.interval > 0 ? options.enableInterval : false;

    switch (options.evictionPolicy.toUpperCase()) {
      case "LRU":
        this.#cache = new LRU(options);
        break;
      case "MRU":
        this.#cache = new MRU(options);
        break;
      case "FIFO":
        this.#cache = new FIFO(options);
        break;
      case "LIFO":
        this.#cache = new LIFO(options);
        break;
      default:
        throw new TypeError(
          options.evictionPolicy + " cache eviction policy is not supported"
        );
    }
    // Automatically remove expires cache
    this.startInterval();
  }

  get length() {
    return this.#cache.length;
  }

  get(key, callback = undefined) {
    return this.#cache.get(key, callback);
  }

  set(key, value, options = {}) {
    return this.#cache.set(key, value, options);
  }

  delete(key) {
    return this.#cache.delete(key);
  }

  clear() {
    return this.#cache.clear();
  }

  startInterval() {
    // Interval already running
    if (this.#config.intervalId) return;
    // Interval is disabled
    if (!this.#config.enableInterval) return;

    this.#config.intervalId = setInterval(
      function (cache) {
        if (cache.length === 0) return;
        cache.forEach(function (data) {
          // Automatically invalidate expired cache
        });
      },
      this.#config.interval,
      this.#cache
    );
  }

  clearInterval() {
    if (this.#config.intervalId) {
      clearInterval(this.#config.intervalId);
    }
  }

  has(key) {
    return this.#cache.has(key);
  }

  forEach(callback) {
    return this.#cache.forEach(callback);
  }

  toArray() {
    return this.#cache.toArray();
  }

  // Iterator to iterate over cache with a 'for...of' loop
  *[Symbol.iterator]() {
    for (let cache of this.#cache) {
      yield cache;
    }
  }
};
