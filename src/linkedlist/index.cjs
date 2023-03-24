const Node = require("./node.cjs");

module.exports = class LinkedList {
  #head = null;
  #tail = null;
  #length = 0;

  get head() {
    return this.#head;
  }

  get tail() {
    return this.#tail;
  }

  get length() {
    return this.#length;
  }

  clear() {
    this.#head = null;
    this.#tail = null;
    this.#length = 0;
  }

  insertHead(value) {
    const node = new Node(value);
    if (this.#head === null) {
      this.#head = this.#tail = node;
    } else {
      this.#head.prev = node;
      node.next = this.#head;
      this.#head = node;
    }
    this.#length++;
    return node;
  }

  insertTail(value) {
    if (this.#tail === null) {
      return this.insertHead(value);
    }

    const node = new Node(value);
    this.#tail.next = node;
    node.prev = this.#tail;
    this.#tail = node;
    this.#length++;
    return node;
  }

  insertAfter(node, value) {
    if (!(node instanceof Node)) {
      throw new TypeError("node should be a valid Node instance");
    }
    const newNode = new Node(value);
    if (node.next != null) {
      node.next.prev = newNode;
      newNode.next = node.next;
    }
    newNode.prev = node;
    node.next = newNode;
    this.#length++;
    return node;
  }

  setHead(node) {
    if (!(node instanceof Node)) {
      throw new TypeError("node should be a valid Node instance");
    }

    if (this.#head === node) return this.#head;

    if (this.#head === null) {
      return this.insertHead(node.value);
    }

    this.detach(node);
    node.prev = null;
    node.next = this.#head;
    this.#head.prev = node;
    this.#head = node;
    this.#length++;
    return this.#head;
  }

  setTail(node) {
    if (!(node instanceof Node)) {
      throw new TypeError("node should be a valid Node instance");
    }

    if (this.#tail === node) return this.#tail;

    if (this.#tail === null) {
      return this.insertTail(node.value);
    }

    this.detach(node);
    this.#tail.next = node;
    node.prev = this.#tail;
    node.next = null;
    this.#tail = node;
    this.#length++;
    return this.#tail;
  }

  swap(leftNode, rightNode) {
    if (!(leftNode instanceof Node)) {
      throw new TypeError("leftNode should be a valid Node instance");
    }
    if (!(rightNode instanceof Node)) {
      throw new TypeError("rightNode should be a valid Node instance");
    }

    if (leftNode === rightNode) return [leftNode, rightNode];

    // Replace left node with right node
    let tmpRight = new Node(rightNode.value);
    if (leftNode.prev != null) {
      leftNode.prev.next = tmpRight;
    }
    if (leftNode.next != null) {
      leftNode.next.prev = tmpRight;
    }
    tmpRight.prev = leftNode.prev;
    tmpRight.next = leftNode.next;
    if (leftNode == this.#head) this.#head = tmpRight;
    if (leftNode == this.#tail) this.#tail = tmpRight;

    // Replace right node with left node
    let tmpLeft = new Node(leftNode.value);
    if (rightNode.prev != null) {
      rightNode.prev.next = tmpLeft;
    }
    if (rightNode.next != null) {
      rightNode.next.prev = tmpLeft;
    }
    tmpLeft.prev = rightNode.prev;
    tmpLeft.next = rightNode.next;
    if (rightNode == this.#head) this.#head = tmpLeft;
    if (rightNode == this.#tail) this.#tail = tmpLeft;

    delete leftNode.next;
    delete leftNode.prev;
    delete leftNode.value;
    delete rightNode.next;
    delete rightNode.prev;
    delete rightNode.value;
    return [tmpLeft, tmpRight];
  }

  deleteHead() {
    if (this.#head == null) return;
    if (this.#head.next != null) {
      this.#head.next.prev = null;
    }
    delete this.#head.value;
    this.#head = this.#head.next;
    this.#length--;
  }

  deleteTail() {
    if (this.#tail == null) return;
    if (this.#tail.prev != null) {
      this.#tail.prev.next = null;
    }
    delete this.#tail.value;
    this.#tail = this.#tail.prev;
    this.#length--;
  }

  delete(node) {
    if (!(node instanceof Node)) {
      throw new TypeError("node should be a valid Node instance");
    }
    this.detach(node);
    delete node.prev;
    delete node.next;
    delete node.value;
  }

  detach(node) {
    if (!(node instanceof Node)) {
      throw new TypeError("node should be a valid Node instance");
    }

    if (node.prev != null) {
      node.prev.next = node.next;
    }
    if (node.next != null) {
      node.next.prev = node.prev;
    }
    if (this.#head === node) {
      this.#head = node.next;
    }
    if (this.#tail === node) {
      this.#tail = node.prev;
    }
    node.prev = null;
    node.next = null;
    this.#length--;
  }

  search(value) {
    let nodes = [];
    this.forEach(function (node) {
      if (node.value === value) {
        nodes.push(node);
      }
    });
    return nodes;
  }

  find(value) {
    for (let node of this) {
      if (node.value === value) {
        return node;
      }
    }
    return null;
  }

  forEach(callback) {
    if (callback && typeof callback != "function") {
      throw new TypeError("callback should be a function");
    }

    let node = this.#head;
    let index = 0;
    while (node) {
      callback(node, index);
      node = node.next;
      index++;
    }
  }

  toArray() {
    let values = [];
    this.forEach(function (node) {
      values.push(node.value);
    });
    return values;
  }

  *[Symbol.iterator]() {
    let node = this.#head;
    while (node) {
      yield node;
      node = node.next;
    }
  }
};
