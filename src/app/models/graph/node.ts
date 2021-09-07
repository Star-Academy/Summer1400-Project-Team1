import { Table } from "../table";

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
  private _inputData?: Table;
  protected constructor(public name: string, public nodeType: NodeType) {
    this._id = Node.nodeCounter;
    this._inputData = new Table();
    Node.nodeCounter++;
  }

  get id(): number {
    return this._id;
  }

  get inputData(): Table {
    return this._inputData!;
  }

  set inputData(value: Table) {
    this._inputData = value;
  }
}
