import { Node, NodeType } from "../node";
import { ProcessorNode } from "./processor-node";

export class FilterNode extends ProcessorNode {
  root = new FilterOperator(null);
  constructor(name: string) {
    super(name, NodeType.FILTER);
  }
}

export abstract class Filter {
  children?: Filter[];
  constructor(public parent: FilterOperator | null) {}
}

export class FilterOperator extends Filter {
  operator: "AND" | "OR";
  constructor(parent: FilterOperator | null) {
    super(parent);
    this.children = [new FilterOperand(this)];
    this.operator = "AND";
  }
}

export class FilterOperand extends Filter {
  key!: string;
  operator!: Operator;
  value!: string;
}

enum Operator {
  LESS_THAN = ">",
  GREATER_THAN = "<",
  EQUAL_TO = "==",
}
