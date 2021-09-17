import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-dialog-delete-node",
  templateUrl: "./dialog-delete-node-dialog.component.html",
  styleUrls: ["./dialog-delete-node-dialog.component.scss"],
})
export class DialogDeleteNodeDialog {
  constructor(public dialogRef: MatDialogRef<DialogDeleteNodeDialog>) {}
}
