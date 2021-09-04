import { Injectable } from "@angular/core";
import { OgmaService } from "./ogma.service";
import { Node, NodeType } from "../models/graph/node";
import { Edge } from "../models/graph/edge";
import { SourceNode } from "../models/graph/terminal-nodes/source-node";
import { DestinationNode } from "../models/graph/terminal-nodes/destination-node";
import { TerminalNode } from "../models/graph/terminal-nodes/terminal-node";
import { DialogProcessorSelectDialog } from "../pages/pipeline/pipeline-graph/node-item/processor-dialog/dialog-processor-select-dialog.component";
import { DialogSelectDatasetDialog } from "../pages/pipeline/pipeline-graph/add-destination-dialog/dialog-select-dataset-dialog.component";
import { FilterNode } from "../models/graph/filter-node";
import { JoinNode } from "../models/graph/join-node";
import { AggregateNode } from "../models/graph/aggregate-node";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
  providedIn: "root",
})
export class GraphService {
  nodes: Node[] = [];
  edges: Edge[] = [];

  selectedNode?: Node;

  constructor(private ogmaService: OgmaService, private dialog: MatDialog) {}

  constructGraph(container: HTMLElement) {
    this.ogmaService.initConfig({
      container: container,
    });
    this.ogmaService.ogma.events.onClick((event) => this.handleEvents(event));
    this.initGraph();
  }

  initGraph() {
    const srcNode = new SourceNode("source");
    const destNode = new DestinationNode("destination");
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
    if (node instanceof TerminalNode) {
      this.onTerminalNodeClicked(node);
    }
  }

  onTerminalNodeClicked(terminalNode: TerminalNode) {
    if (!terminalNode.dataset) this.promptDatasetSelectDialog(terminalNode);
  }

  promptDatasetSelectDialog(node: TerminalNode) {
    const dialogRef = this.dialog.open(DialogSelectDatasetDialog, {
      width: "50vw",
    });
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
    this.addNodeInBetween(newNode!, edge);
  }

  addNodeInBetween(node: Node, edge: Edge) {
    this.removeEdge(edge);
    this.addNode(node);
    this.addEdge(new Edge(edge.src, node));
    this.addEdge(new Edge(node, edge.dest));
    return this.runLayout();
  }

  removeNode(node: Node) {}

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
}
