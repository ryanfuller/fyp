import {Point} from "./Point";

/**
 * reperesents a vertical slice of any graph that occupies 1 point.
 * holds 1 point and only 1 point
 */
export class DataSetChannel {
    private name: string;
    private point: Point;

    //name is cosmetic
    constructor(name: string, point: Point) {
        this.name = name;
        this.point = point;
    }

    get GetName(): string {
        return this.name;
    }

    get GetPoint(): Point {
        return this.point;
    }
}