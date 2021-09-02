import { FilterNode } from "./filter-node";
import { JoinNode } from "./join-node";
import { AggregateNode } from "./aggregate-node";

export enum NodeType {
  SOURCE_LOCAL = "local-storage",
  SOURCE_SERVER = "server-storage",
  DESTINATION_LOCAL = "local-storage",
  DESTINATION_SERVER = "server-storage",
  FILTER = "filter",
  JOIN = "join",
  AGGREGATION = "aggregate",
}

export class Node {
  constructor(
    public id: number,
    public name: string,
    public nodeType: NodeType,
    public NodeDetail?: FilterNode | JoinNode | AggregateNode
  ) {}
}
