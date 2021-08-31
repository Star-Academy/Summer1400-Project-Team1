import {Component, Input, OnInit, Output} from "@angular/core";
import {Node, NodeType} from "src/app/modals/node";
import {ProcessorDialogComponent} from "../pipeline-graph/node-item/processor-dialog/processor-dialog.component";
import {Alert} from "../../../utils/alert";
import {PipelineService} from "../../../services/pipeline.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EventEmitter} from "@angular/core";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
    @Input() processType!: string;
    @Output() openChooseProcessorDialog = new EventEmitter<void>();

    constructor() {
    }

    ngOnInit(): void {
    }


    openDialog() {
        this.openChooseProcessorDialog.emit();
    }
}
