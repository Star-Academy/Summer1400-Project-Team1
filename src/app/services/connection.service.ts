import { Injectable } from "@angular/core";
import { Connection, ConnectionRow } from "../models/connection";
import { BehaviorSubject, Subject } from "rxjs";
import { SendRequestService } from "./send-request.service";

@Injectable({
  providedIn: "root",
})
export class ConnectionService {
  private _connections!: Connection[];
  private _connectionRows!: ConnectionRow[];

  connectionChanged = new Subject<Connection[]>();
  connectionRowsChanged = new BehaviorSubject<ConnectionRow[]>([]);

  get connections(): Connection[] {
    return this._connections;
  }

  set connections(value: Connection[]) {
    this._connections = value;
    this.connectionChanged.next(value);
    this.connectionRows = value.map((connection: Connection, index) => {
      return new ConnectionRow(index + 1, connection);
    });
  }

  get connectionRows(): ConnectionRow[] {
    return this._connectionRows;
  }

  set connectionRows(value: ConnectionRow[]) {
    this._connectionRows = value;
    this.connectionRowsChanged.next(value);
  }

  constructor() {}

  async getConnections() {
    const url = "connection";
    let res = await SendRequestService.sendRequest(url, true);
    this.connections = res;
    console.log(this.connections);
  }
  //TODO back should handle errors! including:required field, already exists name
  async createConnection(connection: {
    name: string;
    server: string;
    userName: string;
    password: string;
  }) {
    const url = "connection";
    const body = connection;
    let res = await SendRequestService.sendRequest(url, true, body);
    //TODO handle seccess or error response message
    console.log(res);
  }
}
