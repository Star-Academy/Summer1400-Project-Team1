
export class Aggregate {
    constructor(
        public id: number=0,
        public column:string="",
        public aggregateType:string="",
        public value:string="",
    ) {
    }
    schema():string{
        return `${this.column} ${this.aggregateType} ${this.value}`;
    }
}
export class AggregateNode {
    constructor(
        public id: number=0,
        public aggregateList:Aggregate[]
    ) {
    }
}
