import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Node, NodeType} from "../../../../modals/node";
import {MatDialog} from "@angular/material/dialog";
import {ProcessorDialogComponent} from "./processor-dialog/processor-dialog.component";
import {AddDestinationDialogComponent} from "../add-destination-dialog/add-destination-dialog.component";
import {Dataset} from "src/app/modals/dataset";
import {PipelineService} from "src/app/services/pipeline.service";
import {Alert} from "src/app/utils/alert";
import {MatSnackBar} from "@angular/material/snack-bar";
 import {Join, JoinNode} from "../../../../modals/join-node";
import {Aggregate, AggregateNode} from "../../../../modals/aggregate-node";
import {Filter} from "../../../../modals/filter-node";

@Component({
    selector: "app-node-item",
    templateUrl: "./node-item.component.html",
    styleUrls: ["./node-item.component.scss"],
})
export class NodeItemComponent implements OnInit {
    @Input() node!: Node;
    @Input() index!: number;
    @Input() nodesLength!: number;
    @Output() deleteNode = new EventEmitter<Node>();
    @Output() addNode = new EventEmitter<{ index: number; node: Node }>();

    nodeType!: string;
    destinationNode!: Dataset;
    private processorType: any;

    ngOnInit(): void {
        this.nodeType = this.node.nodeType;
    }

    constructor(
        private pipelineService: PipelineService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {
    }

    onDeleteNode() {
        this.deleteNode.emit(this.node);
    }

    onNodeClick() {
        switch (this.node.id) {
            case -2:
                this.openAddSourceDialog("destination");
                break;
            case -1:
                this.openAddSourceDialog("source");
                break;
        }
        switch (this.node.nodeType) {
            case NodeType.FILTER:
                this.openFilterSideBar(false);
                break;
            case NodeType.JOIN:
                this.openJoinSidebar(false);
                break;
            case NodeType.AGGREGATION:
                this.openAggregateSidebar(false);
                break;
        }

    }

    openAddSourceDialog(source: string) {
        const dialogRef = this.dialog.open(AddDestinationDialogComponent, {
            width: "50vw",
            data: this.destinationNode,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                switch (source) {
                    case "source":
                        this.pipelineService.addSourceDataset(result, true, false);
                        break;
                    case "destination":
                        this.pipelineService.addSourceDataset(result, true, true);

                        break;
                    case "newSource":
                        this.pipelineService.addSourceDataset(result, false, false);
                        break;
                }
            }
        });
    }

    openChooseProcessorDialog(): void {
        if (this.pipelineService.hasSourceNode) {
            const dialogRef = this.dialog.open(ProcessorDialogComponent, {
                width: "250px",
                data: {processorType: this.processorType},
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    let processorType!: NodeType;
                    let node!: Node;
                    switch (result) {
                        case "filter":
                            processorType = NodeType.FILTER;
                            this.openFilterSideBar(true);
                            break;
                        case "join":
                            processorType = NodeType.JOIN;
                            this.openJoinSidebar(true);
                            break;
                        case "aggregation":
                            processorType = NodeType.AGGREGATION;
                            this.openAggregateSidebar(true);
                            break;
                    }
                    node = new Node(this.nodesLength, result, processorType);
                    this.addNode.emit({index: this.index, node});
                }
            });
        } else {
            Alert.showAlert(
                this.snackBar,
                "منبع ورودی را انتخاب کنید",
                "انتخاب",
                4500,
                () => this.openAddSourceDialog("newSource")
            );

            return;
        }
    }

    private openAggregateSidebar(isNew: boolean) {
        this.pipelineService.toggleSideBar.next(true);
        this.pipelineService.currentSidebarProcessor = "aggregate"
        if (isNew) {
            this.pipelineService.currentSidebarProcessorDetail = new AggregateNode(Math.floor(Math.random() * 1000), [
                new Aggregate()
            ]);
        } else {

            this.pipelineService.currentSidebarProcessorDetail =
                this.node.NodeDetail || new AggregateNode(Math.floor(Math.random() * 1000), []);
        }

    }

    private openJoinSidebar(isNew: boolean) {
        this.pipelineService.toggleSideBar.next(true);
        this.pipelineService.currentSidebarProcessor = "join"
        if (isNew) {
            this.pipelineService.currentSidebarProcessorDetail = new JoinNode(Math.floor(Math.random() * 1000), [
                new Join()
            ]);

        } else {
            this.pipelineService.currentSidebarProcessorDetail = this.node.NodeDetail || new JoinNode(Math.floor(Math.random() * 1000), []);
        }
    }

    private openFilterSideBar(isNew: boolean) {
        this.pipelineService.toggleSideBar.next(true);
        this.pipelineService.currentSidebarProcessor = "filter"
        if (isNew) {
            this.pipelineService.currentSidebarProcessorDetail = new Filter(-1);
        } else {
             this.pipelineService.currentSidebarProcessorDetail =
                this.node.NodeDetail || new Filter(-1);
        }
    }
}
