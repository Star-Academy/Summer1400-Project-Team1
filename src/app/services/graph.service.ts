import { Injectable } from "@angular/core";
import { OgmaService } from "./ogma.service";
import { Node, NodeType } from "../models/graph/node";
import { Edge } from "../models/graph/edge";
import { SourceNode } from "../models/graph/terminal-nodes/source-node";
import { DestinationNode } from "../models/graph/terminal-nodes/destination-node";
import { TerminalNode } from "../models/graph/terminal-nodes/terminal-node";
import { DialogProcessorSelectDialog } from "../pages/pipeline/pipeline-graph/processor-dialog/dialog-processor-select-dialog.component";
import { DialogSelectDatasetDialog } from "../pages/pipeline/pipeline-graph/add-destination-dialog/dialog-select-dataset-dialog.component";
import {
    Filter,
    FilterNode,
    FilterOperator,
} from "../models/graph/processor-nodes/filter-node";
import { JoinNode } from "../models/graph/processor-nodes/join-node";
import { AggregateNode } from "../models/graph/processor-nodes/aggregate-node";
import { MatDialog } from "@angular/material/dialog";
import { Dataset } from "../models/dataset";
import { PipelineService } from "./pipeline.service";
import { pipe, Subject, Subscription } from "rxjs";
import { Pipeline } from "../models/pipeline";
import { switchMap } from "rxjs/operators";
import { ProcessorNode } from "../models/graph/processor-nodes/processor-node";
import { Component } from "../models/Component";

@Injectable({
    providedIn: "root",
})
export class GraphService {
    path: Node[] = [];
    edges: Edge[] = [];

    clickedNode = new Subject<Node>();
    clickedEdge = new Subject<Edge>();

    constructor(
        private ogmaService: OgmaService,
        private pipelineService: PipelineService
    ) {}

    constructGraph(container: HTMLElement) {
        this.ogmaService.initConfig({
            container: container,
        });
        this.ogmaService.ogma.events.onClick((event) =>
            this.handleEvents(event)
        );
    }

    async initGraph(pipeline: Pipeline) {
        this.path = [];
        this.edges = [];
        const srcNode = new SourceNode(pipeline.Source?.Name, pipeline.Source);
        const destNode = new DestinationNode(
            pipeline.Destination?.Name,
            pipeline.Destination
        );
        this.addNode(srcNode, 0);
        let lastNode: ProcessorNode = srcNode;
        let sortedPipeLine = pipeline.Components.sort(function (a, b) {
            return a.OrderId - b.OrderId;
        });
        for (const [index, component] of sortedPipeLine.entries()) {
          let currentNode = await this.createNode(pipeline, component);
          this.addNode(currentNode, index + 1);
            this.addEdge(new Edge(lastNode, currentNode));
            lastNode = currentNode;
        }
        this.addNode(destNode, pipeline.Components.length + 1);
        this.addEdge(new Edge(lastNode, destNode));
        return this.runLayout();
    }

    async createNode(pipeline: Pipeline, component: Component) {
         let node: ProcessorNode;
        switch (component.Type) {
            case 0:
              node = await this.createAggregateNode(pipeline, component);
              break;
            case 1:
              node = await this.createFilterNode(pipeline, component);
              break;
            default:
              node = await this.createJoinNode(pipeline, component);
        }
        return node
    }

    async createAggregateNode(pipeline: Pipeline, component: Component) {
    let node:AggregateNode= new AggregateNode(component.Name);

    await this.pipelineService.getComponentById(component.OrderId,pipeline.Id).then((res:any) => {
         node.aggregateType = res.component.aggregateFunctions[0].aggregationType;
        node.column = res.component.aggregateFunctions[0].columnName;
        node.outputColumnName= res.component.aggregateFunctions[0].outputColumnName;
        res.component.groupByItems.forEach(element => {
           node.groupByColumns.push({name: element.columnName})
        });

     })
      
      return node;
    }

    async createJoinNode(pipeline: Pipeline, component: Component) {
        let node:JoinNode= new JoinNode(component.Name);

        await this.pipelineService.getComponentById(component.OrderId,pipeline.Id).then((res:any) => {
             console.log(res);
             node.joinType = res.component.joinType;
             node.firstDatasetPK=res.component.firstTablePk;
             node.secondDatasetPK=res.component.secondTablePk;
             node.secondDataset= new Dataset(-1,res.component.secondTableName,"","")
             
         })
          
          return node;
    }

    async createFilterNode(pipeline: Pipeline, component: Component) {
 
        const filterTree = await this.pipelineService
            .getComponentById(component.OrderId, pipeline.Id)
            .then((res: any) => JSON.parse(res.component.query));
            console.log(filterTree);
            return new FilterNode(component.Name)
    }


    runLayout(): Promise<void> {
        return this.ogmaService.runLayout();
    }

    getPlacingIndex(edge: Edge) {
        return this.path.indexOf(edge.src);
    }

    getNodeIndex(node: ProcessorNode) {
        return this.path.indexOf(node) - 1;
    }

    handleEvents(event) {
        if (!event.target) return;
        if (event.target.isNode) {
            const index = this.path.findIndex(
                (node) => node.id == event.target.getId()
            );
            this.onNodeClicked(this.path[index]);
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
        this.clickedEdge.next(edge);
    }

    insertNode(node: Node, edge: Edge) {
        this.removeEdge(edge);
        this.addNode(node, this.path.indexOf(edge.src) + 1);
        this.addEdge(new Edge(edge.src, node));
        this.addEdge(new Edge(node, edge.dest));
        this.pipelineService.selectedNode = node;

        return this.runLayout();
    }

    removeNode(node: Node) {
        this.path = this.path.filter((el) => el !== node);
        this.ogmaService.removeNode(node);
        this.attachAdjacentNodes(node);
        this.pipelineService.selectedNode = undefined!;
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

    addNode(node: Node, index: number) {
        this.path.splice(index, 0, node);
        this.ogmaService.addNode(node);
    }

    addEdge(edge: Edge) {
        this.edges.push(edge);
        this.ogmaService.addEdge(edge);
    }
}
