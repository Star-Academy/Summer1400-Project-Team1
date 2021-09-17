import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { NgForm } from "@angular/forms";
import { StoredDataService } from "src/app/services/stored-data.service";
import { Router } from "@angular/router";
import { ConnectionRow } from "../../../../models/connection";
import { DatasetService } from "src/app/services/dataset.service";
import { Subscription } from "rxjs";
import { Alert, AlertType } from "src/app/utils/alert";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ResponseMessages } from "src/app/utils/response-messages";
import { ConnectionService } from "src/app/services/connection.service";

@Component({
  selector: "app-add-new-dataset",
  templateUrl: "./add-new-dataset.component.html",
  styleUrls: ["./add-new-dataset.component.scss"],
})
export class AddNewDatasetComponent implements OnInit, OnDestroy {
  @ViewChild("form", { static: false }) form!: NgForm; 
  panelOpenState: boolean = false;
  isLocalHost: boolean = false;
  hasName: boolean = false;
  initDatasetName = "";
  chooseConnectionLable: string = "انتخاب اتصال";
  chooseDatabaseLable: string = "انتخاب پایگاه داده";
  chooseDatasetLable: string = "انتخاب جدول";

  connectionList: ConnectionRow[] = [];
  selectedConnectionId!: number;
  connectionListSub!: Subscription;
  databaseList = [];
  selectedDatabaseName!: string;
  datasetList = [];
  selectedDatasetName!: string;

  public isLoadingData!: boolean;
  public inProgress!: boolean;
  public progressSub!: Subscription;
  public message!: string;
  public messageSub!: Subscription;
  templist = [];
  haveHeader: boolean = true;

  constructor(
    private storedDataService: StoredDataService,
    private connectionService: ConnectionService,
    private datasetService: DatasetService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

   async onSelectConnection(connectionRow: ConnectionRow, stepper: any) {
   try {
    this.selectedConnectionId = connectionRow.connection.Id;
    this.isLoadingData = true;
    let res = await this.datasetService.getDatabasesByConnectionId(
      connectionRow.connection.Id
    );
    this.chooseConnectionLable =
      "انتخاب اتصال : " + connectionRow.connection.Name;
    this.isLoadingData = false;
    this.databaseList = res;
    stepper.next();
   } catch (error) {
     console.log(error);
     this.isLoadingData =false;
     
   }
  }
  async onSelectDatabase(database: string, stepper: any) {
    this.selectedDatabaseName = database;
    this.chooseDatabaseLable = "انتخاب پایگاه داده : " + database;

    this.isLoadingData = true;
    let res = await this.datasetService.getDatasetsByDatabaseName(
      database,
      this.selectedConnectionId
    );
    this.isLoadingData = false;
    this.datasetList = res;
    stepper.next();
  }
  onSelectDataset(dataset: string, stepper: any) {
    this.selectedDatasetName = dataset;
    this.chooseDatasetLable = "انتخاب جدول : " + dataset;
    stepper.next();
  }

  //TODO errors
  async onSubmit() {
    if (!this.form.valid) return;
    this.isLoadingData = true;
    await this.datasetService.addDatasets({
      datasetName: this.form.value.datasetName,
      connectionId: this.selectedConnectionId,
      databaseName: this.selectedDatabaseName,
      tableName: this.selectedDatasetName,
    });
    this.isLoadingData = false;
  }

  onCancle() {
    if (this.isLoadingData) {
      this.isLoadingData = false;
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
  ngOnInit() {
    if (this.storedDataService.datasetFile) {
      this.initDatasetName = this.storedDataService.datasetFile.name;
      this.isLocalHost = true;
      this.hasName = true;
    }
    this.datasetService.inProgress.next(false);
    this.datasetService.isLoadingData.next(false);
    this.datasetService.messageChanged.next("");
    this.connectionService.getConnections();
    this.connectionListSub =
      this.connectionService.connectionRowsChanged.subscribe(
        (connectionRows: ConnectionRow[]) => {
          this.connectionList = connectionRows;
        }
      );
    this.progressSub = this.datasetService.inProgress.subscribe(
      (inProgress: boolean) => {
        this.inProgress = inProgress;
      }
    );

    //TODO add error message
    this.messageSub = this.datasetService.messageChanged.subscribe(
      (message: string) => {
        this.message = message;
        if (message === ResponseMessages.SUCCESS) {
          Alert.showAlert(
            this.snackBar,
            "با موفقیت بارگزاری شد",
            AlertType.success,
            "",
            2000,
            () => {}
          );

          // this.onClose();
        }
      }
    );
  }
  ngOnDestroy(): void {
    this.progressSub.unsubscribe;
    this.messageSub.unsubscribe;
    this.connectionListSub.unsubscribe;
  }
}
