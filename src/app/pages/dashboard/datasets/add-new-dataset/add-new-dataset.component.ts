import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { NgForm } from "@angular/forms";
import { StoredDataService } from "src/app/services/stored-data.service";

@Component({
  selector: "app-add-new-dataset",
  templateUrl: "./add-new-dataset.component.html",
  styleUrls: ["./add-new-dataset.component.scss"],
})
export class AddNewDatasetComponent implements OnInit {
  @ViewChild("form", { static: false }) form!: NgForm;
  datasetName!: string;
  panelOpenState: boolean = false;
  isLocalHost: boolean = false;
  initDatasetName = "";
  constructor(
    private storedDataService: StoredDataService,
    private location: Location
  ) {}

  ngOnInit() {
    if (this.storedDataService.datasetFile) {
      this.initDatasetName = this.storedDataService.datasetFile.name;
      this.isLocalHost = true;
    }
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.datasetName = this.form.value.datasetName;
  }

  onClose() {
    this.location.back();
  }

  onUpload(event: any) {
    if (event.target !== null) console.log(event.target.files);
  }
}
