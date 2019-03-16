import {Graph} from "./Graph";

export const THREE = require('three');

/**
 * bar graph class reperesentation
 * */
export class BarGraph implements Graph {

    private ScaleObjectX: typeof THREE.Object3D;
    private ScaleObjectY: typeof THREE.Object3D;
    private ScaleObjectZ: typeof THREE.Object3D;
    private TitleLabelObject: typeof THREE.Object3D;
    private MeshObject: typeof THREE.Object3D;
    private AxisLabelsX: typeof THREE.Object3D[];
    private AxisLabelsY: typeof THREE.Object3D[];
    private AxisLabelsZ: typeof THREE.Object3D[];
    private fontJSON = require("./helvetiker_regular.typeface.json");
    private loader = new THREE.FontLoader();

    private font = this.loader.parse(this.fontJSON);

    private DrawableObject: typeof THREE.Object3D;

    public SetScaleX(num: number) {
        this.ScaleObjectX.scale.x = num / 50;
    }

    public SetScaleY(num: number) {
        this.ScaleObjectX.scale.z = num / 50;
    }

    public SetScaleZ(num: number) {
        this.ScaleObjectX.scale.y = num / 50;
    }

    public SetScaleObjectX(obj: typeof THREE.Object3D) {
        this.ScaleObjectX = obj;
    }

    public SetScaleObjectY(obj: typeof THREE.Object3D) {
        this.ScaleObjectY = obj;
    }

    public SetScaleObjectZ(obj: typeof THREE.Object3D) {
        this.ScaleObjectZ = obj;
    }

    public SetAxisLabelsX(NumberListX: typeof THREE.Object3D[]) {
        this.AxisLabelsX = NumberListX;
    }

    public SetAxisLabelsY(NumberListY: typeof THREE.Object3D[]) {
        this.AxisLabelsY = NumberListY;
    }

    public SetAxisLabelsZ(NumberListZ: typeof THREE.Object3D[]) {
        this.AxisLabelsZ = NumberListZ;
    }

    public SetTitleObject(obj: typeof THREE.Object3D) {
        this.TitleLabelObject = obj;
    }

    SetTitleText(title: string): void {

        let NameTextgeometry = new THREE.TextGeometry(title, {font: this.font, size: 0.5, height: 0, material: 0});
        this.TitleLabelObject.geometry = NameTextgeometry;
    }

    SetMeshObject: any;

    SetColour(colour: string): void {
    }

    SetGridVisable(checked: boolean): void {
    }

    SetNumbersVisable(checked: boolean): void {

    }

    SetGridObjects(objs: typeof THREE.Object3D[]): void {
    }

    public SetDrawableObject(obj: typeof THREE.Object3D) {
        this.DrawableObject = obj;
    }

    public GetDrawableObject() {
        return this.DrawableObject;
    }

    public GetObjectsToFaceCamera() {
        return this.AxisLabelsX;
    }

    SetMaterial(colour: string): void {
    }

}