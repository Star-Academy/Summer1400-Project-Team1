import { Component, Input, OnInit, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Node, NodeType } from "../../../models/graph/node";
import { Observable } from "rxjs";
import { PipelineService } from "../../../services/pipeline.service";
import { GraphService } from "../../../services/graph.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @Output() openChooseProcessorDialog = new EventEmitter<void>();

  constructor(public pipelineService: PipelineService) {}

  ngOnInit(): void {}

  openDialog() {
    this.openChooseProcessorDialog.emit();
  }

  get NodeType() {
    return NodeType;
  }
}
