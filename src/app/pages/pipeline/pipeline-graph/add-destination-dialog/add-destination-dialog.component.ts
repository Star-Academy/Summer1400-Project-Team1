import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { Dataset, DatasetRow } from "src/app/modals/dataset";
import { DatasetService } from "src/app/services/dataset.service";

@Component({
  selector: "app-add-destination-dialog",
  templateUrl: "./add-destination-dialog.component.html",
  styleUrls: ["./add-destination-dialog.component.scss"],
})
export class AddDestinationDialogComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<AddDestinationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Dataset,
    private datasetService: DatasetService
  ) {}

  datasetsRows!: DatasetRow[];
  datasetsRowsSub!: Subscription;

  displayedColumns: string[] = [
    "شماره",
    "نام پایگاه",
    "نام اتصال",
    "تاریخ ساخت",
  ];

  ngOnInit(): void {
    this.datasetService.getDatasets();
    this.datasetsRows = this.datasetService.datasetsRows;
    this.datasetsRowsSub = this.datasetService.datasetsRowsChanged.subscribe(
      (datasetsRows: DatasetRow[]) => {
        this.datasetsRows = datasetsRows;
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onDatasetClick(row: DatasetRow) {
    this.dialogRef.close(row.dataset);
  }

  ngOnDestroy(): void {
    this.datasetsRowsSub.unsubscribe();
  }
}
