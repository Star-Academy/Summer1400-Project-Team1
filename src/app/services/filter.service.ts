import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import {
  Filter,
  FilterOperand,
  FilterOperator,
} from "../models/graph/processor-nodes/filter-node";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  dataChange = new Subject<void>();

  constructor() {}

  addFilter(parent: FilterOperator) {
    parent.children?.push(new FilterOperand(parent));
    this.dataChange.next();
  }

  addLogic(parent: FilterOperator, operator: "AND" | "OR") {
    parent.children?.push(new FilterOperator(parent, operator));
    this.dataChange.next();
  }

  deleteFilter(filter: Filter) {
    if (!filter.parent) return;
    filter.parent!.children = filter.parent!.children!.filter(
      (child) => child !== filter
    );
    if (filter.parent!.children.length === 0) this.deleteFilter(filter.parent!);
    this.dataChange.next();
  }
}
