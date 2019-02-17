const THREE = require('three');
/*
* class structures for data sets for use with making graphs with
* */
//acts as an array for all dimensions that may be on a point. 1 means its a single scaler. 3 is a tripple point
export class Point {
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
    private rangeX : number[] = [0,0];
    private rangeY : number[] = [0,0];
    private rangeZ : number[] = [0,0];

    constructor(name : string,dataAxis:Array<DataSetAxis>,rangeX : number[],rangeY : number[],rangeZ : number[]) {
        this.name = name;
        this.dataAxis = dataAxis;
        this.rangeX = rangeX;
        this.rangeY = rangeY;
        this.rangeZ = rangeZ;
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
    get GetRangeX():number[]{
        return this.rangeX;
    }

    get GetRangeY():number[]{
        return this.rangeY;
    }

    get GetRangeZ():number[]{
        return this.rangeZ;
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