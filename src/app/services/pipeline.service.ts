import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Dataset } from "../models/dataset";
import { Pipeline, PipelineRow } from "../models/pipeline";
import { Node } from "../models/graph/node";

@Injectable({
  providedIn: "root",
})
export class PipelineService {
  private _selectedNode?: Node;
  openSidebar = new Subject<void>();

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

  constructor() {}

  get selectedNode(): Node {
    return this._selectedNode!;
  }

  set selectedNode(value: Node) {
    this._selectedNode = value;
    this.openSidebar.next();
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
}
