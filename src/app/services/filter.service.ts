import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  Filter,
  FilterNode,
  FilterOperand,
  FilterOperator,
} from "../models/graph/processor-nodes/filter-node";
import { PipelineService } from "./pipeline.service";
import { Node, NodeType } from "../models/graph/node";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  dataChange!: BehaviorSubject<Filter>;

  get data(): Filter {
    return this.dataChange.value!;
  }

  constructor(pipelineService: PipelineService) {
    pipelineService.selectedNode$.subscribe((node) => {
      if (node.nodeType === NodeType.FILTER)
        this.dataChange.next((node as FilterNode).root);
    });
  }

  initService(root: Filter) {
    this.dataChange = new BehaviorSubject<Filter>(root);
  }

  addFilter(parent: FilterOperator) {
    parent.children?.push(new FilterOperand(parent));
    this.dataChange.next(this.data);
  }

  addLogic(parent: FilterOperator) {
    parent.children?.push(new FilterOperator(parent));
    this.dataChange.next(this.data);
  }

  deleteFilter(filter: Filter) {
    if (!filter.parent) return;
    filter.parent!.children = filter.parent!.children!.filter(
      (child) => child !== filter
    );
    if (filter.parent!.children.length === 0) this.deleteFilter(filter.parent!);
    this.dataChange.next(this.data);
  }

  // removeParent(parentFilter: Filter) {
  //   // parentFilter.deleteFilter()
  //   // this.data.children.forEach(filter1=>{
  //   //     console.log("aaaaaaaaa")
  //   //     filter1.children.filter(filter=>filter.id!==-1);
  //   // })
  //   // this.dataChange.next(this.data);
  // }

  //
  //   addLogicFilter(parentFilter: Filter, conditionType: ConditionType) {
  //     parentFilter.children.push(new Filter(0, conditionType, [
  //       new Filter(0,)
  //     ],));
  //     this.dataChange.next(this.data);
  //   }
  //
  //   createRoot(root: string) {
  //     switch (root) {
  //       case 'FILTER':
  //         this.dataChange.next(new Filter(0));
  //         break;
  //       case 'AND':
  //         this.dataChange.next(new Filter(0, ConditionType.AND, [
  //           new Filter(0)
  //         ]))
  //         break;
  //       case 'OR':
  //         this.dataChange.next(new Filter(0, ConditionType.OR, [
  //           new Filter(0)
  //         ]))
  //         break;
  //
  //     }
  //   }
  //
  //   addRoot(logic: ConditionType) {
  //     this.dataChange.next(new Filter(0, logic, [
  //       this.data
  //     ]))
  //
  //   }
  //
  //   updateFilter(newFilter: Filter, currentFilter: Filter) {
  //     currentFilter.key = newFilter.key;
  //     currentFilter.operator = newFilter.operator;
  //     currentFilter.value = newFilter.value;
  //     this.dataChange.next(this.data);
  //   }
  // }

  /*
   * parent{
   * ////
   * children:[
   * (),
   * ()
   * ]
   * }
   *
   *
   *
   * */
}
