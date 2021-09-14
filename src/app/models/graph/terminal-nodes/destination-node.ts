import { Dataset } from "../../dataset";
import { NodeType, Node } from "../node";
import { TerminalNode } from "./terminal-node";

export class DestinationNode extends TerminalNode {
  constructor(name: string,dataset : Dataset, next: Node|undefined) {
    super(name, NodeType.DESTINATION,dataset, next!);
  }
}
