import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { Dataset } from "src/app/models/dataset";
import { PipelineService } from "src/app/services/pipeline.service";
import { Node, NodeType } from "../../../models/node";
import { DialogSelectDatasetDialog } from "./add-destination-dialog/dialog-select-dataset-dialog.component";
import { DialogProcessorSelectDialog } from "./node-item/processor-dialog/dialog-processor-select-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Alert } from "../../../utils/alert";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { ViewportRuler } from "@angular/cdk/overlay";

@Component({
  selector: "app-pipeline-graph",
  templateUrl: "./pipeline-graph.component.html",
  styleUrls: ["./pipeline-graph.component.scss"],
})
export class PipelineGraphComponent implements OnInit, OnDestroy {
  nodes!: Node[];
  nodesSub!: Subscription;
  hasDestinationNodeSub!: Subscription;
  hasSourceNodeSub!: Subscription;
  sidebarSub!: Subscription;

  isSideBarOpen: boolean = false;
  hasDestinationNode: boolean = false;
  hasSourceNode: boolean = false;
  destinationNode!: Dataset;
  private processorType: any;

  constructor(
    private pipelineService: PipelineService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.pipelineService.getNodes();
    this.nodes = this.pipelineService.nodes;
    this.checkSourceNodes();

    this.nodesSub = this.pipelineService.nodesChanged.subscribe(
      (nodes: Node[]) => {
        this.nodes = nodes;
        this.checkSourceNodes();
      }
    );
    this.hasSourceNodeSub = this.pipelineService.hasSourceNodeChanged.subscribe(
      (hasSourceNode: boolean) => {
        this.hasSourceNode = hasSourceNode;
      }
    );
    this.hasDestinationNodeSub =
      this.pipelineService.hasDestinationNodeChanged.subscribe(
        (hasDestinationNode: boolean) => {
          this.hasDestinationNode = hasDestinationNode;
        }
      );
    this.sidebarSub = this.pipelineService.toggleSideBar.subscribe((isOpen) => {
      this.isSideBarOpen = isOpen;
    });
  }

  private checkSourceNodes() {
    this.hasDestinationNode = this.pipelineService.hasDestinationNode;
    this.hasSourceNode = this.pipelineService.hasSourceNode;
  }

  deleteNode($event: Node) {
    this.pipelineService.deleteNode($event);
  }

  addNode($event: { index: number; node: Node }) {
    this.pipelineService.addNode($event.node, $event.index);
  }

  onSourceNodeClick(source: string) {
    const dialogRef = this.dialog.open(DialogSelectDatasetDialog, {
      width: "50vw",
      data: this.destinationNode,
    });

    dialogRef.afterClosed().subscribe((result: Dataset) => {
      if (result) {
        switch (source) {
          case "source":
            this.pipelineService.addSourceDataset(result, false, false);

            break;
          case "destination":
            this.pipelineService.addSourceDataset(result, false, true);
            break;
        }
        console.log(result);
      }
    });

    // this.pipelineService.addNode(new Node(-2, 'end',NodeType.DESTINATION_LOCAL), this.nodes.length);
    // this.hasEndNodes = true;
  }

  onDeleteEndNode() {}

  onNoDestinationAddNode() {
    if (this.hasSourceNode) {
      const dialogRef = this.dialog.open(DialogProcessorSelectDialog, {
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
              this.pipelineService.toggleSideBar.next(true);
              this.pipelineService.currentSidebarProcessor = "filter";
              break;
            case "join":
              processorType = NodeType.JOIN;
              this.pipelineService.toggleSideBar.next(true);
              this.pipelineService.currentSidebarProcessor = "join";
              break;
            case "aggregation":
              processorType = NodeType.AGGREGATION;
              this.pipelineService.toggleSideBar.next(true);
              this.pipelineService.currentSidebarProcessor = "aggregate";

              break;
          }
          node = new Node(this.nodes.length, result, processorType);
          let index = this.nodes.length;
          if (this.hasDestinationNode) index--;
          this.addNode({ index, node });
        }
      });
    } else {
      Alert.showAlert(
        this.snackBar,
        "منبع ورودی را انتخاب کنید",
        "انتخاب",
        4500,
        () => this.onSourceNodeClick("source")
      );
    }
  }

  ngOnDestroy(): void {
    this.nodesSub.unsubscribe();
    this.hasSourceNodeSub.unsubscribe();
    this.hasDestinationNodeSub.unsubscribe();
    this.sidebarSub.unsubscribe();
  }
}
