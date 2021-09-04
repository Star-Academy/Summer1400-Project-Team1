import { Node } from "../node";
import { Dataset } from "../../dataset";

export abstract class TerminalNode extends Node {
  protected _dataset!: Dataset;

  protected constructor(name: string) {
    super(name);
  }

  get dataset() {
    return this._dataset!;
  }

  set dataset(value: Dataset) {
    this._dataset = value;
  }
}
