import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, NgForm, Validators } from "@angular/forms";
import { MatChipInputEvent} from "@angular/material/chips";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { map, startWith, switchMap } from "rxjs/operators";
import { PipelineService } from "src/app/services/pipeline.service";
import { AggregateNode , AggregateType} from "../../../../models/graph/processor-nodes/aggregate-node";

interface AggregateOption {
  value: AggregateType;
  viewValue: string;
}

export interface GroupByColumn {
  name: string;
}


@Component({
  selector: "app-aggregate-processor",
  templateUrl: "./aggregate-processor.component.html",
  styleUrls: ["./aggregate-processor.component.scss"],
})
export class AggregateProcessorComponent implements OnInit {
  @Input() aggregateNode!: AggregateNode;
  @ViewChild("form", { static: false }) form!: NgForm;
  pipelineId!: number
  

  aggregateTypeControl = new FormControl("", Validators.required);
  aggregateOptions: AggregateOption[] = [
    { value: AggregateType.COUNT, viewValue: "تعداد" },
    { value: AggregateType.SUM, viewValue: "مجموع" },
    { value: AggregateType.AVREAGE, viewValue: "میانگین" },
    { value: AggregateType.MIN, viewValue: "کمترین" },
    { value: AggregateType.MAX, viewValue: "بیشترین" },
  ];
  myControl = new FormControl();
  filteredColumns!: Observable<string[]>;

  selectable = true;
  removable = true;
  addOnBlur = true;
 
  separatorKeysCodes: number[] = [ENTER, COMMA];
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.aggregateNode.groupByColumns.push({name: value});
    }

    event.chipInput!.clear();
  }

  remove(column: GroupByColumn): void {
    const index = this.aggregateNode.groupByColumns.indexOf(column);

    if (index >= 0) {
      this.aggregateNode.groupByColumns.splice(index, 1);
    }
  }

  constructor(    public router: Router,
    public pipelineService: PipelineService,
    public route: ActivatedRoute) {}

  ngOnInit(): void {
      
   this.pipelineId= +this.route.snapshot.paramMap.get('id')!
      
    this.filteredColumns = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    return this.aggregateNode.inputData.columns.filter((column) => {}
    );
  }
  onSubmit(){
  if(!this.form.valid)return;
  //this.pipelineService.updateAggregateNode(this.pipelineId,this.aggregateNode)
  
  }

  onClose() {}

  onDelete() {}
}
