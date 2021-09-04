import { Node, NodeType } from "./node";

export class JoinNode extends Node {
  constructor(name: string) {
    super(name, NodeType.JOIN);
  }
}
