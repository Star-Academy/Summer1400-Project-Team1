export enum NodeType {
  SOURCE = 1,
  DESTINATION,
  FILTER,
  JOIN,
  AGGREGATE,
}

export abstract class Node {
  static nodeCounter = 0;
  private readonly _id: number;
  protected constructor(public name: string) {
    this._id = Node.nodeCounter;
    Node.nodeCounter++;
  }

  get id(): number {
    return this._id;
  }
}
