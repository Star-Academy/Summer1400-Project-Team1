import { Node, NodeType } from "../node";
import { Dataset } from "../../dataset";

export abstract class TerminalNode extends Node {
  protected _dataset!: Dataset;

  protected constructor(name: string, nodeType: NodeType) {
    super(name, nodeType);
  }

  get dataset() {
    return this._dataset!;
  }

  set dataset(value: Dataset) {
    this._dataset = value;
  }
}
