export class Filter {
    constructor(
        public id: number = 0,
        public column: string = "",
        public operator: string = "",
        public value: string = "",

    ) {
    }

    schema(): string {
        let operator ;
        if (this.operator !== "==") {
            operator = this.operator === ">" ? "<" : ">";
        } else {
            operator = "=="
        }
        return `${this.column} ${operator} ${this.value}`;
    }
}

export class FilterNode {
    constructor(
        public id: number = 0,
        public filtersList: Filter[],
    ) {
    }
}
