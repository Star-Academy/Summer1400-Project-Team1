import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Dataset } from "../models/dataset";
import { Pipeline, PipelineRow } from "../models/pipeline";
import { Node } from "../models/graph/node";

@Injectable({
  providedIn: "root",
})
export class PipelineService {
  private selectedNodeSource = new Subject<Node>();
  public selectedNode$ = this.selectedNodeSource.asObservable();

  private _nodes!: Node[];
  private _sourceDataset!: Dataset;
  private _destinationDataset!: Dataset;
  private _hasSourceNode: boolean = false;
  private _hasDestinationNode: boolean = false;
  private _currentSidebarProcessor: string = "initial";
  currentSidebarProcessorChanged = new Subject<string>();
  nodesChanged = new Subject<Node[]>();
  hasSourceNodeChanged = new Subject<boolean>();
  hasDestinationNodeChanged = new Subject<boolean>();
  sourceDatasetChanged = new Subject<Dataset>();
  destinationDatasetChanged = new Subject<Dataset>();
  pipelineTemp: Pipeline[] = [
    new Pipeline(),
    new Pipeline(),
    new Pipeline(),
    new Pipeline(),
  ];
  private _pipelines!: Pipeline[];
  private _pipelineRows!: PipelineRow[];

  pipelineChanged = new Subject<Pipeline[]>();
  pipelineRowsChanged = new Subject<PipelineRow[]>();

  selectNode(node: Node) {
    this.selectedNodeSource.next(node);
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  constructor() {}

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
      return new PipelineRow(index + 1, pipeline);
    });
  }

  get pipelineRows(): PipelineRow[] {
    return this._pipelineRows;
  }

  set pipelineRows(value: PipelineRow[]) {
    this._pipelineRows = value;
    this.pipelineRowsChanged.next(value);
  }

  getPipeline() {
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
}
