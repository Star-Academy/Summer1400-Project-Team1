export enum NodeType {
  SOURCE = 1,
  DESTINATION,
  FILTER,
  JOIN,
  AGGREGATE,
}

export abstract class Node {
  static nodeCounter = 0;
  public id: number;
  protected constructor(public name: string) {
    this.id = Node.nodeCounter;
    Node.nodeCounter++;
  }
}
