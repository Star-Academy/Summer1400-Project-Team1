import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { Dataset } from "src/app/modals/dataset";
import { PipelineService } from "src/app/services/pipeline.service";
import { Node, NodeType } from "../../modals/node";
import { AddDestinationDialogComponent } from "./add-destination-dialog/add-destination-dialog.component";

@Component({
  selector: "app-pipeline",
  templateUrl: "./pipeline.component.html",
  styleUrls: ["./pipeline.component.scss"],
})
export class PipelineComponent implements OnInit {
  nodes!: Node[];
  nodesSub!: Subscription;
  hasEndNodes: boolean = false;
  destinationNode!: Dataset;
  constructor(
    private pipelineService: PipelineService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.pipelineService.getNodes();
    this.nodes = this.pipelineService.nodes;
    this.hasEndNodes = this.nodes[this.nodes.length - 1].id === -2;

    this.nodesSub = this.pipelineService.nodesChanged.subscribe(
      (nodes: Node[]) => {
        this.nodes = nodes;
        this.hasEndNodes = this.nodes[this.nodes.length - 1].id === -2;
      }
    );
  }

  deleteNode($event: Node) {
    this.pipelineService.deleteNode($event);
  }

  addNode($event: { index: number; node: Node }) {
    this.pipelineService.addNode($event.node, $event.index);
  }

  onEndNodeClick() {
    //TODO fkosdfdf

    const dialogRef = this.dialog.open(AddDestinationDialogComponent, {
      width: "50vw",
      data: this.destinationNode,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });

    // this.pipelineService.addNode(new Node(-2, 'end',NodeType.DESTINATION_LOCAL), this.nodes.length);
    // this.hasEndNodes = true;
  }

  onDeleteEndNode() {}

  onAddNode() {
    //TODO dalkdas
    // this.addNode(this.nodes.length)
  }
}
