import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Filter } from "../../../../models/filter-node";
import { PipelineService } from "src/app/services/pipeline.service";
import { FilterNode } from "../../../../models/graph/processor-nodes/filter-node";

@Component({
  selector: "app-filter-processor",
  templateUrl: "./filter-processor.component.html",
  styleUrls: ["./filter-processor.component.scss"],
})
export class FilterProcessorComponent implements OnInit, OnDestroy {
  @Input() filterNode!: FilterNode;

  filtersList: Filter[] = [];
  filtersListSub!: Subscription;
  constructor(private pipelineService: PipelineService) {}

  ngOnInit(): void {
    // this.filtersList = (
    //   this.pipelineService.currentSidebarProcessorDetail as FilterNode
    // ).filtersList;
    this.filtersListSub =
      this.pipelineService.currentSidebarProcessorDetailChanged.subscribe(
        (details: any) => {
          this.filtersList = details.filtersList;
        }
      );
  }

  ngOnDestroy(): void {
    this.filtersListSub.unsubscribe();
  }

  onClose() {}

  onDelete() {}

  onAddFilter() {}
}
