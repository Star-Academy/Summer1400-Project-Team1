import { Injectable } from "@angular/core";
import * as Ogma from "../../assets/ogma.min.js";
import { Node, NodeType } from "../models/graph/node";
import { Edge } from "../models/graph/edge";
import { TerminalNode } from "../models/graph/terminal-nodes/terminal-node";
import { Subject } from "rxjs";

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
      name: "terminal empty",
      nodeAttributes: {
        color: "#f2f2f2",
        text: {
          position: "center",
          content: "Add dataset +",
          color: "#7f7f7f",
        },
        innerStroke: {
          color: "#bfbfbf",
        },
        shape: "square",
      },
    },
    {
      name: "terminal filled",
      nodeAttributes: {
        image: {
          url: "../../assets/images/local-storage.svg",
          scale: 0.5,
        },
        color: "#89c9db",
        text: {
          content: "filled",
          position: "bottom",
        },
        shape: "square",
      },
    },
    {
      name: "filter",
      nodeAttributes: {
        image: {
          url: "../../assets/images/filter.svg",
          scale: 0.5,
        },
      },
    },
    {
      name: "join",
      nodeAttributes: {
        image: {
          url: "../../assets/images/join.svg",
          scale: 0.5,
        },
      },
    },
    {
      name: "aggregate",
      nodeAttributes: {
        image: {
          url: "../../assets/images/aggregate.svg",
          scale: 0.5,
        },
      },
    },
  ];

  colorPalette = {
    innerStroke: "#103183",
    processorNodes: "#e4ebea",
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
          color: this.colorPalette.innerStroke,
        },
        text: {
          size: 25,
          minVisibleSize: 50,
        },
        color: this.colorPalette.processorNodes,
        radius: 5,
      },
      edgeAttributes: {
        shape: {
          style: "dashed",
          head: "arrow",
        },
      },
    });
    this.ogma.styles.setSelectedNodeAttributes(
      { outerStroke: { color: this.colorPalette.outerStroke } },
      true
    );
    this.ogma.styles.setHoveredNodeAttributes(
      {
        innerStroke: {
          width: 4,
        },
        badges: {
          topRight: {
            color: "#fff",
          },
        },
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
        text: {
          content: node.name,
        },
      },
    };
    this.ogma.addNode(ogmaNode);
    this.attachClass(node);
  }

  attachClass(node: Node) {
    let ogmaNode = this.ogma.getNode(node.id);
    let ogmaClass;
    switch (node.nodeType) {
      case NodeType.FILTER:
        ogmaClass = "filter";
        break;
      case NodeType.JOIN:
        ogmaClass = "join";
        break;
      case NodeType.AGGREGATE:
        ogmaClass = "aggregate";
        break;
      default:
        const terminalNode = node as TerminalNode;
        ogmaClass = terminalNode.dataset ? "terminal filled" : "terminal empty";
    }
    ogmaNode.addClass(ogmaClass);
  }

  updateTerminalNode(node: TerminalNode) {
    const prevClass = !node.dataset ? "terminal filled" : "terminal empty";
    const newClass = node.dataset ? "terminal filled" : "terminal empty";
    const ogmaNode = this.ogma.getNode(node.id);
    ogmaNode.removeClass(prevClass);
    ogmaNode.addClass(newClass);
  }

  addEdge(edge: Edge) {
    const ogmaEdge = { id: edge.id, source: edge.src.id, target: edge.dest.id };
    this.ogma.addEdge(ogmaEdge);
  }

  removeNode(node: Node) {
    this.ogma.removeNode(node.id);
  }

  removeEdge(edge: Edge) {
    this.ogma.removeEdge(edge.id);
  }

  unSelectEdge(edge: Edge) {
    this.ogma.getEdge(edge.id).setSelected(false);
  }

  zoomIn() {
    this.ogma.view.zoomIn();
  }

  zoomOut() {
    this.ogma.view.zoomOut();
  }
}
