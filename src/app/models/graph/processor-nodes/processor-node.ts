import { Node, NodeType } from "../node";

export abstract class ProcessorNode extends Node {
  protected constructor(name: string, nodeType: NodeType) {
    super(name, nodeType);
  }
}
