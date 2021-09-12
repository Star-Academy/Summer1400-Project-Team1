export class  Pipeline{
    constructor(public Id:number,
                public Name:string,
                public Components: Node[],
                public DataCreated: string)
    {}
}

export class  PipelineRow{
    constructor(public position:number,
                public pipeline:Pipeline)
    {}
}