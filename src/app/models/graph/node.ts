import { TableClass } from "../table";

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
  private _inputData?: TableClass;
  protected constructor(public name: string, public nodeType: NodeType) {
    this._id = Node.nodeCounter;
    this._inputData = new TableClass();
    Node.nodeCounter++;
  }

  get id(): number {
    return this._id;
  }

  get inputData(): TableClass {
    return this._inputData!;
  }

  set inputData(value: TableClass) {
    this._inputData = value;
  }
}
