import { Node, NodeType } from "../node";
import { ProcessorNode } from "./processor-node";

export class AggregateNode extends ProcessorNode {
  aggregateType!: AggregateType;
  column!: string;
  outputColumnName!: string;
  groupByColumns: {name: string}[]=[];

  constructor(name: string) {
    super(name, NodeType.AGGREGATE);
  }
}

export enum AggregateType {
  COUNT, SUM, AVREAGE, MIN, MAX, NONE
}