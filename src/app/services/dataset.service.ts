import {Injectable} from '@angular/core';
import {Dataset, DatasetRow} from '../modals/dataset';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  datasetsTemp:Dataset[]=[
    new Dataset(),
    new Dataset(),
    new Dataset(),
    new Dataset()
  ];

  private _datasets!:Dataset[];
  private _datasetsRows!:DatasetRow[];

  datasetsChanged = new Subject<Dataset[]>();
  datasetsRowsChanged = new Subject<DatasetRow[]>();

  get datasets(): Dataset[] {
    return this._datasets;
  }
  set datasets(value: Dataset[]) {
    this._datasets = value;
    this.datasetsChanged.next(value);
    this.datasetsRows = value.map((dataSet: Dataset, index) => {
      return new DatasetRow(index+1, dataSet);
    });
  }
  get datasetsRows(): DatasetRow[] {
    return this._datasetsRows;
  }
  set datasetsRows(value: DatasetRow[]) {
    this._datasetsRows = value;
    this.datasetsRowsChanged.next(value);
  }
  constructor() {
   }
   getDatasets(){
     this.datasets = this.datasetsTemp;
  }

}
