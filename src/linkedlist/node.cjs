module.exports = class Node {
  constructor(value) {
    this.prev = null;
    this.next = null;
    this.value = value;
  }
};
