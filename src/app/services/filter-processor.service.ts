import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ConditionType, Filter, Operator} from "../modals/filter-node";
import {PipelineService} from './pipeline.service';


@Injectable({
    providedIn: 'root'
})
export class FilterProcessorService {

    dataChange = new BehaviorSubject<Filter>(new Filter(-1));

    get data(): Filter {
        return this.dataChange.value;
    }

    constructor(private pipelineService: PipelineService) {
        pipelineService.currentSidebarProcessorDetailChanged.subscribe((filter: any) => {
            this.dataChange.next(filter as Filter)
        })
    }


    addFilter(parentFilter: Filter) {
        parentFilter.children.push(new Filter(0, undefined, undefined,
            "", Operator.NO_VALUE, ""));
        this.dataChange.next(this.data);
    }


    applyChanges() {
        //TODO apply new changes into pipeline nodes
    }

    removeParent(parentFilter: Filter) {
        // parentFilter.deleteFilter()
        // this.data.children.forEach(filter1=>{
        //     console.log("aaaaaaaaa")
        //     filter1.children.filter(filter=>filter.id!==-1);
        // })
        // this.dataChange.next(this.data);
    }


    addLogicFilter(parentFilter: Filter, conditionType: ConditionType) {
        parentFilter.children.push(new Filter(0, conditionType, [
            new Filter(0,)
        ],));
        this.dataChange.next(this.data);
    }

    createRoot(root: string) {
        switch (root) {
            case 'FILTER':
                this.dataChange.next(new Filter(0));
                break;
            case 'AND':
                this.dataChange.next(new Filter(0, ConditionType.AND, [
                    new Filter(0)
                ]))
                break;
            case 'OR':
                this.dataChange.next(new Filter(0, ConditionType.OR, [
                    new Filter(0)
                ]))
                break;

        }
    }

    addRoot(logic: ConditionType) {
        this.dataChange.next(new Filter(0, logic, [
            this.data
        ]))

    }

    updateFilter(newFilter: Filter, currentFilter: Filter) {
        currentFilter.key = newFilter.key;
        currentFilter.operator = newFilter.operator;
        currentFilter.value = newFilter.value;
        this.dataChange.next(this.data);
    }
}

/*
* parent{
* ////
* children:[
* (),
* ()
* ]
* }
*
*
*
* */
