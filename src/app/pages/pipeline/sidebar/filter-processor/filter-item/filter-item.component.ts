import { Component, Input, OnInit } from "@angular/core";
import { Filter } from "../../../../../models/filter-node";
import { FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-filter-item",
  templateUrl: "./filter-item.component.html",
  styleUrls: ["./filter-item.component.scss"],
})
export class FilterItemComponent implements OnInit {
  @Input() index!: number;
  @Input() length!: number;
  @Input() item!: Filter;

  panelOpenState: boolean = true;

  operatorControl = new FormControl("", Validators.required);

  myControl = new FormControl();
  myControl1 = new FormControl();
  options: string[] = ["One", "Two", "Three"];

  operators = [">", "<", "=="];
  filteredOptions!: Observable<string[]>;

  logicExp?: string;
  operator1!: string;

  constructor() {}

  ngOnInit(): void {
    this.operator1 = this.item.operator;

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
  onDelete() {}
}
