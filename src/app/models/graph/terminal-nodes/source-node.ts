import { Node } from "../node";
import { Dataset } from "../../dataset";
import { TerminalNode } from "./terminal-node";

export class SourceNode extends TerminalNode {
  constructor(name: string) {
    super(name);
  }
}
