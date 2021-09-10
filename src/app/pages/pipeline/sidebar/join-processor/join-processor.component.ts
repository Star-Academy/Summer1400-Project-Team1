import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
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
export class JoinProcessorComponent implements OnInit {
  @Input() joinNode!: JoinNode;

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

  ngOnInit(): void {
    this.filteredColumns = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.joinNode.inputData.columns.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onClose() {}

  onDelete() {}

  onAddFilter() {}
}
