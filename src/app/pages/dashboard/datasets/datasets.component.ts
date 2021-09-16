import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Dataset, DatasetRow } from "src/app/models/dataset";
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

  isLoading = false;
  isLoadingSub!: Subscription;

  displayedColumns: string[] = [
    "شماره",
    "نام دیتاست",
    "نوع اتصال",
    "تاریخ ساخت",
    "delete",
  ];

  constructor(
    private datasetService: DatasetService,
    private storedDataService: StoredDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.datasetService.getDatasets();
    this.datasetsRowsSub = this.datasetService.datasetsRowsChanged.subscribe(
      (datasetsRows: DatasetRow[]) => {
        this.datasetsRows = datasetsRows;
      }
    );
    this.isLoadingSub = this.datasetService.isLoadingData.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
  }
  onAddDataset() {
    this.storedDataService.datasetFile = null;
    this.router.navigateByUrl("datasets/add");
  }

  onUpload(event: any) {
    if (event.target === null) return;
    this.storedDataService.datasetFile = event.target.files[0];
    this.router.navigateByUrl("datasets/addlocal");
  }

  onDatasetClick(row: DatasetRow) {
    let stringID = (row.dataset.Id).toString();
    this.router.navigate([`/datasets/${row.dataset.Id}`], { queryParams: { id: stringID} });

  }

  async deleteDataset(dataset: DatasetRow, event: any) {
    
    await this.datasetService.deleteDataset(dataset.dataset.Id);
    this.datasetService.getDatasets();
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.datasetsRowsSub.unsubscribe();
    this.isLoadingSub.unsubscribe();
  }
}
