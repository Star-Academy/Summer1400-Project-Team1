import { Node } from "./node";
export class Edge {
  static edgeCounter = 0;
  public id: number;
  constructor(public src: Node, public dest: Node) {
    this.id = Edge.edgeCounter;
    Edge.edgeCounter++;
  }
}
