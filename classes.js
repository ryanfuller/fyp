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
var testgraph = new BarGraph("super mega data");
var testchannel = new BarAxis("bar 1", testgraph);
var one = new BarChannel("one", testchannel);
var pint = new Point(2, one);
