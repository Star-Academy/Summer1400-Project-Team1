import { Node, NodeType } from "../node";
import { ProcessorNode } from "./processor-node";
import { Dataset } from "../../dataset";

export class JoinNode extends ProcessorNode {
  dataset!: Dataset;
  joinType!: string;
  tableColumn!: string;
  datasetColumn!: string;
  constructor(name: string) {
    super(name, NodeType.JOIN);
  }
}
