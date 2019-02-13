const THREE = require('three');
/*
* class structures for data sets for use with making graphs with
* */
export interface Point {
    GetValue:()=>any;
}
export class SinglePoint implements Point{
    constructor(private origonalValue: number){

    }
    public GetValue(): number{
        return this.origonalValue;
    }
}
export class TripplePoint implements Point{
    constructor(private origonalValue: number[]){

    }
    public GetValue(): number[]{
        return this.origonalValue;
    }
}


export class DataSetChannel{
    private name: string;
    private point: Point;
    constructor(name:string,point:Point) {
        this.name = name;
        this.point = point;
    }

    get GetName(): string{
        return this.name;
    }
    get GetPoint (): Point{
        return this.point;
    }
}

export class DataSetAxis {

    private name: string;
    private channels : Array<DataSetChannel> = new Array<DataSetChannel>();

    constructor(name:string, channels: Array<DataSetChannel>) {
        this.name = name;
        this.channels = channels;
    }
    get GetName(): string{
        return this.name;
    }
    get GetChannels (): Array<DataSetChannel>{
        return this.channels;
    }
}

export class DataSet {
    private name: string;
    private dataAxis:Array<DataSetAxis> = new Array<DataSetAxis>();
    private graph: Graph;

    constructor(name : string,dataAxis:Array<DataSetAxis>) {
        this.name = name;
        this.dataAxis = dataAxis;
    }
    get GetName(): string{
        return this.name;
    }
    get GetAxis (): Array<DataSetAxis>{
        return this.dataAxis;
    }
    get GetGraph() : Graph{
        return this.graph;
    }
    public SetGraph(graph : Graph){
        this.graph = graph;
    }
}

//////////////////////////////////////////////
/*visual graph classes*/
export interface Graph {
    GetTHREEGraph : ()=>any;
}

export class BarGraph implements Graph{

    public GetTHREEGraph () {

        return 1;
    }
}

export class SurfaceGraph implements Graph{
    public GetTHREEGraph(){
        return 1;
    }
}