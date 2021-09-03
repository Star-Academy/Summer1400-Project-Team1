import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { Dataset, DatasetRow } from "src/app/models/dataset";
import { DatasetService } from "src/app/services/dataset.service";

@Component({
  selector: "app-add-destination-dialog",
  templateUrl: "./dialog-select-dataset-dialog.component.html",
  styleUrls: ["./dialog-select-dataset-dialog.component.scss"],
})
export class DialogSelectDatasetDialog implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<DialogSelectDatasetDialog>,
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

  onDatasetClick(row: DatasetRow) {
    this.dialogRef.close(row.dataset);
  }

  ngOnDestroy(): void {
    this.datasetsRowsSub.unsubscribe();
  }
}
