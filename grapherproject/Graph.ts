
const THREE = require('three');

/**
 * any new graph graphic needs to inherit from Graph in order to be draw correctly
 */
export interface Graph {
    //SetScaleObjectX : ()=>typeof THREE.Object3D;
    SetDrawableObject: (typeof THREE.Object3D);//the parent object to draw that includes all graph objects in it
    GetDrawableObject(): typeof THREE.Object3D;

    SetScaleObjectX: (typeof THREE.Object3D);//the object that when scaled will make the graph bigger in the x
    SetScaleObjectY: (typeof THREE.Object3D);
    SetScaleObjectZ: (typeof THREE.Object3D);

    SetAxisLabelsX(numbers: typeof THREE.Object3D[]): void;//the labels for the x axis so that they can be pointed in the right direction
    SetAxisLabelsY(numbers: typeof THREE.Object3D[]): void;

    SetAxisLabelsZ(numbers: typeof THREE.Object3D[]): void;

    SetScaleX(num: number): void;//function to scale the graph on the x axis
    SetScaleY(num: number): void;

    SetScaleZ(num: number): void;

    GetObjectsToFaceCamera(): typeof THREE.Object3D[];//get all labels on the graph
    SetTitleText(title: string): void;

    SetTitleObject: (typeof THREE.Object3D);

    SetColour(colour: string): void;

    SetMeshObject: (typeof THREE.Object3D);//get the main mesh for the graph
    SetGridObjects(objs: typeof THREE.Object3D[]): void;

    SetGridVisable(checked: boolean): void;

    SetNumbersVisable(checked: boolean): void;
}