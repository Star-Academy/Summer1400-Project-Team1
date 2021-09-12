
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { NgForm } from "@angular/forms";
import { StoredDataService } from "src/app/services/stored-data.service";
import { Router } from "@angular/router";
import { Connection, ConnectionRow } from "../../../../models/connection";
import { DatasetService } from "src/app/services/dataset.service";
import { Subscription } from "rxjs";
import { Alert, AlertType } from "src/app/utils/alert";
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-add-local-dataset',
  templateUrl: './add-local-dataset.component.html',
  styleUrls: ['./add-local-dataset.component.scss']
})
export class AddLocalDatasetComponent implements OnInit, OnDestroy {
  @ViewChild("form", { static: false }) form!: NgForm;
  panelOpenState: boolean = false;
  isLocalHost: boolean = false;
  hasName: boolean = false;
  initDatasetName = "";

  public inProgress!: boolean;
  public progressSub!: Subscription;
  public message!: string;
  public messageSub!: Subscription;
  templist = [];
  haveHeader: boolean = true;

  constructor(
    private storedDataService: StoredDataService,
    private datasetService: DatasetService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar
    
  ) {}
 

  ngOnInit() {
    if (this.storedDataService.datasetFile) {
      this.initDatasetName = this.storedDataService.datasetFile.name;
      this.isLocalHost = true;
      this.hasName = true;
    }
    this.datasetService.inProgress.next(false);
    this.datasetService.messageChanged.next("");
    this.progressSub = this.datasetService.inProgress.subscribe((inProgress:boolean) => {
      this.inProgress =inProgress;
    });
    this.messageSub = this.datasetService.messageChanged.subscribe((message:string) => {
      this.message = message;
      if (message===DatasetService.UPLOADED) {
        Alert.showAlert(
          this.snackBar,
          "با موفقیت بارگزاری شد",
          AlertType.success,
          "",
          2000,
          ()=>{}
      );

        // this.onClose();
      }
    });
  }

  //TODO post seprator??
  onSubmit() {
    if (!this.form.valid) return;
    if (this.storedDataService.datasetFile) {
      this.datasetService.uploadFile(
        this.form.value.datasetName,
        this.haveHeader,
        this.storedDataService.datasetFile
      );
    } else {
      //TODO
    }
  }

  onClose() {
    this.location.back();
  }

  onUpload(event: any) {
    if (event.target !== null)
      this.storedDataService.datasetFile = event.target.files[0];
  }

  addNewConnection() {
    this.router.navigateByUrl("dashboard/connection/add");
  }
  ngOnDestroy(): void {
    this.progressSub.unsubscribe;
    this.messageSub.unsubscribe;
  }
}
