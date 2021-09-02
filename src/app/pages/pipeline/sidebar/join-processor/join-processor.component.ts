import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { PipelineService } from "../../../../services/pipeline.service";
import { Join, JoinNode } from "../../../../models/join-node";
interface JoinType {
  name: string;
}

@Component({
  selector: "app-join-processor",
  templateUrl: "./join-processor.component.html",
  styleUrls: ["./join-processor.component.scss"],
})
export class JoinProcessorComponent implements OnInit, OnDestroy {
  panelOpenState: boolean = true;
  joinTypeControl = new FormControl("", Validators.required);
  joinTypes: JoinType[] = [
    { name: "Left outer join" },
    { name: "Inner join" },
    { name: "Full outer join" },
    { name: "Right outer join" },
  ];
  myControl = new FormControl();
  options: string[] = ["One", "Two", "Three"];
  filteredOptions!: Observable<string[]>;

  joinList: Join[] = [];

  joinListSub!: Subscription;
  constructor(private pipelineService: PipelineService) {}

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
    this.joinList = (
      this.pipelineService.currentSidebarProcessorDetail as JoinNode
    ).joinsList;
    this.joinListSub =
      this.pipelineService.currentSidebarProcessorDetailChanged.subscribe(
        (details: any) => {
          this.joinList = details.joinsList;
        }
      );
  }

  ngOnDestroy(): void {
    this.joinListSub.unsubscribe();
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
