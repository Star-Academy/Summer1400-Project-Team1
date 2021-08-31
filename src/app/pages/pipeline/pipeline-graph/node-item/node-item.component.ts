import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Node, NodeType} from "../../../../modals/node";
import {MatDialog} from "@angular/material/dialog";
import {ProcessorDialogComponent} from "./processor-dialog/processor-dialog.component";
import {AddDestinationDialogComponent} from "../add-destination-dialog/add-destination-dialog.component";
import {Dataset} from "src/app/modals/dataset";
import {PipelineService} from "src/app/services/pipeline.service";
import {Alert} from "src/app/utils/alert";
import {MatSnackBar} from "@angular/material/snack-bar";

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

    constructor(
        public dialog: MatDialog,
        private pipelineService: PipelineService,
        private snackBar: MatSnackBar
    ) {
    }

    ngOnInit(): void {
        this.nodeType = this.node.nodeType;
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
                this.openFilterSideBar();
                break;
            case NodeType.JOIN:
                this.openJoinSidebar();
                break;
            case NodeType.AGGREGATION:
                this.openAggregateSidebar();
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
                            this.openFilterSideBar();
                            break;
                        case "join":
                            processorType = NodeType.JOIN;
                            this.openJoinSidebar();
                            break;
                        case "aggregation":
                            processorType = NodeType.AGGREGATION;
                            this.openAggregateSidebar();
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

    private openAggregateSidebar() {
        this.pipelineService.toggleSideBar.next(true);
        this.pipelineService.currentSidebarProcessor = "aggregate"
    }

    private openJoinSidebar() {
        this.pipelineService.toggleSideBar.next(true);
        this.pipelineService.currentSidebarProcessor = "join"
    }

    private openFilterSideBar() {
        this.pipelineService.toggleSideBar.next(true);
        this.pipelineService.currentSidebarProcessor = "filter"
    }
}
