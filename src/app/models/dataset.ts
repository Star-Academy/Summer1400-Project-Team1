import { Table } from "./table";

export class Dataset {
  data = new Table();
  constructor(
    public id: number = -1,
    public name: string = "testName",
    public connectionName: string = "testConnectionName",
    public createdAt: string = "testDate"
  ) {}
}

export class DatasetRow {
  constructor(public position: number, public dataset: Dataset) {}
}
