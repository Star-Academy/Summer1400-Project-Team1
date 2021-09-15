import { HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";
import {Pipeline, PipelineRow} from "src/app/models/pipeline";
import { PipelinePageService } from "src/app/services/pipeline-page.service";
import { PipelineService } from "src/app/services/pipeline.service";
import { Alert, AlertType } from "src/app/utils/alert";

@Component({
  selector: "app-pipelines",
  templateUrl: "./pipelines.component.html",
  styleUrls: ["./pipelines.component.scss"],
})
export class PipelinesComponent implements OnInit {
  pipelineRows!: PipelineRow[]; 
  pipelineRowsSub!: Subscription;
  displayedColumns: string[] = ["شماره", "نام", "تاریخ ساخت", "delete"];

  constructor(public pipelineService: PipelineService, 
    private pipelinePageService: PipelinePageService,
    private snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    this.pipelineService.fetchPipelines();
    this.pipelineRowsSub = this.pipelineService.pipelineRowsChanged.subscribe(
      (pipelineRows: PipelineRow[]) => {
        this.pipelineRows = pipelineRows;
      }
    );
  }

  onUpload(event: any){
    
    if (event.target === null) return;
   this.pipelineService.uploadPipelineYml(event.target.files[0]).subscribe(
    (event) => {
      if (event.type === HttpEventType.Response) {
        Alert.showAlert(
          this.snackBar,
          "با موفقیت بارگزاری شد",
          AlertType.success,
          
      );
        this.pipelineService.fetchPipelines();
      }
    },
    (error) => {
    }
  );
  }

  deletePipeline(pipeline: Pipeline, event: Event) {
    this.pipelineService.deletePipeline(pipeline.Id)
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.pipelineRowsSub.unsubscribe();
  }
}
