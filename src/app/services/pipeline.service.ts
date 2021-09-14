import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Dataset } from "../models/dataset";
import { Pipeline, PipelineRow } from "../models/pipeline";
import { Node } from "../models/graph/node";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, switchMap, tap } from "rxjs/operators";
import { TerminalNode } from "../models/graph/terminal-nodes/terminal-node";
import { AggregateNode } from "../models/graph/processor-nodes/aggregate-node";
import {JoinNode} from"../models/graph/processor-nodes/join-node"
import { FilterNode } from "../models/graph/processor-nodes/filter-node";
import { GraphService } from "./graph.service";
import { Edge } from "../models/graph/edge";

@Injectable({
  providedIn: "root",
})
export class PipelineService {"../models/graph/processor-nodes/aggregate-node"
  private readonly BASE_URL = "https://localhost:5001/api/v1/pipeline/";

  private _selectedNode?: Node;
  openSidebar = new Subject<void>();

  private _pipelines!: Pipeline[];

  pipelineRowsChanged = new Subject<PipelineRow[]>();

  constructor(private http: HttpClient,private graphService: GraphService) {
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
    this.http
      .get<Pipeline[]>(this.BASE_URL)
      .subscribe((pipelines) => (this.pipelines = pipelines));
  }

  addPipeline(name: string) {
    this.http
      .post(this.BASE_URL, { Name: name })
      .subscribe(() => this.fetchPipelines());
  }

  deletePipeline(id: number) {
    this.http.delete(this.BASE_URL + id).subscribe(
      () => this.fetchPipelines(),
      () => this.fetchPipelines()
    );
  }

  getPipelineById(id: number) {
    return this.http                            
      .get<Pipeline>(
        this.BASE_URL + id
      )
    }

  editPipelineName(id: number, newName: string) {
    return this.http
      .patch(this.BASE_URL + id, { Name: newName })
      .pipe(switchMap(() => this.getPipelineById(id)));
  }

  setSrcDataset(pipeline: Pipeline, srcId: number) {
    return this.http.patch(this.BASE_URL + pipeline.Id, { SourceId: srcId , Name : pipeline.Name});
  }

  setDestDataset(pipeline: Pipeline, destId: number) {
    return this.http.patch(this.BASE_URL + pipeline.Id, {
      DestinationId: destId,
      Name : pipeline.Name
    });
  }


  postAggregateNode(pipelineId: number, node:AggregateNode,edge:Edge,index: number){
    let body={ 
      "Function":[
          { 
            "type":node.aggregateType,
            "Column":node.column,
            "OutputColumnName":node.outputColumnName
          }
      ],
      "GroupItem":[]
    };
    this.http.post(this.BASE_URL + pipelineId + "/component" + "/?type=aggregate"+`&index=${index}`+`&name=${node.name}`,body).subscribe(
      () => this.graphService.insertNode(node!, edge) ,
    );

        //
  }

  postJoinNodenode(pipelineId: number, node: JoinNode,edge:Edge,index: number) {
    let body={
      SecondTableName:"",
      JoinType:node.joinType,
      FirstTablePk:"",
      SecondTablePk:""
      }
      
    this.http.post(this.BASE_URL + pipelineId + "/component" + "/?type=join"+`&index=${index}`+`&name=${node.name}`,body).subscribe(
      () => this.graphService.insertNode(node!, edge) ,
    );
  }

  postFilterNode(pipelineId: number, node: FilterNode,edge:Edge,index: number) {
    let body={ 
    };
    this.http.post(this.BASE_URL + pipelineId + "/component" + "/?type=filter"+`&index=${index}`+`&name=${node.name}`,body).subscribe(
      () => this.graphService.insertNode(node!, edge) ,
    );
  }
}
