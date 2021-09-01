import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {Operator} from "../../../../utils/operators";
import {Filter, FilterNode} from "../../../../modals/filter-node";
import { PipelineService } from 'src/app/services/pipeline.service';


@Component({
    selector: 'app-filter-processor',
    templateUrl: './filter-processor.component.html',
    styleUrls: ['./filter-processor.component.scss']
})
export class FilterProcessorComponent implements OnInit, OnDestroy {

    panelOpenState: boolean = true;
     operatorControl = new FormControl('', Validators.required);
    // operators: Operator[] = Operator.operators
    operators =[">","<","=="]
    myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions!: Observable<string[]>;
    filtersList: Filter[] = []

    filtersListSub!: Subscription;
    constructor(private pipelineService:PipelineService) {
    }

    ngOnInit(): void {
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );
        this.filtersList = (this.pipelineService.currentSidebarProcessorDetail as FilterNode).filtersList;
        this.filtersListSub = this.pipelineService.currentSidebarProcessorDetailChanged.subscribe((details: any) => {
           this.filtersList = details.filtersList;
        });
    }

    ngOnDestroy(): void {
        this.filtersListSub.unsubscribe();
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
