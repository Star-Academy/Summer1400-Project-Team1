export enum ConditionType {
    AND="AND",
    OR="OR",
    NO_VALUE=""
}

export enum Operator {
    LESS_THAN="<",
    EQUAL_TO="=",
    GREATER_THAN=">",
    NO_VALUE=""
}

export class Filter {
    private _id!: number;
    private _isLeaf!: boolean;
    private _conditionType!: ConditionType;
    private _key!: string;
    private _operator!: Operator;
    private _value!: string;
    private _children!: Filter[];

    constructor(
        id:number,
        conditionType?: ConditionType,
        children?:Filter[],
        key?: string,
        operator?: Operator,
        value?: string,
    ) {
        this.id =id;
        if (conditionType){
            this.conditionType = conditionType;
            this.children = children || [];
            this.isLeaf = false;
        }else{
            this.key = key|| "";
            this.value = value||"";
            this.operator = operator||Operator.EQUAL_TO;
        }

    }

    public addChild = (child: Filter) => {
        if (!this._isLeaf) {
            this._children.push(child);
        } else {
            throw new Error("this node can't have any childes");
        }
    }

    public getChildren = (): Filter[] => {
        if (!this._isLeaf) {
            return this._children;
        } else {
            throw new Error("this node can't have any childes");
        }
    }

    deleteFilter=()=>{
        this.id = -1;
        this.children=[];
    }


    schema(): string {
        let operator;
        if (this.operator !== Operator.EQUAL_TO) {
            operator = this.operator === Operator.GREATER_THAN ?
                Operator.LESS_THAN : Operator.GREATER_THAN;
        } else {
            operator = Operator.EQUAL_TO
        }
        return `${this.key} ${operator} ${this.value}`;
    }





    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get children(): Filter[] {
        return this._children;
    }

    set children(value: Filter[]) {
        this._children = value;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }

    get operator(): Operator {
        return this._operator;
    }

    set operator(value: Operator) {
        this._operator = value;
    }

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._key = value;
    }

    set conditionType(value: ConditionType) {
        this._conditionType = value;
    }

    get conditionType(): ConditionType {
        return this._conditionType;
    }

    set isLeaf(value: boolean) {
        this._isLeaf = value;
    }

    get isLeaf(): boolean {
        return this._isLeaf;
    }

}
