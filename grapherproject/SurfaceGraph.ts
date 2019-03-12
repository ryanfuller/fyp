import {Graph} from "./Graph";
import {THREE} from "./BarGraph";

/**
 * surface graph reperesentation
 */
export class SurfaceGraph implements Graph {
    private ScaleObjectX: typeof THREE.Object3D;
    private ScaleObjectY: typeof THREE.Object3D;
    private ScaleObjectZ: typeof THREE.Object3D;
    private TitleLabelObject: typeof THREE.Object3D;
    private MeshObject: typeof THREE.Object3D;

    private DrawableObject: typeof THREE.Object3D;
    private AxisLabelsX: typeof THREE.Object3D[];
    private AxisLabelsY: typeof THREE.Object3D[];
    private AxisLabelsZ: typeof THREE.Object3D[];
    private GridObjects: typeof THREE.Object3D[];
    private GridMaterial: typeof THREE.Material;
    private fontJSON = require("./helvetiker_regular.typeface.json");
    private loader = new THREE.FontLoader();

    private font = this.loader.parse(this.fontJSON);

    public SetDrawableObject(obj: typeof THREE.Object3D) {
        this.DrawableObject = obj;
    }

    public GetDrawableObject() {
        return this.DrawableObject;
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

    public SetScaleX(num: number) {
        /*for (let i =0;i<this.AxisLabelsX.length; i++) {
            this.AxisLabelsX[i].scale.x = 1/(num/50);
        }*/
        this.ScaleObjectX.scale.x = num / 50;
    }

    public SetScaleY(num: number) {
        this.ScaleObjectX.scale.z = num / 50;
    }

    public SetScaleZ(num: number) {
        this.ScaleObjectX.scale.y = num / 50;
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

    public GetObjectsToFaceCamera() {
        let set: typeof THREE.Object3D[] = [];
        set = set.concat(this.AxisLabelsX);
        set = set.concat(this.AxisLabelsY);
        set = set.concat(this.AxisLabelsZ);
        return set;
    }

    SetTitleText(title: string): void {

        let NameTextgeometry = new THREE.TextGeometry(title, {font: this.font, size: 0.5, height: 0, material: 0});
        this.TitleLabelObject.geometry = NameTextgeometry;
    }

    public SetTitleObject(obj: typeof THREE.Object3D) {
        this.TitleLabelObject = obj;
    }

    public SetMeshObject(obj: typeof THREE.Object3D) {
        this.MeshObject = obj;
    }

    SetColour(colour: string): void {
        let mat = new THREE.MeshLambertMaterial({color: colour});
        mat.side = THREE.DoubleSide;
        this.MeshObject.material = mat;
    }

    public SetGridObjects(objs: typeof THREE.Object3D[]) {
        this.GridMaterial = objs[0].material;
        this.GridObjects = objs;
    }

    SetGridVisable(checked: boolean): void {
        for (let i = 0; i < this.GridObjects.length; i++) {
            this.GridObjects[i].material = checked ? this.GridMaterial : new THREE.MeshStandardMaterial({
                opacity: 0,
                transparent: true
            });
        }
    }

    SetNumbersVisable(checked: boolean): void {
        for (let i = 0; i < this.AxisLabelsX.length; i++) {
            this.AxisLabelsX[i].visible = checked;
        }
        for (let i = 0; i < this.AxisLabelsY.length; i++) {
            this.AxisLabelsY[i].visible = checked;
        }
        for (let i = 0; i < this.AxisLabelsZ.length; i++) {
            this.AxisLabelsZ[i].visible = checked;
        }
    }
}