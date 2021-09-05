import { Node, NodeType } from "../node";
import { ProcessorNode } from "./processor-node";

export class JoinNode extends ProcessorNode {
  constructor(name: string) {
    super(name, NodeType.JOIN);
  }
}
