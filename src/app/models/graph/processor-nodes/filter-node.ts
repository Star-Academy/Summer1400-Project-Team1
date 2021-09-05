import { Node, NodeType } from "../node";
import { ProcessorNode } from "./processor-node";

export class FilterNode extends ProcessorNode {
  constructor(name: string) {
    super(name, NodeType.FILTER);
  }
}
