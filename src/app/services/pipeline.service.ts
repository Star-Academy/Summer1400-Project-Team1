import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Dataset } from "../models/dataset";
import { Pipeline, PipelineRow } from "../models/pipeline";
import { Node } from "../models/graph/node";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PipelineService {

  private readonly BASE_URL = "https://localhost:5001/api/v1/pipeline/";

  private _selectedNode?: Node;
  openSidebar = new Subject<void>();

  private _pipelines!: Pipeline[];

  pipelineRowsChanged = new Subject<PipelineRow[]>();

  constructor(private http: HttpClient) {
    this.fetchPipelines();
  }

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
    this.pipelineRows = value.map((pipeline: Pipeline, index) => {
      return new PipelineRow(index + 1, pipeline);
    });
  }

  set pipelineRows(value: PipelineRow[]) {
    this.pipelineRowsChanged.next(value);
  }

  fetchPipelines() {
    this.http.get<Pipeline[]>(this.BASE_URL).subscribe(
      (pipelines) => this.pipelines = pipelines
    );
  }

  addPipeline(name: string) {
    this.http.post(this.BASE_URL, {Name: name}).subscribe(
        () => this.fetchPipelines()
    );
  }

  deletePipeline(id: number) {
    this.http.delete(this.BASE_URL + id).subscribe(
        () => this.fetchPipelines(),
        () => this.fetchPipelines(),
    )
  }

}
