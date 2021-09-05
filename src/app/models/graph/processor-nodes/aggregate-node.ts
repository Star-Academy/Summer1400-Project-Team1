import { Node, NodeType } from "../node";
import { ProcessorNode } from "./processor-node";

export class AggregateNode extends ProcessorNode {
  constructor(name: string) {
    super(name, NodeType.AGGREGATE);
  }
}
