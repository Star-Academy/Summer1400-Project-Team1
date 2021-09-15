import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Dataset } from "../models/dataset";
import { Pipeline, PipelineRow } from "../models/pipeline";
import { Node } from "../models/graph/node";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, switchMap, tap } from "rxjs/operators";
import { TerminalNode } from "../models/graph/terminal-nodes/terminal-node";
import { AggregateNode } from "../models/graph/processor-nodes/aggregate-node";
import { JoinNode } from "../models/graph/processor-nodes/join-node";
import { FilterNode } from "../models/graph/processor-nodes/filter-node";
import { GraphService } from "./graph.service";
import { Edge } from "../models/graph/edge";
import { ProcessorNode } from "../models/graph/processor-nodes/processor-node";

@Injectable({
    providedIn: "root",
})
export class PipelineService {
    "../models/graph/processor-nodes/aggregate-node";
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
        return this.http.get<Pipeline>(this.BASE_URL + id);
    }

    editPipelineName(id: number, newName: string) {
        return this.http
            .patch(this.BASE_URL + id, { Name: newName })
            .pipe(switchMap(() => this.getPipelineById(id)));
    }

    setSrcDataset(pipeline: Pipeline, srcId: number) {
        return this.http.patch(this.BASE_URL + pipeline.Id, {
            SourceId: srcId,
            Name: pipeline.Name,
        });
    }

    setDestDataset(pipeline: Pipeline, destId: number) {
        return this.http.patch(this.BASE_URL + pipeline.Id, {
            DestinationId: destId,
            Name: pipeline.Name,
        });
    }

    deleteNode(pipelineId: number, OrderId: number) {
      return this.http.delete(this.BASE_URL +  pipelineId + "/component/" + OrderId)
    }

    getComponentById(componentId: number,pipelineId:number) {        
        this.http.get(this.BASE_URL + pipelineId + "/component/" + componentId ).subscribe(responseData=>{
            console.log("data",responseData);
            
        })
    }

    postAggregateNode(pipelineId: number, node: AggregateNode, index: number) {
        let body = {
            Function: [
                {
                    type: node.aggregateType,
                    Column: node.column,
                    OutputColumnName: node.outputColumnName,
                },
            ],
            GroupItem: [],
        };
        return this.http
            .post(
                this.BASE_URL +
                    pipelineId +
                    "/component" +
                    "/?type=aggregate" +
                    `&index=${index}` +
                    `&name=${node.name}`,
                body
            )
    }
    updateAggregateNode(pipelineId: number, node: AggregateNode) {        
        let body = {
            Function: [
                {
                    type: node.aggregateType,
                    Column: node.column,
                    OutputColumnName: node.outputColumnName,
                },
            ],
            GroupItem: [],
        };
        return this.http
            .patch(
                this.BASE_URL +
                    pipelineId +
                    "/component" +
                    4,
                body
            )
    }

    updateJoinNode(pipelineId: number, node: JoinNode, orderId: number) {  
        console.log(node);
              
        let body = {
            SecondTableName: "",
            JoinType: node.joinType,
            FirstTablePk: "",
            SecondTablePk: "",
        };
        return this.http.patch(this.BASE_URL + pipelineId + "/component" + node.id,body)
    
    }
    postJoinNode(
        pipelineId: number,
        node: JoinNode,
        index: number
    ) {
        let body = {
            SecondTableName: "",
            JoinType: node.joinType,
            FirstTablePk: "",
            SecondTablePk: "",
        };
        return this.http.post(this.BASE_URL + pipelineId + "/component" + "/?type=join"+`&index=${index}`+`&name=${node.name}`,body)
         
    
    }

    postFilterNode(
        pipelineId: number,
        node: FilterNode,
        index: number
    ) {
        let body = {};

        return this.http
            .post(
                this.BASE_URL +
                    pipelineId +
                    "/component" +
                    "/?type=join" +
                    `&index=${index}` +
                    `&name=${node.name}`,
                body
            )
        // this.http.post(this.BASE_URL + pipelineId + "/component" + "/?type=filter"+`&index=${index}`+`&name=${node.name}`,body).subscribe(
        //   () => this.graphService.insertNode(node!, edge) ,
        // );
    }

    updateFilterNode(pipelineId: number, filterNode: FilterNode, orderId: number) {
        const body = {
            
        }
        return this.http.patch(this.BASE_URL + pipelineId + "component/" + orderId, {

        })
    }

}
