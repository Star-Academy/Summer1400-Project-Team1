import {Component, OnDestroy, OnInit} from '@angular/core';

import { Subscription} from 'rxjs';
import {Filter, FilterNode} from "../../../../modals/filter-node";
import {PipelineService} from "../../../../services/pipeline.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
 import {AddFilterDialogComponent} from "./add-filter-dialog/add-filter-dialog.component";




@Component({
    selector: 'app-filter-processor',
    templateUrl: './filter-processor.component.html',
    styleUrls: ['./filter-processor.component.scss'],
})
export class FilterProcessorComponent implements OnInit,OnDestroy {

    filtersList: Filter[] = []
    filtersListSub!: Subscription;

    constructor(private pipelineService:PipelineService,
                public dialog: MatDialog,
                private snackBar: MatSnackBar,
     ) {

    }

    ngOnInit(): void {

        this.filtersList = (this.pipelineService.currentSidebarProcessorDetail as FilterNode).filtersList;
        this.filtersListSub = this.pipelineService.currentSidebarProcessorDetailChanged.subscribe((details: any) => {
            this.filtersList = details.filtersList;
        });
    }

    ngOnDestroy(): void {
        this.filtersListSub.unsubscribe();
    }

    openAddFilterDialog() {
        const dialogRef = this.dialog.open(AddFilterDialogComponent, { disableClose: true,
            panelClass: 'add-filter-dialog'
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {

            }
        });
    }
}
