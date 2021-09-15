import { AfterContentInit, Component, Input, ViewChild } from "@angular/core";
import { GraphService } from "../../../services/graph.service";
import { MatDialog } from "@angular/material/dialog";
import { PipelineService } from "../../../services/pipeline.service";
import { TerminalNode } from "../../../models/graph/terminal-nodes/terminal-node";
import { DialogSelectDatasetDialog } from "./add-destination-dialog/dialog-select-dataset-dialog.component";
import { Dataset } from "../../../models/dataset";
import { Pipeline } from "../../../models/pipeline";
import { NodeType } from "../../../models/graph/node";
import { OgmaService } from "../../../services/ogma.service";
import { Observable, Subscription } from "rxjs";
import { Edge } from "src/app/models/graph/edge";
import { DialogProcessorSelectDialog } from "./processor-dialog/dialog-processor-select-dialog.component";
import { FilterNode } from "src/app/models/graph/processor-nodes/filter-node";
import { Node } from "../../../models/graph/node";
import { JoinNode } from "src/app/models/graph/processor-nodes/join-node";
import { AggregateNode } from "src/app/models/graph/processor-nodes/aggregate-node";
import { ProcessorNode } from "src/app/models/graph/processor-nodes/processor-node";

@Component({
  selector: "app-pipeline-graph",
  templateUrl: "./pipeline-graph.component.html",
  styleUrls: ["./pipeline-graph.component.scss"],
})
export class PipelineGraphComponent implements AfterContentInit {
  @Input() pipeline!: Pipeline;
  @ViewChild("graphContainer", { static: true })
  private container;

  private clickedNodeSub!: Subscription;
  private clickedEdgeSub!: Subscription;

  constructor(
    private ogmaService: OgmaService,
    private graphService: GraphService,
    private dialog: MatDialog,
    private pipelineService: PipelineService
  ) {}

  ngOnInit() {
    console.log("pipeline",this.pipeline);
    this.pipelineService.getComponentById(1,2)
    this.clickedNodeSub = this.graphService.clickedNode.subscribe((node) => {
      if (node instanceof TerminalNode) this.promptDatasetSelectDialog(node);
      else{ this.pipelineService.selectedNode = node;
    }
    });
    this.clickedEdgeSub = this.graphService.clickedEdge.subscribe((edge) => {
      this.promptProcessorSelectDialog(edge);
    });
  }

  promptProcessorSelectDialog(edge: Edge) {
    const dialogRef = this.dialog.open(DialogProcessorSelectDialog, {
      autoFocus: false,
      width: "67.5rem",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.createNode(res, edge);
      this.ogmaService.unSelectEdge(edge);
    });
  }

  createNode(nodeType: NodeType, edge: Edge) {
    let newNode: ProcessorNode;
    switch (nodeType) {
      case NodeType.FILTER:
        newNode = new FilterNode("filter");
        break;
      case NodeType.JOIN:
        newNode = new JoinNode("join");
        break;
      case NodeType.AGGREGATE:
        //TODO pass index
        newNode = new AggregateNode("aggregate");
        break;
    }
    this.postNode(newNode!, edge);
  }

  postNode(node: ProcessorNode, edge: Edge) {
    let obs: Observable<any>;
    switch (node.nodeType) {
      case NodeType.AGGREGATE:
        obs = this.pipelineService.postAggregateNode(
          this.pipeline.Id,
          node as AggregateNode,
          this.graphService.getPlacingIndex(edge)
        );
        break;
      case NodeType.JOIN:
        obs = this.pipelineService.postJoinNode(
          this.pipeline.Id,
          node as JoinNode,
          this.graphService.getPlacingIndex(edge)
        );
        break;
         case NodeType.FILTER:
        obs = this.pipelineService.postFilterNode(
          this.pipeline.Id,
          node as FilterNode,
          this.graphService.getPlacingIndex(edge)
        );
        break;
    }
    obs!.toPromise().then(() => this.graphService.insertNode(node, edge));
  }

  promptDatasetSelectDialog(terminalNode: TerminalNode) {
    const dialogRef = this.dialog.open(DialogSelectDatasetDialog, {
      width: "50vw",
    });
    dialogRef.afterClosed().subscribe((dataset: Dataset) => {
      if (dataset) {
        this.setDataset(terminalNode, dataset);
      }
    });
  }

  setDataset(terminalNode: TerminalNode, dataset: Dataset) {
    let obs =
      terminalNode.nodeType === NodeType.SOURCE
        ? this.pipelineService.setSrcDataset(this.pipeline, dataset.Id)
        : this.pipelineService.setDestDataset(this.pipeline, dataset.Id);
    obs.toPromise().then(() => {
      terminalNode.dataset = dataset;
      this.ogmaService.fillTerminalNode(terminalNode);
    });
  }

  ngAfterContentInit(): void {
    this.graphService.constructGraph(this.container.nativeElement);
    this.graphService.initGraph(this.pipeline);
    console.log("path",this.graphService.path);
    
  }

  zoomIn() {
    this.ogmaService.zoomIn();
  }

  zoomOut() {
    this.ogmaService.zoomOut();
  }

  ngOnDestroy() {
    this.clickedNodeSub.unsubscribe();
    this.clickedEdgeSub.unsubscribe();
  }
}
