import { Injectable } from "@angular/core";
import { OgmaService } from "./ogma.service";
import { Node, NodeType } from "../models/graph/node";
import { Edge } from "../models/graph/edge";
import { SourceNode } from "../models/graph/terminal-nodes/source-node";
import { DestinationNode } from "../models/graph/terminal-nodes/destination-node";
import { TerminalNode } from "../models/graph/terminal-nodes/terminal-node";
import { DialogProcessorSelectDialog } from "../pages/pipeline/pipeline-graph/processor-dialog/dialog-processor-select-dialog.component";
import { DialogSelectDatasetDialog } from "../pages/pipeline/pipeline-graph/add-destination-dialog/dialog-select-dataset-dialog.component";
import { FilterNode } from "../models/graph/processor-nodes/filter-node";
import { JoinNode } from "../models/graph/processor-nodes/join-node";
import { AggregateNode } from "../models/graph/processor-nodes/aggregate-node";
import { MatDialog } from "@angular/material/dialog";
import { Dataset } from "../models/dataset";
import { PipelineService } from "./pipeline.service";
import { Subject, Subscription } from "rxjs";
import { Pipeline } from "../models/pipeline";

@Injectable({
  providedIn: "root",
})
export class GraphService {
  nodes: Node[] = [];
  edges: Edge[] = [];

  clickedNode = new Subject<Node>();

  constructor(
    private ogmaService: OgmaService,
    private dialog: MatDialog,
    private pipelineService: PipelineService
  ) {}

  constructGraph(container: HTMLElement) {
    this.ogmaService.initConfig({
      container: container,
    });
    this.ogmaService.ogma.events.onClick((event) => this.handleEvents(event));
    // this.initGraph();
  }

  initGraph(pipeline:Pipeline) {
    const srcNode = new SourceNode(pipeline.Source.Name,pipeline.Source);
    const destNode = new DestinationNode(pipeline.Destination.Name,pipeline.Destination);
    const initialEdge = new Edge(srcNode, destNode);
    this.addNode(srcNode);
    this.addNode(destNode);
    this.addEdge(initialEdge);
    return this.runLayout();
  }

  runLayout(): Promise<void> {
    return this.ogmaService.runLayout();
  }

  handleEvents(event) {
    if (!event.target) return;
    if (event.target.isNode) {
      const index = this.nodes.findIndex(
        (node) => node.id == event.target.getId()
      );
      this.onNodeClicked(this.nodes[index]);
    } else {
      const index = this.edges.findIndex(
        (edge) => edge.id == event.target.getId()
      );
      this.onEdgeClicked(this.edges[index]);
    }
  }

  onNodeClicked(node: Node) {
    this.clickedNode.next(node);
  }

  onEdgeClicked(edge: Edge) {
    this.promptProcessorSelectDialog(edge);
  }

  promptProcessorSelectDialog(edge: Edge) {
    const dialogRef = this.dialog.open(DialogProcessorSelectDialog, {
      autoFocus: false,
      width: "67.5rem",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.addProcessor(res, edge);
      else this.unselectEdge(edge);
    });
  }

  addProcessor(nodeType: NodeType, edge: Edge) {
    let newNode: Node;
    switch (nodeType) {
      case NodeType.FILTER:
        newNode = new FilterNode("filter");
        break;
      case NodeType.JOIN:
        newNode = new JoinNode("join");
        break;
      case NodeType.AGGREGATE:
        newNode = new AggregateNode("aggregate");
        break;
    }
    this.insertNode(newNode!, edge);
  }

  insertNode(node: Node, edge: Edge) {
    this.removeEdge(edge);
    this.addNode(node);
    this.addEdge(new Edge(edge.src, node));
    this.addEdge(new Edge(node, edge.dest));
    this.pipelineService.selectedNode = node;
    return this.runLayout();
  }

  removeNode(node: Node) {
    this.nodes = this.nodes.filter((el) => el !== node);
    this.ogmaService.removeNode(node);
    this.attachAdjacentNodes(node);
    return this.runLayout();
  }

  attachAdjacentNodes(node: Node) {
    const incomingEdge = this.edges.find((edge) => edge.dest === node);
    const outgoingEdge = this.edges.find((edge) => edge.src === node);
    this.addEdge(new Edge(incomingEdge!.src, outgoingEdge!.dest));
    this.removeEdge(incomingEdge!);
    this.removeEdge(outgoingEdge!);
  }

  removeEdge(edge: Edge) {
    this.edges = this.edges.filter((el) => el !== edge);
    this.ogmaService.removeEdge(edge);
  }

  addNode(node: Node) {
    this.nodes.push(node);
    this.ogmaService.addNode(node);
  }

  addEdge(edge: Edge) {
    this.edges.push(edge);
    this.ogmaService.addEdge(edge);
  }

  unselectEdge(edge: Edge) {
    this.ogmaService.unSelectEdge(edge);
  }

  zoomIn() {
    this.ogmaService.zoomIn();
  }

  zoomOut() {
    this.ogmaService.zoomOut();
  }
}
