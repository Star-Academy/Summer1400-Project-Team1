import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import Tabulator from "tabulator-tables";

@Component({
  selector: "app-table-input-output",
  templateUrl: "./table-input-output.component.html",
  styleUrls: ["./table-input-output.component.scss"],
})
export class TableInputOutputComponent implements OnInit, OnChanges {
    @Input() tableData: any[] = [];
  tab = document.createElement("div");

  constructor() {}

  ngOnInit() {
    this.drawTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.drawTable();
  }

  private drawTable(): void {
    new Tabulator(this.tab, {
      data: this.tableData,
      autoColumns: true,
      // reactiveData:true,
      responsiveLayout:"hide",  //hide columns that dont fit on the table
      tooltips:true,            //show tool tips on cells
      addRowPos:"top",          //when adding a new row, add it to the top of the table
      history:true,             //allow undo and redo actions on the table
      pagination:"local",       //paginate the data
      paginationSize:20,         //allow 7 rows per page of data
      movableColumns:true,      //allow column order to be changed
      resizableRows:true, 
       height: "fit-content",
    });
    const temp = document.querySelector("div.holder");
    if (temp) {
      temp.appendChild(this.tab);
    }
  }
}
