import { TableClass } from "./table";

export class Dataset {
  data = new TableClass();
  constructor(
    public Id: number,
    public Name: string,
    public DateCreated: string,
    public Table: string,
    public Connection?: string
  ) {}
}

export class DatasetRow {
  constructor(public position: number, public dataset: Dataset) {}
}
