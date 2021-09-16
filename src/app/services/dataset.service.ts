import { Injectable } from "@angular/core";
import { Dataset, DatasetRow } from "../models/dataset";
import { BehaviorSubject, Subject } from "rxjs";
import { SendRequestService } from "./send-request.service";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { ResponseMessages } from "../utils/response-messages";

@Injectable({
  providedIn: "root",
})
export class DatasetService {


  private _datasets!: Dataset[];
  private _datasetsRows!: DatasetRow[];

  databases= new BehaviorSubject<{Id:number,Name:string}[]>([]);

  datasetsChanged = new Subject<Dataset[]>();
  datasetsRowsChanged = new BehaviorSubject<DatasetRow[]>([]);
  messageChanged = new BehaviorSubject<string>("");
  inProgress = new BehaviorSubject<boolean>(false);
  isLoadingData = new BehaviorSubject<boolean>(false);

  get datasets(): Dataset[] {
    return this._datasets;
  }

  set datasets(value: Dataset[]) {
    this._datasets = value;
    this.datasetsChanged.next(value);
    this.datasetsRows = value.map((dataSet: Dataset, index) => {
      return new DatasetRow(index + 1, dataSet);
    });
  }

  get datasetsRows(): DatasetRow[] {
    return this._datasetsRows;
  }

  set datasetsRows(value: DatasetRow[]) {
    this._datasetsRows = value;
    this.datasetsRowsChanged.next(value);
  }

  constructor(private http: HttpClient) {}

  async getDatasets() {
    const url = "dataset";
    this.isLoadingData.next(true);
    let res = await SendRequestService.sendRequest(url,"GET", true);    
    this.datasets = res;
     
    this.isLoadingData.next(false);
  }


  async getDatabasesByConnectionId(connectionId:number){
    const url = `connection/${connectionId}/database`;
    return await SendRequestService.sendRequest(url,"GET", true);
  }

  async getDatasetsByDatabaseName(database:string,connectionId:number){
    const url = `connection/${connectionId}/database/${database}`;
    return await SendRequestService.sendRequest(url,"GET", true);
  }

  async addDatasets(body:any){
    const url = "dataset/sql";
    console.log(body);
    return await SendRequestService.sendRequest(url,"POST", true, body);
  }
  async addDatasetOutPut(body:any,datasetId:number,type:string){
    const url = "dataset/"+datasetId+"/sql/?type="+type;
    console.log(body);
    return await SendRequestService.sendRequest(url,"POST", true, body);
  }

  async deleteDataset(datasetId:number){
    const url = `dataset/${datasetId}`;
    return await SendRequestService.sendRequest(url,"DELETE", false);
  }





  async uploadFile(name: string, haveHeader: boolean, file: File) {
    this.inProgress.next(true);
    const url = `https://localhost:5001/api/v1/dataset/csv/?name=${name}&header=${haveHeader}`;

    let fileToUpload = <File>file;
    const formData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);
    this.http
      .post(url, formData, { reportProgress: true, observe: "events" })
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            this.messageChanged.next(ResponseMessages.SUCCESS);
            this.inProgress.next(false);
          }
        },
        (error) => {
          this.messageChanged.next(ResponseMessages.FAILED);
          this.inProgress.next(false);
        }
      );
  }






 async getDatasetSample(datasetId: number){
    const url = `dataset/${datasetId}/?type=sample&count=50`;
    //api/v1/dataset/{id}/?type=pipeline|sample & count=50: 
    return await SendRequestService.sendRequest(url,"GET", true);
  }

}
