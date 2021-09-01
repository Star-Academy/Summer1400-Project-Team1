

import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Dataset } from "../modals/dataset";
import { Node, NodeType } from "../modals/node";
import {Pipeline, PipelineRow} from "../modals/pipeline";
import {Filter, FilterNode} from "../modals/filter-node";
import {Join, JoinNode} from "../modals/join-node";
import {Aggregate, AggregateNode} from "../modals/aggregate-node";

@Injectable({
  providedIn: "root",
})
export class PipelineService {


  nodesTemp: Node[] = [
    new Node(-1, "دیتاست مبدا", NodeType.SOURCE_LOCAL),
    new Node(1, "filter", NodeType.FILTER,new FilterNode(1,[
        new Filter(1,"a",">","2"),
        new Filter(2,"b","==","5"),
    ])),
    new Node(4, "filter2", NodeType.FILTER,new FilterNode(2,[
      new Filter(3,"c","<","20"),
     ])),
    new Node(2, "join", NodeType.JOIN,new JoinNode(1,[
        new Join(1,new Dataset(),"Inner join","q"),
      new Join(2,new Dataset(),"Outer join","p"),
    ])),
    new Node(5, "join", NodeType.JOIN,new JoinNode(2,[
      new Join(3,new Dataset(),"Right outer join","p"),
    ])),
    new Node(6, "aggregate", NodeType.AGGREGATION,new AggregateNode(1,[
        new Aggregate(1,"aa","MAX","w"),
      new Aggregate(2,"bb","MIN","s"),
    ])),
    new Node(7, "aggregate", NodeType.AGGREGATION,new AggregateNode(2,[
      new Aggregate(3,"cc","SUM","f"),
     ])),
    new Node(-2, "دیتاست مقصد", NodeType.DESTINATION_LOCAL),
  ];
  private _nodes!: Node[];
  private _sourceDataset!: Dataset;
  private _destinationDataset!: Dataset;
  private _hasSourceNode: boolean = false;
  private _hasDestinationNode: boolean = false;
  private _currentSidebarProcessor:string = "initial";
  private _currentSidebarProcessorDetail!:FilterNode|JoinNode|AggregateNode ;
  currentSidebarProcessorChanged = new Subject<string>();
  currentSidebarProcessorDetailChanged = new Subject<FilterNode|JoinNode|AggregateNode>(); //
  nodesChanged = new Subject<Node[]>();
  hasSourceNodeChanged = new Subject<boolean>();
  hasDestinationNodeChanged = new Subject<boolean>();
  sourceDatasetChanged = new Subject<Dataset>();
  destinationDatasetChanged = new Subject<Dataset>();
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

  get currentSidebarProcessorDetail(): FilterNode | JoinNode | AggregateNode {
    return this._currentSidebarProcessorDetail;
  }

  set currentSidebarProcessorDetail(value: FilterNode | JoinNode | AggregateNode) {
    this._currentSidebarProcessorDetail = value;
    this.currentSidebarProcessorDetailChanged.next(value);
  }

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
  get currentSidebarProcessor(): string {
    return this._currentSidebarProcessor;
  }

  set currentSidebarProcessor(value: string) {
    this._currentSidebarProcessor = value;
    this.currentSidebarProcessorChanged.next(value);
  }

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


  getPipeline(){
    this.pipelines = this.pipelineTemp;
  }

  toggleSideBar = new Subject<boolean>();

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


  }
}
