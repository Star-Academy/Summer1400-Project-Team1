import { Dataset } from "../../dataset";
import { NodeType } from "../node";
import { TerminalNode } from "./terminal-node";


export class SourceNode extends TerminalNode {
  constructor(name: string,dataset: Dataset ) {
    super(name, NodeType.SOURCE,dataset);
  }
}
