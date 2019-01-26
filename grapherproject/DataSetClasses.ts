
export class Point{
    constructor(private origonalValue: number){

    }
}

export class DataSetChannel {
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

    constructor(name : string,dataAxis:Array<DataSetAxis>) {
        this.name = name;
        this.dataAxis = dataAxis;
    }
    get GetName(): string{
        return this.name;
    }
    get GetChannels (): Array<DataSetAxis>{
        return this.dataAxis;
    }
}
