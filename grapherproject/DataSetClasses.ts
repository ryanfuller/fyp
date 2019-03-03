const THREE = require('three');
/*
* class structures for data sets for use with making graphs with
* */

/**
 * acts as an array for all dimensions that may be on a point. 1 means its a single scaler. 3 is a tripple point
 * a point reperesents a single plot point on any graph type
 */
export class Point {
    constructor(private origonalValue: number[]){
    }
    public GetValue(): number[]{
        return this.origonalValue;
    }
}


/**
 * reperesents a vertical slice of any graph that occupies 1 point.
 * holds 1 point and only 1 point
 */
export class DataSetChannel{
    private name: string;
    private point: Point;
    //name is cosmetic
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

/**
 * reperesents a single strait plot of data along the x axis. if you want more than 1 line you need multiple axis
 * holds many channels
 */
export class DataSetAxis {

    private name: string;
    private channels : Array<DataSetChannel> = new Array<DataSetChannel>();

    //passed array of channels, name is purely cosmetic and can be used in labels
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

    //pass in name of the graph and then the axis that it uses as well as the maximum ranges of all the values
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
/*visual graph classes
* used as classes to create and control graphical reperesentations of the data
* */

/**
 * any new graph graphic needs to inherit from Graph in order to be draw correctly
 */
export interface Graph {
    //SetScaleObjectX : ()=>typeof THREE.Object3D;
    SetScaleObjectX:(typeof THREE.Object3D);//the object that when scaled will make the graph bigger in the x
    SetScaleObjectY:(typeof THREE.Object3D);
    SetScaleObjectZ:(typeof THREE.Object3D);
    SetAxisLabelsX(numbers :typeof THREE.Object3D[]):void;//the labels for the x axis so that they can be pointed in the right direction
    SetAxisLabelsY(numbers :typeof THREE.Object3D[]):void;
    SetAxisLabelsZ(numbers :typeof THREE.Object3D[]):void;
    SetScaleX(num:number):void;//function to scale the graph on the x axis
    SetScaleY(num:number):void;
    SetScaleZ(num:number):void;
    GetObjectsToFaceCamera():typeof THREE.Object3D[];//get all labels on the graph
    SetTitleText(title: string): void;
    SetTitleObject:(typeof THREE.Object3D);
    SetColour(colour: string): void;
    SetMeshObject:(typeof THREE.Object3D);//get the main mesh for the graph

}
/**
 * bar graph class reperesentation
 * */
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

    SetTitleObject: any;

    SetTitleText(title: string): void {
    }

    SetMeshObject: any;

    SetColour(colour: string): void {
    }

}

/**
 * surface graph reperesentation
 */
export class SurfaceGraph implements Graph{
    private ScaleObjectX : typeof THREE.Object3D;
    private ScaleObjectY : typeof THREE.Object3D;
    private ScaleObjectZ : typeof THREE.Object3D;
    private TitleLabelObject : typeof THREE.Object3D;
    private MeshObject : typeof THREE.Object3D;

    private AxisLabelsX : typeof THREE.Object3D[];
    private AxisLabelsY : typeof THREE.Object3D[];
    private AxisLabelsZ : typeof THREE.Object3D[];
    private fontJSON = require("./helvetiker_regular.typeface.json");
    private loader = new THREE.FontLoader();

    private font = this.loader.parse(this.fontJSON);

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

    public SetAxisLabelsY(NumberListY: typeof THREE.Object3D[]) {
        this.AxisLabelsY = NumberListY;

    }

    public SetAxisLabelsZ(NumberListZ: typeof THREE.Object3D[]) {
        this.AxisLabelsZ = NumberListZ;

    }
    public GetObjectsToFaceCamera(){
        let set : typeof THREE.Object3D[] = [];
        set = set.concat(this.AxisLabelsX);
        set = set.concat(this.AxisLabelsY);
        set = set.concat(this.AxisLabelsZ);
        return set;
    }

    SetTitleText(title: string): void {

        let NameTextgeometry = new THREE.TextGeometry(title,{font : this.font,size:0.5,height:0,material:0});
        this.TitleLabelObject.geometry = NameTextgeometry;
    }

    public SetTitleObject(obj : typeof THREE.Object3D){
        this.TitleLabelObject = obj;
    }

    public SetMeshObject(obj : typeof THREE.Object3D){
        this.MeshObject = obj;
    }

    SetColour(colour: string): void {
        let mat = new THREE.MeshLambertMaterial({color:colour});
        mat.side = THREE.DoubleSide;
        this.MeshObject.material = mat;
    }
}