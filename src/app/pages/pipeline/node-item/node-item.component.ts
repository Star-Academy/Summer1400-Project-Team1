import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Node, NodeType } from "../../../modals/node";
import { MatDialog } from "@angular/material/dialog";
import { ProcessorDialogComponent } from "./processor-dialog/processor-dialog.component";
import { AddDestinationDialogComponent } from "../add-destination-dialog/add-destination-dialog.component";
import { Dataset } from "src/app/modals/dataset";

@Component({
  selector: "app-node-item",
  templateUrl: "./node-item.component.html",
  styleUrls: ["./node-item.component.scss"],
})
export class NodeItemComponent implements OnInit {
  @Input() node!: Node;
  @Input() index!: number;
  @Input() nodesLength!: number;
  @Output() deleteNode = new EventEmitter<Node>();
  @Output() addNode = new EventEmitter<{ index: number; node: Node }>();

  nodeType!: string;
  destinationNode!: Dataset;
  private processorType: any;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.nodeType = this.node.nodeType;
    console.log(this.nodeType);
  }

  onDeleteNode() {
    this.deleteNode.emit(this.node);
  }

  onNodeClick() {
    switch (this.node.nodeType) {
      case NodeType.DESTINATION_LOCAL:
      case NodeType.DESTINATION_SERVER:
        this.openAddDestination();
        break;
    }
  }

  openAddDestination() {
    const dialogRef = this.dialog.open(AddDestinationDialogComponent, {
      width: "50vw",
      data: this.destinationNode,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProcessorDialogComponent, {
      width: "250px",
      data: { processorType: this.processorType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let processorType!: NodeType;
        let node!: Node;
        switch (result) {
          case "filter":
            processorType = NodeType.FILTER;
            break;
          case "join":
            processorType = NodeType.JOIN;
            break;
          case "aggregation":
            processorType = NodeType.AGGREGATION;
            break;
        }
        node = new Node(this.nodesLength, result, processorType);
        this.addNode.emit({ index: this.index, node });
      }
    });
  }
}
