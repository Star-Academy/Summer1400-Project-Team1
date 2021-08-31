

export enum NodeType {
    SOURCE_LOCAL="local-storage",
    SOURCE_SERVER="server-storage",
    DESTINATION_LOCAL="local-storage",
    DESTINATION_SERVER="server-storage",
    FILTER="filter",
    JOIN="join",
    AGGREGATION="aggregate"
}

export class Node{
    constructor(
        public id:number,
        public name:string,
        public nodeType:NodeType,
    ){}
}
