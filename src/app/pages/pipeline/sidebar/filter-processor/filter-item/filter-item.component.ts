import {Component, Input, OnInit} from '@angular/core';
import {Filter} from "../../../../../modals/filter-node";
import {FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-filter-item',
  templateUrl: './filter-item.component.html',
  styleUrls: ['./filter-item.component.scss']
})
export class FilterItemComponent implements OnInit {
  @Input() index!: number;
  @Input() length!: number;
  @Input() item!: Filter;
  logicExp?: string;
  panelOpenState: boolean = true;
  operatorControl = new FormControl('', Validators.required);
  // operators: Operator[] = Operator.operators
  operators =[">","<","=="]
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;

  constructor() { }

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
  onDelete() {

  }
}
