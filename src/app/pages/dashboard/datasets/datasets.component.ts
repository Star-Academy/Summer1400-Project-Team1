import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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

  displayedColumns: string[] = ["شماره", "نام دیتاست", "اتصال", "تاریخ ساخت"];

  constructor(
    private datasetService: DatasetService,
    private storedDataService: StoredDataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.datasetService.getDatasets();
    this.datasetsRowsSub = this.datasetService.datasetsRowsChanged.subscribe(
      (datasetsRows: DatasetRow[]) => {
        this.datasetsRows = datasetsRows;
      }
    );
  }
  onAddDataset() {
    this.storedDataService.datasetFile = null;
    this.router.navigateByUrl("datasets/add");
  }

  onUpload(event: any) {
    if (event.target === null)return
    this.storedDataService.datasetFile = event.target.files[0];
    this.router.navigateByUrl("datasets/addlocal");
  }

  onDatasetClick(row: DatasetRow) {
    console.log(row.dataset.Name);
    // this.router.navigate(["/pipeline"]).then();
  }

  ngOnDestroy(): void {
    this.datasetsRowsSub.unsubscribe();
  }
}
