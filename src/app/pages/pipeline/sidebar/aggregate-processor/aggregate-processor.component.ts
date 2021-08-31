import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

interface AggregateType {
    name: string;
}

@Component({
    selector: 'app-aggregate-processor',
    templateUrl: './aggregate-processor.component.html',
    styleUrls: ['./aggregate-processor.component.scss']
})
export class AggregateProcessorComponent implements OnInit {

    constructor() {
    }

    panelOpenState: boolean = true;
    filterProcessorList = [1, 2, 3, 4, 5]
    aggregateTypeControl = new FormControl('', Validators.required);
    aggregateTypes: AggregateType[] = [
        {name: 'COUNT'},
        {name: 'SUM'},
        {name: 'AVERAGE'},
        {name: 'MIN'},
        {name: 'MAX'},

    ];
    myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions!: Observable<string[]>;

    ngOnInit(): void {
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    onClose() {

    }

    onDelete() {

    }

    onAddFilter() {

    }


}
