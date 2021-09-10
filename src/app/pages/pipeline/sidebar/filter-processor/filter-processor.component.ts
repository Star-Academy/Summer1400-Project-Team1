import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";
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

@Component({
  selector: "app-filter-processor",
  templateUrl: "./filter-processor.component.html",
  styleUrls: ["./filter-processor.component.scss"],
})
export class FilterProcessorComponent implements OnDestroy, OnChanges {
  @Input() filterNode!: FilterNode;
  treeControl = new NestedTreeControl<Filter>((filter) => filter.children);
  dataSource = new MatTreeNestedDataSource<Filter>();
  filterSubscription!: Subscription;
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private filterService: FilterService
  ) {}

  hasChild = (_: number, filter: Filter) => {
    return filter instanceof FilterOperator;
  };

  addFilter(parent: FilterOperator) {
    this.filterService.addFilter(parent);
  }

  addLogic(parent: FilterOperator, operator: "AND" | "OR") {
    this.filterService.addLogic(parent, operator);
  }

  deleteFilter(filter: Filter) {
    this.filterService.deleteFilter(filter);
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.data = [this.filterNode.root];
    this.filterSubscription = this.filterService.dataChange.subscribe(() => {
      this.dataSource.data = [];
      this.dataSource.data = [this.filterNode.root];
      this.treeControl.dataNodes = [this.filterNode.root];
      this.treeControl.expandAll();
    });
  }
}
