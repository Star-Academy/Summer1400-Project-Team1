import { Node, NodeType } from "../node";
import { ProcessorNode } from "./processor-node";

export class FilterNode extends ProcessorNode {
  root = new FilterOperator(null, "AND");
  constructor(name: string) {
    super(name, NodeType.FILTER);
  }
  jsonTree() {

  }
}

export abstract class Filter {
  children?: Filter[];
  constructor(public parent: FilterOperator | null) {}

  abstract get tree();
}

export class FilterOperator extends Filter {
  get tree() {
    throw new Error("Method not implemented.");
  }
  constructor(parent: FilterOperator | null, public operator: "AND" | "OR") {
    super(parent);
    this.children = [];
  }
}

export class FilterOperand extends Filter {
  
  key: string = "";
  operator: Operator = Operator.EQUAL_TO;
  value: string = "";

  get tree(): any {
    return this;
  }
}

enum Operator {
  LESS_THAN = ">",
  GREATER_THAN = "<",
  EQUAL_TO = "=",
}
