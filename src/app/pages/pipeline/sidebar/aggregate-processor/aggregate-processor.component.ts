import { Component, Input, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { PipelineService } from "../../../../services/pipeline.service";
import { Aggregate } from "../../../../models/aggregate-node";
import { AggregateNode } from "../../../../models/graph/processor-nodes/aggregate-node";

interface AggregateType {
  name: string;
}

@Component({
  selector: "app-aggregate-processor",
  templateUrl: "./aggregate-processor.component.html",
  styleUrls: ["./aggregate-processor.component.scss"],
})
export class AggregateProcessorComponent implements OnInit {
  @Input() aggregateNode!: AggregateNode;

  panelOpenState: boolean = true;
  aggregateTypeControl = new FormControl("", Validators.required);
  aggregateTypes: AggregateType[] = [
    { name: "COUNT" },
    { name: "SUM" },
    { name: "AVERAGE" },
    { name: "MIN" },
    { name: "MAX" },
  ];
  myControl = new FormControl();
  options: string[] = ["One", "Two", "Three"];
  filteredOptions!: Observable<string[]>;

  aggregatesList: Aggregate[] = [];

  aggregatesListSub!: Subscription;
  constructor(private pipelineService: PipelineService) {}

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
    // this.aggregatesList = (
    //   this.pipelineService.currentSidebarProcessorDetail as AggregateNode
    // ).aggregateList;
    this.aggregatesListSub =
      this.pipelineService.currentSidebarProcessorDetailChanged.subscribe(
        (details: any) => {
          this.aggregatesList = details.aggregateList;
        }
      );
  }

  ngOnDestroy(): void {
    this.aggregatesListSub.unsubscribe();
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onClose() {}

  onDelete() {}

  onAddFilter() {}
}
