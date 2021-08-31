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

}
