import { Node, NodeType } from "./node";

export class FilterNode extends Node {
  constructor(name: string) {
    super(name, NodeType.FILTER);
  }
}
