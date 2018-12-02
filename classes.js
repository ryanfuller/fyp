var Point = /** @class */ (function () {
    function Point(origonalValue, channel) {
        this.origonalValue = origonalValue;
        this.channel = channel;
    }
    return Point;
}());
var Channel = /** @class */ (function () {
    function Channel(channelName) {
        this.channelName = channelName;
    }
    Object.defineProperty(Channel.prototype, "getChannelName", {
        get: function () {
            return this.channelName;
        },
        enumerable: true,
        configurable: true
    });
    return Channel;
}());
var one = new Channel("one");
var aaa = new Point(2, one);
