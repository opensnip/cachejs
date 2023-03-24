const LinkedList = require("../src/linkedlist/index.cjs");

describe("Linkedlist test", () => {
  let linkedlist = null;
  beforeEach(() => {
    linkedlist = new LinkedList();
  });

  test("Set data at head in linked list", () => {
    linkedlist.insertHead(10);
    linkedlist.insertHead(15);
    linkedlist.insertHead(20);
    expect(linkedlist.toArray()).toEqual([20, 15, 10]);
  });

  test("Set data at the end of linked list", () => {
    linkedlist.insertTail(10);
    linkedlist.insertTail(15);
    linkedlist.insertTail(20);
    expect(linkedlist.toArray()).toEqual([10, 15, 20]);
  });

  test("Set data after a node", () => {
    linkedlist.insertHead(10);
    linkedlist.insertTail(20);
    let node = linkedlist.find(10);
    linkedlist.insertAfter(node, 15);
    expect(linkedlist.toArray()).toEqual([10, 15, 20]);
  });

  test("Set head", () => {
    linkedlist.insertHead(10);
    linkedlist.insertHead(15);
    linkedlist.insertHead(20);
    let node = linkedlist.find(15);
    linkedlist.setHead(node);
    expect(linkedlist.toArray()).toEqual([15, 20, 10]);
  });

  test("Set tail", () => {
    linkedlist.insertHead(10);
    linkedlist.insertHead(15);
    linkedlist.insertHead(20);
    let node = linkedlist.find(15);
    linkedlist.setTail(node);
    expect(linkedlist.toArray()).toEqual([20, 10, 15]);
  });

  test("Swap nodes", () => {
    linkedlist.insertTail(10);
    linkedlist.insertTail(15);
    linkedlist.insertTail(20);
    linkedlist.insertTail(25);
    linkedlist.insertTail(30);
    let left = linkedlist.find(10);
    let right = linkedlist.find(25);
    linkedlist.swap(left, right);
    expect(linkedlist.toArray()).toEqual([25, 15, 20, 10, 30]);
  });

  test("Swap neighbor nodes", () => {
    linkedlist.insertTail(10);
    linkedlist.insertTail(15);
    let left = linkedlist.find(10);
    let right = linkedlist.find(15);
    linkedlist.swap(left, right);
    expect(linkedlist.toArray()).toEqual([15, 10]);
  });

  test("Swap single node", () => {
    linkedlist.insertTail(10);
    let left = linkedlist.find(10);
    linkedlist.swap(left, left);
    expect(linkedlist.toArray()).toEqual([10]);
  });

  test("Delete head", () => {
    linkedlist.insertHead(10);
    linkedlist.insertHead(15);
    linkedlist.insertHead(20);
    linkedlist.deleteHead();
    expect(linkedlist.toArray()).toEqual([15, 10]);
  });

  test("Delete tail", () => {
    linkedlist.insertHead(10);
    linkedlist.insertHead(15);
    linkedlist.insertHead(20);
    linkedlist.deleteTail();
    expect(linkedlist.toArray()).toEqual([20, 15]);
  });

  test("Delete node", () => {
    linkedlist.insertHead(10);
    linkedlist.insertHead(15);
    linkedlist.insertHead(20);
    let node = linkedlist.find(15);
    linkedlist.delete(node);
    expect(linkedlist.toArray()).toEqual([20, 10]);
  });

  test("Detach node", () => {
    linkedlist.insertHead(10);
    linkedlist.insertHead(15);
    linkedlist.insertHead(20);
    let node = linkedlist.find(15);
    linkedlist.detach(node);
    expect(linkedlist.toArray()).toEqual([20, 10]);
  });

  test("Search nodes by value", () => {
    linkedlist.insertHead(10);
    linkedlist.insertHead(15);
    linkedlist.insertHead(10);
    linkedlist.insertHead(20);
    let nodes = linkedlist.search(10);
    expect(nodes.map((e) => e.value)).toEqual([10, 10]);
  });

  test("Find a first node by value", () => {
    linkedlist.insertHead(10);
    linkedlist.insertHead(15);
    linkedlist.insertHead(10);
    linkedlist.insertHead(20);
    let node = linkedlist.find(10);
    expect(node.value).toEqual(10);
  });

  test("Get all values as array", () => {
    linkedlist.insertHead(10);
    linkedlist.insertHead(15);
    linkedlist.insertHead(20);
    expect(linkedlist.toArray()).toEqual([20, 15, 10]);
  });
});
