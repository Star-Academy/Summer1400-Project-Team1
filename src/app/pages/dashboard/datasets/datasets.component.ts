import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import { DatasetRow} from 'src/app/modals/dataset';
import {DatasetService} from 'src/app/services/dataset.service';

@Component({
    selector: 'app-datasets',
    templateUrl: './datasets.component.html',
    styleUrls: ['./datasets.component.scss'],
})
export class DatasetsComponent implements OnInit, OnDestroy {

    datasetsRows!: DatasetRow[];
    datasetsRowsSub!: Subscription;

    displayedColumns: string[] = ['شماره', 'نام پایگاه', 'نام اتصال', 'تاریخ ساخت'];

    constructor(private datasetService: DatasetService) {}

    ngOnInit(): void {
        this.datasetService.getDatasets();
        this.datasetsRows = this.datasetService.datasetsRows;
        this.datasetsRowsSub = this.datasetService.datasetsRowsChanged.subscribe((datasetsRows: DatasetRow[]) => {
            this.datasetsRows = datasetsRows;
         });
    }

    onUpload(event: any) {
        if (event.target !== null)
            console.log(event.target.files);
    }

    onDatasetClick(row: DatasetRow) {
        console.log(row.dataset.name);
     }


    ngOnDestroy(): void {
        this.datasetsRowsSub.unsubscribe();
    }
}
