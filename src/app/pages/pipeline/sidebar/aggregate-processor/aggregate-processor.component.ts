import { Component, Input, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { AggregateNode } from "../../../../models/graph/processor-nodes/aggregate-node";

interface AggregateType {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-aggregate-processor",
  templateUrl: "./aggregate-processor.component.html",
  styleUrls: ["./aggregate-processor.component.scss"],
})
export class AggregateProcessorComponent implements OnInit {
  @Input() aggregateNode!: AggregateNode;
  aggregateTypeControl = new FormControl("", Validators.required);
  aggregateTypes: AggregateType[] = [
    { value: "COUNT", viewValue: "تعداد" },
    { value: "SUM", viewValue: "مجموع" },
    { value: "AVERAGE", viewValue: "میانگین" },
    { value: "MIN", viewValue: "کمترین" },
    { value: "MAX", viewValue: "بیشترین" },
  ];
  myControl = new FormControl();
  filteredColumns!: Observable<string[]>;

  constructor() {}

  ngOnInit(): void {
    this.filteredColumns = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    return this.aggregateNode.inputData.columns.filter((column) =>
      column.toLowerCase().includes(value.toLowerCase())
    );
  }
  onSubmit(form:any){
    console.log(form);
    
  }

  onClose() {}

  onDelete() {}
}
