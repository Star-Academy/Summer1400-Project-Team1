import {Component, Input, OnInit, Output} from "@angular/core";
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
