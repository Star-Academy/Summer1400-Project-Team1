import { Component, Input, OnInit, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Node, NodeType } from "../../../models/graph/node";
import { Observable } from "rxjs";
import { PipelineService } from "../../../services/pipeline.service";
import { GraphService } from "../../../services/graph.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogDeleteNodeDialog } from "./dialog-delete-node/dialog-delete-node-dialog.component";
import { Pipeline } from "src/app/models/pipeline";
import { FilterNode } from "src/app/models/graph/processor-nodes/filter-node";
import { AggregateNode } from "src/app/models/graph/processor-nodes/aggregate-node";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
    @Input() pipeline!: Pipeline;
    @Output() openChooseProcessorDialog = new EventEmitter<void>();

    constructor(
        public pipelineService: PipelineService,
        public graphService: GraphService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {}

    openDialog() {
        const dialogRef = this.dialog.open(DialogDeleteNodeDialog);
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                let node = this.pipelineService.selectedNode;
                this.pipelineService
                    .deleteNode(
                        this.pipeline.Id,
                        this.graphService.getNodeIndex(node)
                    )
                    .toPromise()
                    .then(() => this.graphService.removeNode(node));
            }
        });
    }

    updateNode() {
        const node = this.pipelineService.selectedNode;
        console.log(node);
        
        switch (node.nodeType) {
            case NodeType.FILTER:
                this.pipelineService.updateFilterNode(
                    this.pipeline.Id,
                    node as FilterNode,
                    this.graphService.getNodeIndex(node)
                );
                break;
                case NodeType.AGGREGATE:
                    
                    this.pipelineService.updateAggregateNode(
                        this.pipeline.Id,
                        node as AggregateNode,
                        this.graphService.getNodeIndex(node)
                    );
                    break;

            default:
                break;
        }
    }

    get NodeType() {
        return NodeType;
    }
}
