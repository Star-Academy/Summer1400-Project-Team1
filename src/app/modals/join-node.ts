import {Dataset} from "./dataset";


export class Join {
    constructor(
        public id: number=0,
        public datasetJoin:Dataset=new Dataset(),
        public joinType:string="",
        public value:string="",
    ) {
    }
    schema():string{
        return `${this.datasetJoin.name} ${this.joinType} ${this.value}`;
    }
}

export class JoinNode {
    constructor(
        public id: number=0,
        public joinsList:Join[]
    ) {
    }
}
