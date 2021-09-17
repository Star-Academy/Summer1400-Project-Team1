import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StoredDataService {
  public datasetFile!: File | null;

  constructor() {}
}
