import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { NodeType } from "../../../../../models/graph/node";

@Component({
  selector: "app-processor-dialog",
  templateUrl: "./dialog-processor-select-dialog.component.html",
  styleUrls: ["./dialog-processor-select-dialog.component.scss"],
})
export class DialogProcessorSelectDialog {
  constructor(public dialogRef: MatDialogRef<DialogProcessorSelectDialog>) {}

  onSelectProcessor(nodeType: NodeType) {
    this.dialogRef.close(nodeType);
  }

  get nodeType() {
    return NodeType;
  }
}
