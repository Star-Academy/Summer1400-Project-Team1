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

  isLoadingData = new BehaviorSubject<boolean>(false);
  inProgress = new BehaviorSubject<boolean>(false);

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
    this.isLoadingData.next(true);
    const url = "connection";
    let res = await SendRequestService.sendRequest(url, "GET",true);
    this.connections = res;
    this.isLoadingData.next(false);
  }


  async deleteConnection(connectionId:number){
    const url = `connection/${connectionId}`;
    return await SendRequestService.sendRequest(url,"DELETE", false);
  }


  
  //TODO back should handle errors! including:required field, already exists name
  async createConnection(connection: {
    name: string;
    server: string;
    userName: string;
    password: string;
  }) {
    this.inProgress.next(true);
    const url = "connection";
    const body = connection;
    let res = await SendRequestService.sendRequest(url,"POST", true, body);
    //TODO handle success or error response message
    this.inProgress.next(false);
  }
}
