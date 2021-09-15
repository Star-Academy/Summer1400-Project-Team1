import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { map, startWith, switchMap } from "rxjs/operators";
import { PipelineService } from "src/app/services/pipeline.service";
import { AggregateNode , AggregateType} from "../../../../models/graph/processor-nodes/aggregate-node";

interface AggregateOption {
  value: AggregateType;
  viewValue: string;
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
    return this.aggregateNode.inputData.columns.filter((column) =>
      column.toLowerCase().includes(value.toLowerCase())
    );
  }
  onSubmit(){
  if(!this.form.valid)return;
  this.pipelineService.updateAggregateNode(this.pipelineId,this.aggregateNode)
  
  }

  onClose() {}

  onDelete() {}
}
