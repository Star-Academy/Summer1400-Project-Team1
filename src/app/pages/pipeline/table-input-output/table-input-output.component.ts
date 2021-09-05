import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import Tabulator from "tabulator-tables";

@Component({
  selector: "app-table-input-output",
  templateUrl: "./table-input-output.component.html",
  styleUrls: ["./table-input-output.component.scss"],
})
export class TableInputOutputComponent implements OnInit, OnChanges {
    @Input() tableData: any[] = [
      {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},
      {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},      {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},
      {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},
      {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},
      {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},
      {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},
      {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},
      {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},
      {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},
      {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},
         {id:1, name:"Oli Bob", progress:12, gender:"male", rating:1, col:"red", dob:"19/02/1984", car:1,family:'gh','some other info':'test','my name':'is eminem',song:'slim shady'},
   
      
  ];
  // @Input() tableData: any[] = [];

    // @Input() columnNames: any[] = [
    //   { title: "Name", field: "name" },
    //   { title: "Task Progress", field: "progress" },
    //   { title: "Gender", field: "gender" },
    //   { title: "Rating", field: "rating" },
    //   { title: "Color", field: "col" },
    //   { title: "Date Of Birth", field: "dob" },
    //   { title: "Driver", field: "car" },
    // ];

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
      layout: 'fitColumns',
      height: "200px"
    });
    const temp = document.querySelector("div.holder");
    if (temp) {
      temp.appendChild(this.tab);
    }
  }
}
