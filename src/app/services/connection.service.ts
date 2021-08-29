import { Injectable } from '@angular/core';
import {Connection, ConnectionRow} from '../modals/connection';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConnectionService {
  connectionsTemp:Connection[]=[
    new Connection(),
    new Connection(),
    new Connection(),
    new Connection()
  ]
  private _connections!:Connection[];
  private _connectionRows!:ConnectionRow[];

  connectionChanged = new Subject<Connection[]>();
  connectionRowsChanged = new Subject<ConnectionRow[]>();

  get connections(): Connection[] {
    return this._connections;
  }

  set connections(value: Connection[]) {
    this._connections = value;
    this.connectionChanged.next(value);
    this.connectionRows = value.map((connection: Connection, index) => {
      return new ConnectionRow(index+1, connection);
    });
  }

  get connectionRows(): ConnectionRow[] {
    return this._connectionRows;
  }

  set connectionRows(value: ConnectionRow[]) {
    this._connectionRows = value;
    this.connectionRowsChanged.next(value);
  }

  constructor() { }

  getConnection(){
    this.connections = this.connectionsTemp;
  }

}
