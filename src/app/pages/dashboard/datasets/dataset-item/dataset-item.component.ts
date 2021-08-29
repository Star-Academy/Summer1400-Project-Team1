import {Component, Input, OnInit} from '@angular/core';
import {Dataset} from '../../../../modals/dataset';

@Component({
    selector: 'app-dataset-item',
    templateUrl: './dataset-item.component.html',
    styleUrls: ['./dataset-item.component.scss'],
})
export class DatasetItemComponent implements OnInit {
    @Input() item!: Dataset;

    constructor() {
    }

    ngOnInit(): void {
    }

}
