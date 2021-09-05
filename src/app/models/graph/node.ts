import { Data } from "../data";

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
  private inputData!: Data;
  private outputData?: Data;
  protected constructor(public name: string, public nodeType: NodeType) {
    this._id = Node.nodeCounter;
    Node.nodeCounter++;
  }

  get id(): number {
    return this._id;
  }
}
