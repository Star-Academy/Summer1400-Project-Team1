import { Injectable } from "@angular/core";
import { OgmaService } from "./ogma.service";
import { Node } from "../models/graph/node";
import { Edge } from "../models/graph/edge";
import { NodeType } from "../models/node";
import { MatDialog } from "@angular/material/dialog";
import { DialogProcessorSelectDialog } from "../pages/pipeline/pipeline-graph/node-item/processor-dialog/dialog-processor-select-dialog.component";

@Injectable({
  providedIn: "root",
})
export class GraphService {
  nodes: Node[] = [];
  edges: Edge[] = [];

  constructor(private ogmaService: OgmaService, public dialog: MatDialog) {}

  constructGraph(container: HTMLElement) {
    this.ogmaService.initConfig({
      container: container,
    });
    this.ogmaService.ogma.events.onClick((event) => this.handleEvents(event));
    this.initGraph();
  }

  initGraph() {
    const srcNode = new Node("source", 0);
    const destNode = new Node("destination", 0);
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

  onNodeClicked(node: Node) {}

  onEdgeClicked(edge: Edge) {
    this.promptProcessorSelectDialog(edge);
  }

  promptProcessorSelectDialog(edge: Edge) {
    const dialogRef = this.dialog.open(DialogProcessorSelectDialog, {
      autoFocus: false,
      width: "67.5rem",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.addNodeInBetween(edge);
    });
  }

  addNodeInBetween(edge: Edge) {
    this.removeEdge(edge);
    const newNode = new Node("foo", 0);
    this.addNode(newNode);
    this.addEdge(new Edge(edge.src, newNode));
    this.addEdge(new Edge(newNode, edge.dest));
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
}
