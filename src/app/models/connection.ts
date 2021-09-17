export class Connection {
  constructor(
    public Id: number,
    public ConnectionString: string,
    public Name: string,
    public Server: string,
    public Username: string,
    public Password: string,
    public DateCreated: string 
  ) {}
}

export class ConnectionRow {
  constructor(public position: number, public connection: Connection) {}
}
