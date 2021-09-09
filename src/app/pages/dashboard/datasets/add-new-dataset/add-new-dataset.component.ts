import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { NgForm } from "@angular/forms";
import { StoredDataService } from "src/app/services/stored-data.service";
import { Router } from "@angular/router";
import {Connection,ConnectionRow} from "../../../../models/connection";

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
  hasName:boolean=false;
  initDatasetName = "";
  templist=[
  new Connection(1,"test1","28/5"),
  new Connection(2,"test2","28/5"),
  new Connection(3,"test3","28/5"),
  new Connection(4,"test4","28/5")];

  constructor(
    private storedDataService: StoredDataService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.storedDataService.datasetFile) {
      this.initDatasetName = this.storedDataService.datasetFile.name;
      this.isLocalHost = true;
      this.hasName = true;
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

  addNewConnection(){
    this.router.navigateByUrl("dashboard/connection/add"); 
  }
}
