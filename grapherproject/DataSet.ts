import {DataSetAxis} from "./DataSetAxis";
import {Graph} from "./Graph";

/**
 * datasets hold many axis
 * reperesents a whole graph
 * can contain 1 reperesentation of a visual graph
 */
export class DataSet {
    private name: string;
    private dataAxis:Array<DataSetAxis> = new Array<DataSetAxis>();
    private graph: Graph;
    private rangeX : number[] = [0,0];
    private rangeY : number[] = [0,0];
    private rangeZ : number[] = [0,0];
    private ID : number;

    //pass in name of the graph and then the axis that it uses as well as the maximum ranges of all the values
    constructor(name : string,dataAxis:Array<DataSetAxis>,rangeX : number[],rangeY : number[],rangeZ : number[],id:number) {
        this.name = name;
        this.dataAxis = dataAxis;
        this.rangeX = rangeX;
        this.rangeY = rangeY;
        this.rangeZ = rangeZ;
        this.ID = id;
    }
    get GetID(): number{
        return this.ID;
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



