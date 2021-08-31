import { Injectable } from '@angular/core';
import {Pipeline, PipelineRow} from '../modals/pipeline';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PipelineService {
  pipelineTemp:Pipeline[]=[
    new Pipeline(),
    new Pipeline(),
    new Pipeline(),
    new Pipeline()
  ]
  private _pipelines!:Pipeline[];
  private _pipelineRows!:PipelineRow[];

  pipelineChanged = new Subject<Pipeline[]>();
  pipelineRowsChanged = new Subject<PipelineRow[]>();

  get pipelines(): Pipeline[] {
    return this._pipelines;
  }

  set pipelines(value: Pipeline[]) {
    this._pipelines = value;
    this.pipelineChanged.next(value);
    this.pipelineRows = value.map((pipeline: Pipeline, index) => {
      return new PipelineRow(index+1, pipeline);
    });
  }

  get pipelineRows(): PipelineRow[] {
    return this._pipelineRows;
  }

  set pipelineRows(value: PipelineRow[]) {
    this._pipelineRows = value;
    this.pipelineRowsChanged.next(value);
  }

  constructor() { }

  getPipeline(){
    this.pipelines = this.pipelineTemp;
  }

import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Dataset } from "../modals/dataset";
import { Node, NodeType } from "../modals/node";

@Injectable({
  providedIn: "root",
})
export class PipelineService {
  toggleSideBar = new Subject<{isOpen:boolean,processorType:string}>();

  get destinationDataset(): Dataset {
    return this._destinationDataset;
  }

  set destinationDataset(value: Dataset) {
    this._destinationDataset = value;
    this.destinationDatasetChanged.next(value);
  }

  get sourceDataset(): Dataset {
    return this._sourceDataset;
  }

  set sourceDataset(value: Dataset) {
    this._sourceDataset = value;
    this.sourceDatasetChanged.next(value);
  }

  get hasDestinationNode(): boolean {
    return this._hasDestinationNode;
  }

  get hasSourceNode(): boolean {
    return this._hasSourceNode;
  }

  set hasDestinationNode(value: boolean) {
    this._hasDestinationNode = value;
    this.hasDestinationNodeChanged.next(value);
  }

  set hasSourceNode(value: boolean) {
    this._hasSourceNode = value;
    this.hasSourceNodeChanged.next(value);
  }

  nodesTemp: Node[] = [
    new Node(-1, "دیتاست مبدا", NodeType.SOURCE_LOCAL),
    new Node(-2, "دیتاست مقصد", NodeType.DESTINATION_LOCAL),
  ];
  private _nodes!: Node[];
  private _sourceDataset!: Dataset;
  private _destinationDataset!: Dataset;
  private _hasSourceNode: boolean = false;
  private _hasDestinationNode: boolean = false;

  nodesChanged = new Subject<Node[]>();
  hasSourceNodeChanged = new Subject<boolean>();
  hasDestinationNodeChanged = new Subject<boolean>();
  sourceDatasetChanged = new Subject<Dataset>();
  destinationDatasetChanged = new Subject<Dataset>();

  get nodes(): Node[] {
    return this._nodes;
  }

  set nodes(value: Node[]) {
    this._nodes = value;
    this.checkSourceNodes();
    this.nodesChanged.next(value);
  }

  constructor() {}

  getNodes() {
    this.nodes = this.nodesTemp;
    //TODO handle initial source and destination node
  }

  private checkSourceNodes() {
    if (this.nodes.length > 0) {
      this.hasSourceNode = this.nodes[0].id === -1;
      this.hasDestinationNode = this.nodes[this.nodes.length - 1].id === -2;
    } else {
      this.hasSourceNode = false;
      this.hasDestinationNode = false;
    }
  }

  addNode(node: Node, index: number) {
    this.nodes.splice(index, 0, node);
    this.nodesChanged.next(this.nodes);
  }

  deleteNode(node1: Node) {
    this.nodes = this.nodes.filter((node: Node) => node.id !== node1.id);
  }

  addSourceDataset(
    dataset: Dataset,
    alreadyHasSource: boolean,
    isDestination: boolean
  ) {
    if (alreadyHasSource) {
      this.nodes = this.nodes.map((node: Node) => {
        if (!isDestination) {
          if (node.id === -1) {
            //TODO source type
            return new Node(-1, dataset.name, NodeType.SOURCE_LOCAL);
          }
        } else {
          if (node.id === -2) {
            //TODO source type
            return new Node(-2, dataset.name, NodeType.DESTINATION_LOCAL);
          }
        }
        return node;
      });
    } else {
      if (isDestination) {
        this.addNode(
          new Node(-2, dataset.name, NodeType.DESTINATION_LOCAL),
          this.nodes.length
        );
        this.hasDestinationNode = true;
      } else {
        this.addNode(new Node(-1, dataset.name, NodeType.SOURCE_LOCAL), 0);
        this.hasSourceNode = true;
      }
    }

    // if (!isDestination) {
    //     if (alreadyHasSource) {
    //         this.nodes = this.nodes.map((node: Node) => {
    //             if (node.id === -1) {
    //                 //TODO source type
    //                 return new Node(-1, dataset.name, NodeType.SOURCE_LOCAL)
    //             } else {
    //                 return node;
    //             }
    //         });
    //     } else {
    //         //TODO source type
    //         this.addNode(new Node(-1, dataset.name, NodeType.SOURCE_LOCAL), 0)
    //         this.hasSourceNode = true;
    //     }
    // } else {
    // }
  }
}
