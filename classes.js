var Point = /** @class */ (function () {
    function Point(origonalValue) {
        this.origonalValue = origonalValue;
    }
    return Point;
}());
var BarChannel = /** @class */ (function () {
    function BarChannel(name, point) {
        this.channelName = name;
        this.point = point;
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
    function BarAxis(name, channels) {
        this.channels = new Array();
        this.axisName = name;
        this.channels = channels;
    }
    return BarAxis;
}());
var BarGraph = /** @class */ (function () {
    function BarGraph(name, dataAxis) {
        this.dataAxis = new Array();
        this.graphName = name;
        this.dataAxis = dataAxis;
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
        this.graphs.push(this.graphFactory.MakeNewGraph(input, "test"));
    };
    return Grapher;
}());
var GraphFactory = /** @class */ (function () {
    function GraphFactory(owner) {
    }
    GraphFactory.prototype.MakeNewGraph = function (input, name) {
        //known issues, this does not take into account csv files with arbitrary white space
        //assumes titles at the top and side
        //assumes amount of data is constant, so no colum has more data than the other for no reason or if data sets > amount of sets
        var rows = input.split(/\r?\n/); //split the document into rows
        var matrix;
        matrix = [];
        for (var i = 0; i < rows.length; i++) { //setup a 2 dimensional array of all the values
            matrix[i] = [];
            matrix[i] = rows[i].split(",");
        }
        var titles = matrix[0];
        var amountOfChannels = rows.length;
        var amountOfAxis = titles.length;
        var axis = new Array();
        for (var c = 1; c < amountOfAxis; c++) { //loop through arrays and make objects accordingly
            var channels = new Array();
            for (var r = 1; r < amountOfChannels; r++) {
                channels.push(new BarChannel(matrix[r][0], new Point(+matrix[r][c])));
            }
            axis.push(new BarAxis(matrix[0][c], channels));
        }
        var newGraph = new BarGraph(name, axis);
        console.log(newGraph);
        return newGraph;
        //tested with single csv with many different values and console.log constantly checking values
    };
    return GraphFactory;
}());
var grapher = new Grapher();
