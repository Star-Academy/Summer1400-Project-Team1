import { Injectable } from "@angular/core";
import * as Ogma from "../../assets/ogma.min.js";
import { Node } from "../models/graph/node";
import { Edge } from "../models/graph/edge";

interface OgmaClass {
  name: string;
  nodeAttributes?: any;
  edgeAttributes?: any;
}

@Injectable({
  providedIn: "root",
})
export class OgmaService {
  ogma: Ogma;
  ogmaClasses: OgmaClass[] = [
    {
      name: "source",
      nodeAttributes: {
        text: {
          content: "local storage",
        },
      },
    },
    { name: "destination", nodeAttributes: { color: "red" } },
  ];

  colorPalette = {
    innerStroke: "#103183",
    nodeHover: "#e4ebea",
    outerStroke: "#ff6e70",
  };
  constructor() {}

  initConfig(configuration = {}) {
    this.ogma = new Ogma(configuration);
    this.setInitialStyles();
    this.initClasses();
  }

  setInitialStyles() {
    this.ogma.styles.addRule({
      nodeAttributes: {
        innerStroke: {
          width: 4,
          color: this.colorPalette.innerStroke,
        },
        text: {
          position: "center",
        },
        color: "white",
      },
      edgeAttributes: {
        shape: {
          style: "dashed",
        },
      },
    });
    this.ogma.styles.setSelectedNodeAttributes(
      { outerStroke: { color: this.colorPalette.outerStroke } },
      true
    );
    this.ogma.styles.setHoveredNodeAttributes(
      {
        color: this.colorPalette.nodeHover,
      },
      true
    );
    this.ogma.styles.setHoveredEdgeAttributes(
      { color: this.colorPalette.innerStroke },
      true
    );
    this.ogma.styles.setSelectedEdgeAttributes(
      { color: this.colorPalette.innerStroke },
      true
    );
  }

  initClasses() {
    this.ogmaClasses.forEach((ogmaClass) =>
      this.ogma.styles.createClass(ogmaClass)
    );
  }

  runLayout(): Promise<void> {
    return this.ogma.layouts.force({ locate: true });
  }

  addNode(node: Node) {
    const ogmaNode = {
      id: node.id,
      attributes: {
        text: node.name,
      },
    };
    this.ogma.addNode(ogmaNode);
  }

  addEdge(edge: Edge) {
    const ogmaEdge = { id: edge.id, source: edge.src.id, target: edge.dest.id };
    this.ogma.addEdge(ogmaEdge);
  }

  removeNode(node: Node) {}

  removeEdge(edge: Edge) {
    this.ogma.removeEdge(edge.id);
  }

  unSelectEdge(edge: Edge) {
    this.ogma.getEdge(edge.id).setSelected(false);
  }
}
