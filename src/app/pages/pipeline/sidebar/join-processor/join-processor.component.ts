import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, NgForm, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Dataset, DatasetRow } from "src/app/models/dataset";
import { JoinNode } from "../../../../models/graph/processor-nodes/join-node";
import { DatasetService } from "../../../../services/dataset.service";
interface JoinType {
  name: string;
}

@Component({
  selector: "app-join-processor",
  templateUrl: "./join-processor.component.html",
  styleUrls: ["./join-processor.component.scss"],
})
export class JoinProcessorComponent implements OnInit, OnDestroy {
  @Input() joinNode!: JoinNode;
  @ViewChild("form", { static: false }) form!: NgForm;
  datasets: Dataset[] = [];
  datasetsSub!: Subscription;

  panelOpenState: boolean = true;
  joinTypeControl = new FormControl("", Validators.required);
  joinTypes: JoinType[] = [
    { name: "Left outer join" },
    { name: "Inner join" },
    { name: "Full outer join" },
    { name: "Right outer join" },
  ];
  myControl = new FormControl();
  filteredColumns!: Observable<string[]>;
  constructor(public datasetService: DatasetService) {}
  ngOnDestroy(): void {
    this.datasetsSub.unsubscribe();
  }

  ngOnInit(): void {
    this.filteredColumns = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
    this.datasetService.getDatasets();
    this.datasetsSub=this.datasetService.datasetsRowsChanged.subscribe((data:DatasetRow[]) => {
      this.datasets=data.map(datasets=>datasets.dataset);
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.joinNode.inputData.columns.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onSubmit() {
    if (!this.form.valid) return;
    console.log(this.joinNode);
  }

  onClose() {}

  onDelete() {}

  onAddFilter() {}
}
