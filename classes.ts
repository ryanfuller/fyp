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


var testgraph = new BarGraph("super mega data");
var testchannel = new BarAxis("bar 1",testgraph);
var one = new BarChannel("one",testchannel);
var pint = new Point(2,one);