import { Component, Input, OnInit, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Node, NodeType } from "../../../models/graph/node";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @Input() selectedNode?: Node;

  @Output() openChooseProcessorDialog = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  openDialog() {
    this.openChooseProcessorDialog.emit();
  }

  get NodeType() {
    return NodeType;
  }
}
