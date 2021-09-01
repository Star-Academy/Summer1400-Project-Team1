
export class Filter {
    constructor(
        public id:number=0,
        public column:string="",
        public operator:string="",
        public value:string="",
    ) {
    }
    schema():string{
     return `${this.column} ${this.operator} ${this.value}`;
    }
}

export class FilterNode {
    constructor(
        public id:number=0,
        public filtersList: Filter[],
    ) {}
}
