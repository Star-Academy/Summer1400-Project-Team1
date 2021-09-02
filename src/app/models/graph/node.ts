import { NodeType } from "../node";

export class Node {
  static nodeCounter = 0;
  public id: number;
  constructor(public name: string, public nodeType: NodeType) {
    this.id = Node.nodeCounter;
    Node.nodeCounter++;
  }
}
