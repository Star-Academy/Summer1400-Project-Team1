import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { DatasetRow } from "src/app/models/dataset";
import { DatasetService } from "src/app/services/dataset.service";
import { StoredDataService } from "src/app/services/stored-data.service";

@Component({
  selector: "app-datasets",
  templateUrl: "./datasets.component.html",
  styleUrls: ["./datasets.component.scss"],
})
export class DatasetsComponent implements OnInit, OnDestroy {
  datasetsRows!: DatasetRow[];
  datasetsRowsSub!: Subscription;

  displayedColumns: string[] = [
    "شماره",
    "نام پایگاه",
    "نام اتصال",
    "تاریخ ساخت",
  ];

  constructor(
    private datasetService: DatasetService,
    private storedDataService: StoredDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.datasetService.getDatasets();
    this.datasetsRows = this.datasetService.datasetsRows;
    this.datasetsRowsSub = this.datasetService.datasetsRowsChanged.subscribe(
      (datasetsRows: DatasetRow[]) => {
        this.datasetsRows = datasetsRows;
      }
    );
  }

  onUpload(event: any) {
    if (event.target !== null) console.log(event.target.files);
    this.storedDataService.datasetFile = event.target.files[0];
    this.router.navigateByUrl("/datasets/add");
  }

  onDatasetClick(row: DatasetRow) {
    console.log(row.dataset.name);
    this.router.navigate(["/pipeline"]).then();
  }

  ngOnDestroy(): void {
    this.datasetsRowsSub.unsubscribe();
  }
}
