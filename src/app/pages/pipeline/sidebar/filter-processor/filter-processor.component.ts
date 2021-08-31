import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

interface Operator {
    symbol: string;
    name: string;
}

@Component({
    selector: 'app-filter-processor',
    templateUrl: './filter-processor.component.html',
    styleUrls: ['./filter-processor.component.scss']
})
export class FilterProcessorComponent implements OnInit {

    constructor() {
    }

    panelOpenState: boolean = true;
    filterProcessorList = [1,2,3,4,5]
    operatorControl = new FormControl('', Validators.required);
    operators: Operator[] = [
        {symbol: '==', name: 'equal'},
        {symbol: '>', name: 'less'},
        {symbol: '<', name: 'grater'},
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
