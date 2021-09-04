import { NodeType } from "../node";
import { TerminalNode } from "./terminal-node";

export class DestinationNode extends TerminalNode {
  constructor(name: string) {
    super(name, NodeType.DESTINATION);
  }
}
