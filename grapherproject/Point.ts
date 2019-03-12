/**
 * acts as an array for all dimensions that may be on a point. 1 means its a single scaler. 3 is a tripple point
 * a point reperesents a single plot point on any graph type
 */
export class Point {
    constructor(private origonalValue: number[]) {
    }

    public GetValue(): number[] {
        return this.origonalValue;
    }
}