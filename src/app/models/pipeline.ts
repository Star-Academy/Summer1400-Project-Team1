import { Component } from "./Component";
import { Dataset } from "./dataset";

export class  Pipeline{
    constructor(public Id:number,
                public Name:string,
                public Components: Component[],
                public Source : Dataset,
                public Destination : Dataset,
                public DataCreated: string)
    {}
}

export class  PipelineRow{
    constructor(public position:number,
                public pipeline:Pipeline)
    {}
}