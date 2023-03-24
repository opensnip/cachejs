const LinkedList = require("./linkedlist/index.cjs");
const Node = require("./linkedlist/node.cjs");

module.exports = class LRU {
  #linkedList = null;
  #cache = null;
  #ttl = 0;
  #maxLength = 0;

  constructor(options = {}) {
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
      (typeof options.interval !== "undefined" &&
        typeof options.interval !== "number") ||
      options.interval < 0
    ) {
      throw new TypeError("interval should be positive integer value");
    }

    options.maxLength =
      typeof options.maxLength === "number" ? options.maxLength : 1000;
    options.ttl = typeof options.ttl === "number" ? options.ttl : 0;

    this.#linkedList = new LinkedList();
    this.#cache = new Map();
    this.#ttl = options.ttl;
    this.#maxLength = options.maxLength;
  }

  get length() {
    return this.#cache.size;
  }

  set(key, value, options = {}) {
    if (
      (typeof options.ttl !== "undefined" && typeof options.ttl !== "number") ||
      options.ttl < 0
    ) {
      throw new TypeError("ttl should be positive integer value");
    }

    options.ttl = typeof options.ttl === "number" ? options.ttl : this.#ttl;

    const nodeValue = {
      key: key,
      value: value,
      createdAt: Date.now(),
      expiresAt: null,
      ttl: options.ttl,
      frequency: 0,
    };
    if (nodeValue.ttl > 0) {
      nodeValue.expiresAt = nodeValue.createdAt + nodeValue.ttl;
    }

    // Insert a new node at head
    const existingNode = this.#cache.get(key);
    // Update node data if node is already exists
    if (existingNode instanceof Node) {
      existingNode.value = nodeValue;
      // Move current node to the head
      this.#linkedList.setHead(existingNode);
    } else {
      // Remove node if cache is full
      if (this.length === this.#maxLength) {
        this.#evict();
      }
      // Create new node and make attach it to the head
      const node = this.#linkedList.insertHead(nodeValue);
      this.#cache.set(key, node);
    }
  }

  get(key, callback = null) {
    try {
      if (callback && typeof callback !== "function") {
        throw new TypeError("callback should be a function");
      }

      const node = this.#cache.get(key);

      if (node instanceof Node) {
        // Check node is live or not
        if (this.#isStale(node)) {
          this.delete(key);
          throw new Error(key + " Key not found");
        }

        // Move current node to the head
        this.#linkedList.setHead(node);

        if (callback) {
          return callback(null, node.value.value);
        } else {
          return node.value.value;
        }
      }

      throw new Error(key + " Key not found");
    } catch (err) {
      if (callback) {
        return callback(err, undefined);
      } else {
        return;
      }
    }
  }

  delete(key) {
    const node = this.#cache.get(key);

    if (node instanceof Node) {
      this.#linkedList.delete(node);
      // Delete node
      this.#cache.delete(key);
    }
  }

  #evict() {
    if (this.#linkedList.tail == null) return;
    if (this.length !== this.#maxLength) return;
    this.delete(this.#linkedList.tail.value.key);
  }

  clear() {
    // Delete all data from cache
    this.#linkedList.clear();
    this.#cache.clear();
  }

  has(key) {
    const node = this.#cache.get(key);

    if (node instanceof Node) {
      // Check node is live or not
      if (this.#isStale(node)) {
        this.delete(key);
      } else {
        return true;
      }
    }
    return false;
  }

  // Iterate over cache using forEach loop
  forEach(callback) {
    if (callback && typeof callback !== "function") {
      throw new TypeError("callback should be a function");
    }

    let node = this.#linkedList.head;
    let index = 0;
    while (node) {
      let next = node.next;
      if (this.has(node.value.key)) {
        callback({ [node.value.key]: node.value.value }, index);
      }
      node = next;
      index++;
    }
  }

  toArray() {
    let values = [];
    this.forEach(function (data) {
      values.push(data);
    });
    return values;
  }

  #isStale(node) {
    if (!node.value.expiresAt) return false;
    return node.value.expiresAt - Date.now() <= 0;
  }

  // Iterator to iterate over cache with a 'for...of' loop
  *[Symbol.iterator]() {
    let node = this.#linkedList.head;
    while (node) {
      let next = node.next;
      if (this.has(node.value.key)) {
        yield { [node.value.key]: node.value.value };
      }
      node = next;
    }
  }
};
