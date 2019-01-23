/**
 * Primary ThreeJS File
 *
 */


const potato = require('./potato');
const fs = require('fs');

console.log(potato.age);

class Point{
    constructor(private origonalValue: number){

    }
}

interface Channel{
    channelName: string;
    point: Point;
}

class BarChannel implements Channel {
    channelName: string;
    point: Point;
    constructor(name:string,point:Point) {
        this.channelName = name;
        this.point = point;
    }

    get getChannelName(): string{
        return this.channelName;
    }
}


interface Axis {
    axisName: string;
    channels : Array<Channel>;
}

class BarAxis implements Axis {

    axisName: string;
    channels : Array<BarChannel> = new Array<BarChannel>();

    constructor(name:string, channels: Array<BarChannel>) {
        this.axisName = name;
        this.channels = channels;
    }
}

interface Graph {
    graphName: string;
    dataAxis : Array<Axis>;
}


class BarGraph implements Graph {
    graphName: string;
    dataAxis:Array<BarAxis> = new Array<BarAxis>();
    constructor(name : string,dataAxis:Array<BarAxis>) {
        this.graphName = name;
        this.dataAxis = dataAxis;
    }
}

class InputManager{
    owner : Grapher;
    constructor (owner : Grapher){
        this.owner=owner;
    }
    public MakeNewBarGraph( rawInput : string ) {
        //check for faulty files here
        this.owner.GraphRequest(rawInput);
    }
}



class Grapher {
    private inputManager = new InputManager(this);
    private graphFactory = new GraphFactory(this);

    private graphs : Array<Graph> = new Array<Graph>();

    constructor() {

    }


    public GetInputManager(){
        return this.inputManager;
    }

    public GraphRequest(input : string){
        this.graphs.push(this.graphFactory.MakeNewGraph(input,"test"));
    }
}

class GraphFactory{
    constructor (owner : Grapher){

    }
    public  MakeNewGraph(input :string, name: string) : Graph{
        //known issues, this does not take into account csv files with arbitrary white space
        //assumes titles at the top and side
        //assumes amount of data is constant, so no colum has more data than the other for no reason or if data sets > amount of sets

        let rows = input.split(/\r?\n/);//split the document into rows

        let matrix : string[][];

        matrix = [];
        for (let i = 0; i < rows.length; i++) {//setup a 2 dimensional array of all the values
            matrix[i] = [];
            matrix[i] = rows[i].split(",");
        }

        let titles = matrix[0];

        let amountOfChannels : number = rows.length ;
        let amountOfAxis : number = titles.length ;


        let axis : Array<BarAxis> = new Array<BarAxis>();


        for (let c = 1; c < amountOfAxis ; c++) {//loop through arrays and make objects accordingly
            let channels : Array<BarChannel> = new Array<BarChannel>();

            for (let r = 1 ; r < amountOfChannels ; r++) {

                channels.push(new BarChannel(matrix[r][0],new Point(+matrix[r][c] )))

            }
            axis.push(new BarAxis(matrix[0][c],channels));

        }

        let newGraph = new BarGraph(name,axis);

        console.log(newGraph);
        return newGraph;
        //tested with single csv with many different values and console.log constantly checking values
    }
}

let grapher = new Grapher();

document.getElementById('input_file').addEventListener('change', getFile)

let inputManager = grapher.GetInputManager();

function getFile(event: { target: any; }) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {//works with repeat changes to file importing

        inputManager.MakeNewBarGraph(fs.readFileSync(input.files[0],'utf8'));

        let target : any= document.getElementById('content-target');
        target.value = input.files[0];
    }
}



