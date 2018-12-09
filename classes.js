var Point = /** @class */ (function () {
    function Point(origonalValue, channel) {
        this.origonalValue = origonalValue;
        this.channel = channel;
    }
    return Point;
}());
var BarChannel = /** @class */ (function () {
    function BarChannel(Name, axis) {
        this.channelName = name;
        this.ownerAxis = axis;
    }
    Object.defineProperty(BarChannel.prototype, "getChannelName", {
        get: function () {
            return this.channelName;
        },
        enumerable: true,
        configurable: true
    });
    return BarChannel;
}());
var BarAxis = /** @class */ (function () {
    function BarAxis(name, graph) {
        this.axisName = name;
        this.ownerGraph = graph;
    }
    return BarAxis;
}());
var BarGraph = /** @class */ (function () {
    function BarGraph(name) {
        this.graphName = name;
    }
    return BarGraph;
}());
var InputManager = /** @class */ (function () {
    function InputManager(owner) {
        this.owner = owner;
    }
    InputManager.prototype.MakeNewBarGraph = function (rawInput) {
        //check for faulty files here
        this.owner.GraphRequest(rawInput);
    };
    return InputManager;
}());
var Grapher = /** @class */ (function () {
    function Grapher() {
        this.inputManager = new InputManager(this);
        this.graphFactory = new GraphFactory(this);
        this.graphs = new Array();
    }
    Grapher.prototype.GetInputManager = function () {
        return this.inputManager;
    };
    Grapher.prototype.GraphRequest = function (input) {
        alert(input);
        this.graphs.push(this.graphFactory.MakeGraph(input));
    };
    return Grapher;
}());
var GraphFactory = /** @class */ (function () {
    function GraphFactory(owner) {
    }
    GraphFactory.prototype.MakeGraph = function (input) {
        var rows = input.split(/\r?\n/); //split the document into
        return new BarGraph("test");
    };
    return GraphFactory;
}());
/*
var testgraph = new BarGraph("super mega data");
var testchannel = new BarAxis("bar 1",testgraph);
var one = new BarChannel("one",testchannel);
var pint = new Point(2,one);
*/
var grapher = new Grapher();
