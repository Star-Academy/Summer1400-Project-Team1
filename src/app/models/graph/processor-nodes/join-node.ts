import { Node, NodeType } from "../node";
import { ProcessorNode } from "./processor-node";
import { Dataset } from "../../dataset";

export class JoinNode extends ProcessorNode {
  secondDataset!: Dataset;
  joinType!: string;
  firstDatasetPK!: string;
  secondDatasetPK!: string;
  constructor(name: string) {
    super(name, NodeType.JOIN);
  }
}
