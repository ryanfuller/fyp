import {DataSetChannel} from "./DataSetChannel";

/**
 * reperesents a single strait plot of data along the x axis. if you want more than 1 line you need multiple axis
 * holds many channels
 */
export class DataSetAxis {

    private name: string;
    private channels: Array<DataSetChannel> = new Array<DataSetChannel>();

    //passed array of channels, name is purely cosmetic and can be used in labels
    constructor(name: string, channels: Array<DataSetChannel>) {
        this.name = name;
        this.channels = channels;
    }

    get GetName(): string {
        return this.name;
    }

    get GetChannels(): Array<DataSetChannel> {
        return this.channels;
    }
}