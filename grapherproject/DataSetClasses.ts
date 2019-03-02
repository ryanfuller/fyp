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
    //SetScaleObjectX : ()=>typeof THREE.Object3D;
    SetScaleObjectX:(typeof THREE.Object3D);
    SetScaleObjectY:(typeof THREE.Object3D);
    SetScaleObjectZ:(typeof THREE.Object3D);
    SetAxisLabelsX(numbers :typeof THREE.Object3D[]):void;
    SetAxisLabelsY(numbers :typeof THREE.Object3D[]):void;
    SetAxisLabelsZ(numbers :typeof THREE.Object3D[]):void;
    SetScaleX(num:number):void;
    SetScaleY(num:number):void;
    SetScaleZ(num:number):void;
    GetObjectsToFaceCamera():typeof THREE.Object3D[];
}

export class BarGraph implements Graph{

    SetScaleObjectX: any;
    SetScaleObjectY: any;
    SetScaleObjectZ: any;

    SetScaleX(num: number): void {
    }

    SetScaleY(num: number): void {
    }

    SetScaleZ(num: number): void {
    }

    GetObjectsToFaceCamera(): typeof THREE.Object3D[] {
        return [];
    }

    SetAxisLabelsX(numbers: typeof THREE.Object3D[]): void {
    }

    SetAxisLabelsY(numbers: typeof THREE.Object3D[]): void {
    }

    SetAxisLabelsZ(numbers: typeof THREE.Object3D[]): void {
    }

}

export class SurfaceGraph implements Graph{
    private ScaleObjectX : typeof THREE.Object3D;
    private ScaleObjectY : typeof THREE.Object3D;
    private ScaleObjectZ : typeof THREE.Object3D;

    private AxisLabelsX : typeof THREE.Object3D[];
    private AxisLabelsY : typeof THREE.Object3D[];
    private AxisLabelsZ : typeof THREE.Object3D[];

    public SetScaleObjectX(obj : typeof THREE.Object3D){
        this.ScaleObjectX = obj;
    }
    public SetScaleObjectY(obj : typeof THREE.Object3D){
        this.ScaleObjectY = obj;
    }
    public SetScaleObjectZ(obj : typeof THREE.Object3D){
        this.ScaleObjectZ = obj;
    }
    public SetScaleX(num:number){
        /*for (let i =0;i<this.AxisLabelsX.length; i++) {
            this.AxisLabelsX[i].scale.x = 1/(num/50);
        }*/
        this.ScaleObjectX.scale.x = num/50;
    }
    public SetScaleY(num:number){
        this.ScaleObjectX.scale.z = num/50;
    }
    public SetScaleZ(num:number){
        this.ScaleObjectX.scale.y = num/50;
    }

    public SetAxisLabelsX(NumberListX: typeof THREE.Object3D[]) {
        this.AxisLabelsX = NumberListX;
    }

    SetAxisLabelsY(NumberListY: typeof THREE.Object3D[]) {
        this.AxisLabelsY = NumberListY;

    }

    SetAxisLabelsZ(NumberListZ: typeof THREE.Object3D[]) {
        this.AxisLabelsZ = NumberListZ;

    }
    public GetObjectsToFaceCamera(){
        let set : typeof THREE.Object3D[] = [];
        set = set.concat(this.AxisLabelsX);
        set = set.concat(this.AxisLabelsY);
        set = set.concat(this.AxisLabelsZ);
        return set;
    }


}