import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import {
  Filter,
  FilterNode,
  FilterOperand,
  FilterOperator,
} from "../../../../models/graph/processor-nodes/filter-node";
import { FilterService } from "../../../../services/filter.service";

// import {AreYouSureDialog} from "./add-filter-dialog/are-you-sure-dialog.component";

@Component({
  selector: "app-filter-processor",
  templateUrl: "./filter-processor.component.html",
  styleUrls: ["./filter-processor.component.scss"],
})
export class FilterProcessorComponent implements OnInit, OnDestroy {
  @Input() filterNode!: FilterNode;
  treeControl = new NestedTreeControl<Filter>((filter) => filter.children);
  dataSource = new MatTreeNestedDataSource<Filter>();
  filterSubscription!: Subscription;
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterService.initService(this.filterNode.root);
    this.filterSubscription = this.filterService.dataChange.subscribe(
      (data) => {
        this.dataSource.data = [];
        this.dataSource.data = [data!];
      }
    );
  }

  hasChild = (_: number, filter: Filter) => {
    return !!filter.children && filter.children.length > 0;
  };

  addFilter(parent: FilterOperator) {
    this.filterService.addFilter(parent);
  }

  addLogic(parent: FilterOperator) {
    this.filterService.addLogic(parent);
  }

  deleteFilter(filter: Filter) {
    this.filterService.deleteFilter(filter);
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  // private transform = (filter: Filter) => {
  //   const openBracket = "<span>(</span>";
  //   const closeBracket = "<span>)</span>";
  //   if (filter.conditionType === undefined) {
  //     this.stateString +=
  //       openBracket +
  //       filter.key +
  //       filter.operator +
  //       filter.value +
  //       closeBracket;
  //   } else {
  //     this.stateString += openBracket;
  //     for (let i = 0; i < filter.children.length; i++) {
  //       this.transform(filter.children[i]);
  //       if (i < filter.children.length - 1) {
  //         if (filter.conditionType === ConditionType.OR)
  //           this.stateString += ` <span class="accent">${filter.conditionType}</span> `;
  //         else
  //           this.stateString += ` <span class="primary">${filter.conditionType}</span> `;
  //       }
  //     }
  //     this.stateString += closeBracket;
  //   }
  // };

  //TODO handle after child removed
  // onAddFilter(filter: Filter) {
  //   this.filterProcessorService.addFilter(filter);
  // }
  //
  // addParentFilter(parentFilter: Filter, conditionType: string) {
  //   let condition: ConditionType =
  //     conditionType === "OR" ? ConditionType.OR : ConditionType.AND;
  //   this.filterProcessorService.addLogicFilter(parentFilter, condition);
  // }
  //
  // onDeleteParentFilter(parentFilter: Filter) {
  //   const dialogRef = this.dialog.open(AreYouSureDialog, {
  //     width: "35vw",
  //     panelClass: "add-filter-dialog",
  //   });
  //
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.filterProcessorService.removeParent(parentFilter);
  //     }
  //   });
  // }
  //
  // createRoot(root: string) {
  //   if (root === "FILTER") this.isSingleFilter = true;
  //   this.filterProcessorService.createRoot(root);
  // }
  //
  // ngOnDestroy(): void {
  //   this.filtersListSub.unsubscribe();
  // }
  //
  // addRoot(logic: string) {
  //   this.isSingleFilter = false;
  //   let condition: ConditionType = ConditionType.NO_VALUE;
  //   switch (logic) {
  //     case "AND":
  //       condition = ConditionType.AND;
  //       break;
  //     case "or":
  //       condition = ConditionType.OR;
  //       break;
  //   }
  //   this.filterProcessorService.addRoot(condition);
  // }
  //
  // applyChanges($event: Filter, currentFilter: Filter) {
  //   this.filterProcessorService.updateFilter($event, currentFilter);
  // }
}
