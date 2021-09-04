import { Node, NodeType } from "./node";

export class AggregateNode extends Node {
  constructor(name: string) {
    super(name, NodeType.AGGREGATE);
  }
}
