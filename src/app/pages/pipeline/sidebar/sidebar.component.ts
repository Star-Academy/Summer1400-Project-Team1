import { Component, Input, OnInit, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Node, NodeType } from "../../../models/graph/node";
import { Observable } from "rxjs";
import { PipelineService } from "../../../services/pipeline.service";
import { GraphService } from "../../../services/graph.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogDeleteNodeDialog } from "./dialog-delete-node/dialog-delete-node-dialog.component";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @Output() openChooseProcessorDialog = new EventEmitter<void>();

  constructor(
    public pipelineService: PipelineService,
    public graphService: GraphService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openDialog() {
    const dialogRef = this.dialog.open(DialogDeleteNodeDialog);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.graphService.removeNode(this.pipelineService.selectedNode);
    });
  }

  get NodeType() {
    return NodeType;
  }
}
