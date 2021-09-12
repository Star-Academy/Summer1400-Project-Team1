import { Injectable } from "@angular/core";
import { Dataset, DatasetRow } from "../models/dataset";
import { BehaviorSubject, Subject } from "rxjs";
import { SendRequestService } from "./send-request.service";
import { HttpClient, HttpEventType } from "@angular/common/http";


@Injectable({
  providedIn: "root",
})
export class DatasetService {
  public static readonly UPLOADED: string="uploaded"

  datasetsTemp: Dataset[] = [
    new Dataset(1, " دیتاست ۱", "کانکشن ۱", "۸/۱۲"),
    new Dataset(2, " دیتاست ۲", "کانکشن ۲", "۶/۱۴"),
    new Dataset(3, " دیتاست ۳", "کانکشن ۳", "۳/۱۹"),
  ];

  private _datasets!: Dataset[];
  private _datasetsRows!: DatasetRow[];

  datasetsChanged = new Subject<Dataset[]>();
  datasetsRowsChanged = new BehaviorSubject<DatasetRow[]>([]);
  messageChanged = new BehaviorSubject<string>("");
  inProgress = new BehaviorSubject<boolean>(false);

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

  constructor(private http: HttpClient) {

  }

  async getDatasets() {
    const url = "dataset";
    let res = await SendRequestService.sendRequest(url, true);
    this.datasets = res;
   }

  async uploadFile(name:string,haveHeader:boolean,file:File){
    console.log(file,name,haveHeader);
    this.inProgress.next(true);
    const url=`https://localhost:5001/api/v1/dataset/csv/?name=${name}&header=${haveHeader}`

    let fileToUpload = <File>file;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.http.post(url, formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
    if (event.type === HttpEventType.Response) {
          this.messageChanged.next(DatasetService.UPLOADED);
          this.inProgress.next(false);
         }
      },
    //   (error) => {
    //     console.log("error");
    // },
      
      );
    
  }
}
