class Point{
	constructor(private origonalValue: number,
	private channel: Channel){

	}
}

class Channel {
	constructor(private channelName:string) {

	}

	get getChannelName(): string{
		return this.channelName;
	}

}

var one = new Channel("one");
var aaa = new Point(2,one);