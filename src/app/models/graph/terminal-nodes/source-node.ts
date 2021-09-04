import { NodeType } from "../node";
import { TerminalNode } from "./terminal-node";

export class SourceNode extends TerminalNode {
  constructor(name: string) {
    super(name, NodeType.SOURCE);
  }
}
