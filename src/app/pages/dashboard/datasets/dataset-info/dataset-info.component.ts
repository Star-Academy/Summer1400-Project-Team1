import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { Pipeline, PipelineRow } from "src/app/models/pipeline";
import { DatasetService } from "src/app/services/dataset.service";
import { PipelineService } from "src/app/services/pipeline.service";

@Component({
  selector: "app-dataset-info",
  templateUrl: "./dataset-info.component.html",
  styleUrls: ["./dataset-info.component.scss"],
})
export class DatasetInfoComponent implements OnInit, OnDestroy {
  dataset!: { id: number };
  paramsSubscription!: Subscription;

  sampels = [1, 2, 3];
  sampelCount: number = 50;
  pipelineRows!: PipelineRow[];
  pipelineRowsSub!: Subscription;
  displayedColumnsPipelines: string[] = [
    "شماره",
    "نام",
    "تاریخ ساخت",
    "delete",
  ];

  dataSource = [];

  constructor(
    private datasetService: DatasetService,
    public pipelineService: PipelineService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dataset = {
      id: this.route.snapshot.params["id"],
    };
    this.datasetService.getDatasetSample(this.dataset.id);

    this.showSamples();
    this.getDatasetPipelines();
    this.pipelineService.fetchPipelines();
    // this.pipelineRowsSub = this.pipelineService.pipelineRowsChanged.subscribe(
    //   (pipelineRows: PipelineRow[]) => {
    //     this.pipelineRows = pipelineRows;
    //   }
    // );
  }

  onPipelineClick(row: PipelineRow) {
    console.log(row.pipeline.Name);
  }

  async showSamples() {
    let res = await this.pipelineService.fetchDatasetSamples(
      this.dataset.id,
      this.sampelCount
    );
    this.dataSource = res;
  }
  async getDatasetPipelines() {
    let res = await this.pipelineService.fetchPipelinesByDatasetId(
      this.dataset.id
    );
    console.log(res);
  }

  deletePipeline(pipeline: Pipeline, event: Event) {
    //this.pipelineService.deletePipeline(pipeline.Id)
    event.stopPropagation();
  }
  ngOnDestroy() {
   }
}
