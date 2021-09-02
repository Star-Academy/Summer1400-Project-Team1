export class Connection{
    constructor(public id:number =-1,
        public name:string="testConnectionName",
        public createdAt:string="testDate")
    {}
}

export class  ConnectionRow{
    constructor(public position:number,
                public connection:Connection)
    {}
}