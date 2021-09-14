import { Dataset } from "../../dataset";
import { NodeType, Node } from "../node";
import { TerminalNode } from "./terminal-node";

export class SourceNode extends TerminalNode {
  constructor(name: string, dataset: Dataset, next: Node) {
    super(name, NodeType.SOURCE, dataset, next);
  }
}
