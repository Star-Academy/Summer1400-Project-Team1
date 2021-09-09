import { Node, NodeType } from "../node";
import { ProcessorNode } from "./processor-node";

export class FilterNode extends ProcessorNode {
  root = new FilterOperator(null);
  constructor(name: string) {
    super(name, NodeType.FILTER);
  }
}

abstract class Filter {
  constructor(parent: FilterOperator | null) {}
}

class FilterOperator extends Filter {
  operator: "AND" | "OR" = "AND";
  children: Filter[] = [];
}

class FilterOperand extends Filter {
  key!: string;
  operator!: Operator;
  value!: string;
}

enum Operator {
  LESS_THAN = ">",
  GREATER_THAN = "<",
  EQUAL_TO = "==",
}
