class Point{
	constructor(private origonalValue: number, private channel: Channel){

	}
}

interface Channel{
	channelName: string;
	ownerAxis: Axis;
}

class BarChannel implements Channel {
	channelName: string;
	ownerAxis: Axis;
	constructor(Name:string,axis:BarAxis) {
		this.channelName = name;
		this.ownerAxis = axis;
	}

	get getChannelName(): string{
		return this.channelName;
	}

}


interface Axis {
	axisName: string;
	ownerGraph: Graph;
}

class BarAxis implements Axis {
	
	axisName: string;
	ownerGraph: Graph;
	constructor(name:string, graph:BarGraph) {
		this.axisName = name;
		this.ownerGraph = graph;
	}
}

interface Graph {
	graphName: string;
}


class BarGraph implements Graph {
	graphName: string;
	constructor(name : string) {
		this.graphName = name;
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
        alert(input);
    	this.graphs.push(this.graphFactory.MakeGraph(input));
	}
}

class GraphFactory{
    constructor (owner : Grapher){

    }
    public  MakeGraph(input :string) : Graph{
        let rows = input.split(/\r?\n/);//split the document into

        return new BarGraph("test");
    }
}

/*
var testgraph = new BarGraph("super mega data");
var testchannel = new BarAxis("bar 1",testgraph);
var one = new BarChannel("one",testchannel);
var pint = new Point(2,one);
*/
let grapher = new Grapher();