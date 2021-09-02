import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { PipelineRow } from "src/app/models/pipeline";
import { PipelineService } from "src/app/services/pipeline.service";

@Component({
  selector: "app-pipelines",
  templateUrl: "./pipelines.component.html",
  styleUrls: ["./pipelines.component.scss"],
})
export class PipelinesComponent implements OnInit {
  pipelineRows!: PipelineRow[];
  pipelineRowsSub!: Subscription;
  displayedColumns: string[] = ["شماره", "نام", "تاریخ ساخت"];

  constructor(public pipelineService: PipelineService) {}

  ngOnInit(): void {
    this.pipelineService.getPipeline();
    this.pipelineRows = this.pipelineService.pipelineRows;
    this.pipelineRowsSub = this.pipelineService.pipelineRowsChanged.subscribe(
      (pipelineRows: PipelineRow[]) => {
        this.pipelineRows = pipelineRows;
      }
    );
  }

  onPipelineClick(row: PipelineRow) {
    console.log(row.pipeline.name);
  }

  ngOnDestroy(): void {
    this.pipelineRowsSub.unsubscribe();
  }
}
