import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Filter, FilterNode } from "../../../../models/filter-node";
import { PipelineService } from "src/app/services/pipeline.service";

@Component({
  selector: "app-filter-processor",
  templateUrl: "./filter-processor.component.html",
  styleUrls: ["./filter-processor.component.scss"],
})
export class FilterProcessorComponent implements OnInit, OnDestroy {
  filtersList: Filter[] = [];
  filtersListSub!: Subscription;
  constructor(private pipelineService: PipelineService) {}

  ngOnInit(): void {
    this.filtersList = (
      this.pipelineService.currentSidebarProcessorDetail as FilterNode
    ).filtersList;
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
