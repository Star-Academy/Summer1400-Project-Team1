import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import {Pipeline, PipelineRow} from "src/app/models/pipeline";
import { PipelinePageService } from "src/app/services/pipeline-page.service";
import { PipelineService } from "src/app/services/pipeline.service";

@Component({
  selector: "app-pipelines",
  templateUrl: "./pipelines.component.html",
  styleUrls: ["./pipelines.component.scss"],
})
export class PipelinesComponent implements OnInit {
  pipelineRows!: PipelineRow[]; 
  pipelineRowsSub!: Subscription;
  displayedColumns: string[] = ["شماره", "نام", "تاریخ ساخت", "delete"];

  constructor(public pipelineService: PipelineService, private pipelinePageService: PipelinePageService) {}

  ngOnInit(): void {
    this.pipelineService.fetchPipelines();
    this.pipelineRowsSub = this.pipelineService.pipelineRowsChanged.subscribe(
      (pipelineRows: PipelineRow[]) => {
        this.pipelineRows = pipelineRows;
      }
    );
  }

  onPipelineClick(row: PipelineRow) {
    console.log(row.pipeline.Name);
  }

  deletePipeline(pipeline: Pipeline, event: Event) {
    this.pipelineService.deletePipeline(pipeline.Id)
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.pipelineRowsSub.unsubscribe();
  }
}
