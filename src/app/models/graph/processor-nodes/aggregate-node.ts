import { Node, NodeType } from "../node";
import { ProcessorNode } from "./processor-node";

export class AggregateNode extends ProcessorNode {
  aggregateType!: string;
  column!: string;
  constructor(name: string) {
    super(name, NodeType.AGGREGATE);
  }
}
