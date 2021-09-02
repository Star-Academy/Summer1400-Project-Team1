import { Injectable } from "@angular/core";
import * as Ogma from "../../assets/ogma.min.js";
import { Node } from "../models/graph/node";
import { Edge } from "../models/graph/edge";
import { NodeType } from "../models/node";

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
        shape: "square",
        innerStroke: {
          width: "4",
          color: this.colorPalette.innerStroke,
        },
        text: {
          position: "center",
        },
        color: "white",
      },
      edgeAttributes: {
        // shape: {
        //   head: "arrow",
        // },
      },
    });
    this.ogma.styles.setSelectedNodeAttributes(null);
    this.ogma.styles.setHoveredNodeAttributes(
      {
        color: "#d6d6d6",
      },
      true
    );
    this.ogma.styles.setHoveredEdgeAttributes({ color: "#1342b6" }, true);
  }

  initClasses() {
    this.ogmaClasses.forEach((ogmaClass) =>
      this.ogma.styles.createClass(ogmaClass)
    );
  }

  runLayout(): Promise<void> {
    return this.ogma.layouts
      .grid({
        rows: 6,
        duration: 300,
        levelDistance: 4,
        sortBy: "id",
      })
      .then(() => {
        this.ogma.view.locateGraph({
          easing: "linear",
          duration: 300,
        });
      });
  }

  addNode(node: Node) {
    const ogmaNode = {
      id: node.id,
      attributes: {},
    };
    let ogmaClass;
    switch (node.nodeType) {
      case NodeType.SOURCE_LOCAL:
        ogmaClass = "source";
        break;
    }
    this.ogma.addNode(ogmaNode).addClass(ogmaClass);
  }

  addEdge(edge: Edge) {
    const ogmaEdge = { id: edge.id, source: edge.src.id, target: edge.dest.id };
    this.ogma.addEdge(ogmaEdge);
  }

  removeNode(node: Node) {}

  removeEdge(edge: Edge) {
    this.ogma.removeEdge(edge.id);
  }
}
