import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import {
  Filter,
  FilterOperand,
} from "../../../../../models/graph/processor-nodes/filter-node";

interface Operator {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-filter-item",
  templateUrl: "./filter-item.component.html",
  styleUrls: ["./filter-item.component.scss"],
})
export class FilterItemComponent implements OnInit {
  @Input() filter!: FilterOperand;
  @Output() deleteFilter = new EventEmitter<Filter>();
  operatorControl = new FormControl("", Validators.required);

  myControl = new FormControl();
  myControl1 = new FormControl();
  options: string[] = ["One", "Two", "Three"];

  filteredOptions!: Observable<string[]>;
  operators: Operator[] = [
    { value: ">", viewValue: "کوچکتر" },
    { value: "<", viewValue: "بزرگتر" },
    { value: "=", viewValue: "برابر" },
  ];
  constructor() {}

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onDelete(event: Event) {
    this.deleteFilter.emit(this.filter);
    event.stopPropagation();
  }
}
