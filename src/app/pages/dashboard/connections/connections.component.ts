import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ConnectionRow } from "src/app/models/connection";
import { ConnectionService } from "src/app/services/connection.service";

@Component({
  selector: "app-connections",
  templateUrl: "./connections.component.html",
  styleUrls: ["./connections.component.scss"],
})
export class ConnectionsComponent implements OnInit {
  connectionsRows!: ConnectionRow[];
  connectionRowsSub!: Subscription;
  displayedColumns: string[] = ["شماره", "نام اتصال","نوع اتصال","کاربر", "تاریخ ساخت"];

  constructor(public connectionService: ConnectionService) {}

  ngOnInit(): void {
    this.connectionService.getConnections();
     this.connectionRowsSub =
      this.connectionService.connectionRowsChanged.subscribe(
        (connectionRows: ConnectionRow[]) => {
          this.connectionsRows = connectionRows;
        }
      );
  }

  onConnectionClick(row: ConnectionRow) {
    console.log(row.connection.Name);
  }

  ngOnDestroy(): void {
    this.connectionRowsSub.unsubscribe();
  }
}
