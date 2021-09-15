import { Node, NodeType } from "../node";
import { ProcessorNode } from "./processor-node";

export class FilterNode extends ProcessorNode {
  root = new FilterOperator(null, "AND");
  constructor(name: string) {
    super(name, NodeType.FILTER);
  }
  get tree() {
    return this.root.tree;
  }
}

export abstract class Filter {
  children?: Filter[];
  constructor(public parent: FilterOperator | null) {}

  abstract get tree();
}

export class FilterOperator extends Filter {
  constructor(parent: FilterOperator | null, public operator: "AND" | "OR") {
    super(parent);
    this.children = [];
  }

  get tree() {
    let obj = {}
    obj[this.operator] = this.children?.map((child) => child.tree)
    return obj
  }
}

export class FilterOperand extends Filter {
  
  key: string = "";
  operator: Operator = Operator.EQUAL_TO;
  value: string = "";

  get tree() {
    return {key: this.key, operator: this.operator, value: this.value};
  }
}

enum Operator {
  LESS_THAN = ">",
  GREATER_THAN = "<",
  EQUAL_TO = "=",
}
