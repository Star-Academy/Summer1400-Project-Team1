export class  Pipeline{
    constructor(public id:number =-1,
                public name:string="testName",
                public createdAt:string="testDate")
    {}
}

export class  PipelineRow{
    constructor(public position:number,
                public pipeline:Pipeline)
    {}
}