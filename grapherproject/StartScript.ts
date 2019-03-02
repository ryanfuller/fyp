/**
 * Primary startup file
 *
 */

import {DataSet, Graph, BarGraph, SurfaceGraph} from "./DataSetClasses";
import {DataSetFactory} from "./DataSetFactory";
import {type} from "os";
const THREE = require('three');
/*
* main parent class that controls everything
* */


class Grapher {
    private inputManager = new InputManager(this);
    private dataSetFactory = new DataSetFactory();
    private graphRenderer = new GraphRenderer();

    //private graphs : Array<Graph> = new Array<Graph>();
    private dataSets : Array<DataSet> = new Array<DataSet>();

    private selectedDataSet: DataSet;

    constructor() {
    }

    public GetInputManager(){
        return this.inputManager;
    }

    public GetSelectedDataSet(){
        return this.selectedDataSet;
    }

    public GetGraphRenderer(){
        return this.graphRenderer;
    }
    public GetDataSets(){
        return this.dataSets;
    }
    public CreateDataSetRequest(input : string,name:string,format:string,plotType : string,seperationChar : string,textChar :string){
        let newDataSet;
        try{
            newDataSet = this.dataSetFactory.CreateNewDataSet(input,name,format,plotType,seperationChar,textChar);
        }catch (e) {
            alert(e.toString());
        }
        if (newDataSet != null){
            console.log(newDataSet);
            this.dataSets.push(newDataSet);
            this.selectedDataSet = this.dataSets[0];
            console.log(this.dataSets);
            switch (plotType) {
                case "bar":{
                    newDataSet.SetGraph(this.graphRenderer.CreateBarGraphFromDataSet(newDataSet));
                    break;
                }case "surface":{
                    newDataSet.SetGraph(this.graphRenderer.CreateSurfaceGraphFromDataSet(newDataSet));
                    break;
                }
                default : {
                    break;
                }
            }

        }else {
            alert("the data supplied was not formatted correctly, please check your file and retry");
        }
    }


}

class GraphRenderer {
    private OrbitControls = require('three-orbitcontrols');

    private fontJSON = require("./helvetiker_regular.typeface.json");

    private scene : any;

    private camera : any;

    private renderer: any;

    private controls:any;

    private loader = new THREE.FontLoader();

    private font = this.loader.parse(this.fontJSON);

    private OneGraph : any;

    public GetCamera(){
        return this.camera;
    }
    public GetScene(){
        return this.scene;
    }
    public GetRenderer(){
        return this.renderer;
    }
    public GetControls(){
        return this.controls;
    }


    constructor(){
        let displayWidthRatio = 0.8;
        let displayWidth = window.innerWidth * displayWidthRatio;
        let displayHeight = window.innerHeight;

        const scene = new THREE.Scene();
        this.scene = scene;
        let camera =  new THREE.PerspectiveCamera( 75, displayWidth/displayHeight, 0.1, 1000 );//new THREE.OrthographicCamera( displayWidth / - 25, displayWidth / 25, displayHeight / 25, displayHeight / - 25, 0, 500 );
        this.camera = camera;
        let renderer = new THREE.WebGLRenderer();
        this.renderer = renderer;
        let controls = new this.OrbitControls(camera,renderer.domElement);
        this.controls = controls;
        controls.enableDamping = true;
        controls.update();


        //scene
        scene.background = new THREE.Color( 0x92ecfc );
        scene.fog = new THREE.Fog( 0x92ecfc, 10, 50 );
        renderer.setSize( window.innerWidth * 0.8,window.innerHeight);
        document.getElementById("DisplayArea").appendChild( renderer.domElement );

        //lights
        let hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 20, 0 );
        scene.add( hemiLight );
        let dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( - 3, 10, - 10 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = - 2;
        dirLight.shadow.camera.left = - 2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        scene.add( dirLight );


        //floor
        let mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        mesh.position.y = -3;
        scene.add( mesh );

        //cube test
        /*let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

        let cube = new THREE.Mesh( geometry, material );
        cube.castShadow = true;
        cube.position.y = -3;
        scene.add( cube );*/

        //geometry test
        /*let material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        let geo = new THREE.Geometry();
        geo.vertices.push(
            new THREE.Vector3(-1,0,0),
            new THREE.Vector3(0,1.2,0),
            new THREE.Vector3(0,0.5,1),
            new THREE.Vector3(1,0,2),
        );
        geo.faces.push(new THREE.Face3(0,1,2));

        let generatedmesh = new THREE.Mesh(geo,material);
        scene.add(generatedmesh);
*/
        //camera
        camera.position.z = 5;




        window.addEventListener( 'resize', onWindowResize, false );
        function onWindowResize() {
            displayWidth = window.innerWidth * displayWidthRatio;
            displayHeight = window.innerHeight;

            camera.aspect = displayWidth / displayHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( displayWidth, displayHeight );

        }
    }

    public CreateSurfaceGraphFromDataSet(dataSet:DataSet):Graph{
        if(dataSet.GetGraph != null){
            this.scene.remove(this.OneGraph);
        }

        if (dataSet.GetGraph == null && dataSet.GetAxis.length > 0 ){
            let graphFixedSize = 6;
            let graphScalingFactor = 0.5;
            let axisScalingFactorX = graphFixedSize/(dataSet.GetRangeX[1] - dataSet.GetRangeX[0]) ;
            let axisScalingFactorY = graphFixedSize/(dataSet.GetRangeY[1] - dataSet.GetRangeY[0]) ;
            let axisScalingFactorZ = graphFixedSize/(dataSet.GetRangeZ[1] - dataSet.GetRangeZ[0]) ;


            let wireMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
            let blackMaterial = new THREE.MeshLambertMaterial({color:0x000000});
            let redMaterial = new THREE.MeshLambertMaterial({color:0xff0000});
            let randMaterial = new THREE.MeshLambertMaterial({color:Math.random()*0xffffff})
            redMaterial.side = THREE.DoubleSide;
            randMaterial.side = THREE.DoubleSide;

            let NameTextgeometry = new THREE.TextGeometry(dataSet.GetName,{font : this.font,size:0.5,height:0,material:0});
            let NameTextmesh = new THREE.Mesh(NameTextgeometry,blackMaterial);
            NameTextmesh.position.y = graphFixedSize + 1;

            //grids
            let size = 20;
            let divisions = 20;

            let gridX = new THREE.GridHelper( size, divisions );
            let gridY = new THREE.GridHelper( size, divisions );
            gridY.rotation.x = -Math.PI / 2;
            let gridZ = new THREE.GridHelper( size, divisions );
            gridZ.rotation.z = -Math.PI / 2;
            gridX.add(NameTextmesh);
            gridX.add(gridY);
            gridY.add(gridZ);


            let geo = new THREE.Geometry();


            for (let a = 0; a<dataSet.GetAxis.length;a++){
                for(let c = 0;c<dataSet.GetAxis[a].GetChannels.length;c++){

                    let point =dataSet.GetAxis[a].GetChannels[c].GetPoint.GetValue();
                    geo.vertices.push(new THREE.Vector3(point[0] * axisScalingFactorX, point[1]*axisScalingFactorY, point[2]*axisScalingFactorZ));

                }
            }


            let width = dataSet.GetAxis[0].GetChannels.length;
            let totalPoints = dataSet.GetAxis.length * width;
            let normal =  new THREE.Vector3( 0, 1, 0 );


            //squares for bottom right triangles
            for (let i=0;i<totalPoints - width -1;i++){
                if(i%width != width-1 || i == 0){
                    geo.faces.push(new THREE.Face3(i, i+1, i+1+width,normal));
                }
            }
            //squares for top left triangle
            for (let i=0;i<totalPoints - width -1;i++){
                if(i%width != width-1|| i == 0){
                    geo.faces.push(new THREE.Face3(i,i+1+width,i+width,normal));
                }
            }


            let mesh = new THREE.Mesh( geo, randMaterial );


            let geoEdge = new THREE.EdgesGeometry(mesh.geometry);
            let generatedmesh = new THREE.LineSegments(geoEdge,wireMaterial);
            generatedmesh.add(mesh);
            generatedmesh.rotation.x = -Math.PI / 2;
            gridX.add(generatedmesh);
            let NumberListX = new Array<typeof THREE.Object3D>();
            let NumberListY = new Array<typeof THREE.Object3D>();
            let NumberListZ = new Array<typeof THREE.Object3D>();


            //graph axis objects
            for(let x = 0; x<dataSet.GetAxis[0].GetChannels.length + 1;x++){
                let value = x * dataSet.GetRangeX[1]/dataSet.GetAxis[0].GetChannels.length;
                let numberGeo = new THREE.TextGeometry( "" + Number((value).toFixed(1)) ,{font : this.font,size:0.3,height:0,material:0});
                let number = new THREE.Mesh(numberGeo,blackMaterial);
                number.position.x =  x/dataSet.GetAxis[0].GetChannels.length  * graphFixedSize;
                number.lookAt(this.camera.position);
                NumberListX.push(number);
                gridX.add(number);
            }
            let axisXGeo = new THREE.TextGeometry( "X" ,{font : this.font,size:0.3,height:0,material:0});
            let axisX = new THREE.Mesh(axisXGeo,blackMaterial);
            axisX.position.x = graphFixedSize + 1;
            NumberListX.push(axisX);
            gridX.add(axisX);
            for(let y = 0; y<dataSet.GetAxis[0].GetChannels.length + 1;y++){
                let value =y  * dataSet.GetRangeY[1]/dataSet.GetAxis[0].GetChannels.length;
                let numberGeo = new THREE.TextGeometry( "" + Number((value).toFixed(1))  ,{font : this.font,size:0.3,height:0,material:0});
                let number = new THREE.Mesh(numberGeo,blackMaterial);
                number.position.z = -y/dataSet.GetAxis[0].GetChannels.length  * graphFixedSize;
                number.lookAt(this.camera.position);
                NumberListY.push(number);
                gridX.add(number);
            }
            let axisYGeo = new THREE.TextGeometry( "Y" ,{font : this.font,size:0.3,height:0,material:0});
            let axisY = new THREE.Mesh(axisYGeo,blackMaterial);
            axisY.position.z = -graphFixedSize - 1;
            NumberListY.push(axisY);
            gridX.add(axisY);
            for(let z = 0; z<dataSet.GetAxis[0].GetChannels.length + 1;z++){
                let value =z  * dataSet.GetRangeZ[1]/dataSet.GetAxis[0].GetChannels.length;
                let numberGeo = new THREE.TextGeometry( "" + Number((value).toFixed(1)) ,{font : this.font,size:0.3,height:0,material:0});
                let number = new THREE.Mesh(numberGeo,blackMaterial);

                number.position.y = z/dataSet.GetAxis[0].GetChannels.length  * graphFixedSize;
                number.lookAt(this.camera.position);
                NumberListY.push(number);
                gridX.add(number);
            }
            let axisZGeo = new THREE.TextGeometry( "Z" ,{font : this.font,size:0.3,height:0,material:0});
            let axisZ = new THREE.Mesh(axisZGeo,blackMaterial);
            axisZ.position.y = graphFixedSize + 1;
            NumberListZ.push(axisZ);
            gridX.add(axisZ);

            //text
            //NameTextmesh.scale.set(graphScalingFactor,graphScalingFactor,graphScalingFactor);
            //NameTextmesh.position.x = -dataSet.GetAxis[0].GetChannels.length/2 * graphScalingFactor;



            gridX.position.x = -graphFixedSize/2;
            gridX.position.y = -graphFixedSize/2;
            gridX.position.z = -graphFixedSize/2;



            this.scene.remove(this.OneGraph);
            this.OneGraph = gridX;

            this.scene.add(gridX);

            let surfaceGraph : SurfaceGraph = new SurfaceGraph();

            surfaceGraph.SetScaleObjectX(gridX);
            surfaceGraph.SetAxisLabelsX(NumberListX);
            surfaceGraph.SetScaleObjectY(gridY);
            surfaceGraph.SetAxisLabelsY(NumberListY);
            surfaceGraph.SetScaleObjectZ(gridZ);
            surfaceGraph.SetAxisLabelsZ(NumberListZ);
            return surfaceGraph;
        }else{
            //something!
            return null;
        }
    }
    public  CreateBarGraphFromDataSet(dataSet : DataSet) : Graph{
        if(dataSet.GetGraph != null){
            this.scene.remove(this.OneGraph);
        }

        if (dataSet.GetGraph == null && dataSet.GetAxis.length > 0 ){
            let barDistanceZ = 1;
            let barDistanceX = 1;
            let dataScalingFactor = 0.5;
            let graphScalingFactor = 0.5;
            let textOffset = 0.1;

            let blackMaterial = new THREE.MeshLambertMaterial({color:0x000000});
            let RedMaterial = new THREE.MeshLambertMaterial({color:0xff0000});


            let NameTextgeometry = new THREE.TextGeometry(dataSet.GetName,{font : this.font,size:0.5,height:0.1,material:0});
            let NameTextmesh = new THREE.Mesh(NameTextgeometry,blackMaterial);

            //text
            for( let textChannelNameIter = 0; textChannelNameIter < dataSet.GetAxis[0].GetChannels.length; textChannelNameIter++){
                let channelNameGeo = new THREE.TextGeometry(dataSet.GetAxis[0].GetChannels[textChannelNameIter].GetName,{font : this.font,size:0.5,height:0.1,material:0});
                let channelNameMesh = new THREE.Mesh(channelNameGeo,blackMaterial);

                channelNameMesh.rotation.z = -Math.PI / 2;
                channelNameMesh.position.x = textChannelNameIter * barDistanceX;
                channelNameMesh.position.z = -barDistanceZ;
                channelNameMesh.position.y = -textOffset;

                NameTextmesh.add(channelNameMesh);
            }

            for (let barAxisIter = 0;barAxisIter < dataSet.GetAxis.length;barAxisIter++ ){
                let randoMaterial = new THREE.MeshLambertMaterial({color:Math.random()*0xffffff});
                for(let barChannelIter = 0;barChannelIter <dataSet.GetAxis[barAxisIter].GetChannels.length;barChannelIter++){
                    let value = dataSet.GetAxis[barAxisIter].GetChannels[barChannelIter].GetPoint.GetValue()[0] * dataScalingFactor;
                    let cubegeo = new THREE.BoxGeometry( 1, value , 1 );
                    let cube = new THREE.Mesh( cubegeo, randoMaterial );
                    cube.castShadow = true;
                    cube.position.x = barChannelIter * barDistanceX;
                    cube.position.z = -barDistanceZ - barAxisIter;
                    cube.position.y = value/2;
                    NameTextmesh.add(cube);
                }
            }


            NameTextmesh.scale.set(graphScalingFactor,graphScalingFactor,graphScalingFactor);
            NameTextmesh.position.x = -dataSet.GetAxis[0].GetChannels.length/2 * graphScalingFactor;

            this.scene.remove(this.OneGraph);
            this.OneGraph = NameTextmesh;

            this.scene.add(NameTextmesh);
        }
        let barGraph : BarGraph = new BarGraph();

        return barGraph;
    }

    public UpdateLookAtCameraObjects(objects : DataSet[]) {
        for (let i =0;i<objects.length;i++){
            for (let n = 0; n<objects[i].GetGraph.GetObjectsToFaceCamera().length;n++){
                objects[i].GetGraph.GetObjectsToFaceCamera()[n].lookAt(this.camera.position);
            }
        }
    }
}






/*
* manages the input given to it by the ui and then communicates functions accordingly
* */
class InputManager{
    owner : Grapher;
    PlotTypeId = "plot_type";
    SeperationTypeId = "seperation_type";
    TextTypeId = "text_type";
    constructor (owner : Grapher){
        this.owner=owner;
        document.getElementById('input_file').addEventListener('change', getFile)
    }
    public ScaleGraphX(value : number){
        let dataSet = this.owner.GetSelectedDataSet();
        if(dataSet != null){
            if(dataSet.GetGraph != null){
                dataSet.GetGraph.SetScaleX(value);
            }
        }
    }
    public ScaleGraphY(value : number){
        let dataSet = this.owner.GetSelectedDataSet();
        if(dataSet != null){
            if(dataSet.GetGraph != null){
                dataSet.GetGraph.SetScaleY(value);
            }
        }
    }
    public ScaleGraphZ(value : number){
        let dataSet = this.owner.GetSelectedDataSet();
        if(dataSet != null){
            if(dataSet.GetGraph != null){
                dataSet.GetGraph.SetScaleZ(value);
            }
        }
    }

    //when any file is uploaded this is called by the async file upload button
    //it then searches for the inputs given and then passes them to the grapher
    public MakeNewDataSetFromFile(rawInput : string,name:string ,format:string) {

        let plotTypeElement = <HTMLSelectElement>document.getElementById(this.PlotTypeId);//done every time to guarentee its loaded
        let plotType = plotTypeElement.options[plotTypeElement.options.selectedIndex].value;//which is ok for an upload which doesnt happen often
        let seperationElement = <HTMLSelectElement>document.getElementById(this.SeperationTypeId);
        let seperationType = seperationElement.options[seperationElement.options.selectedIndex].value;
        let textElement = <HTMLSelectElement>document.getElementById(this.SeperationTypeId);
        let textType = textElement.options[textElement.options.selectedIndex].value;

        let seperationChar = ",";
        switch (seperationType) {
            case "comma":{
                seperationChar = ",";
                break;
            }
            case "space":{
                seperationChar = " ";
                break;
            }
            default :{
                seperationChar = ",";
            }
        }
        let textChar = "";
        switch (textType) {
            case "none":{
                textChar = "";
                break;
            }
            case "quotes":{
                textChar = "\"";
                break;
            }
            default :{
                textChar = "";
            }
        }

        this.owner.CreateDataSetRequest(rawInput,name,format,plotType,seperationChar,textChar);
    }
}


let grapher = new Grapher();
let inputManager = grapher.GetInputManager();


const animate = function () {
    requestAnimationFrame( animate );

    //cube.rotation.x += 0.12;
    //cube.rotation.y += 0.01;

    grapher.GetGraphRenderer().UpdateLookAtCameraObjects(grapher.GetDataSets());

    grapher.GetGraphRenderer().GetControls().update();
    grapher.GetGraphRenderer().GetRenderer().render( grapher.GetGraphRenderer().GetScene(), grapher.GetGraphRenderer().GetCamera());
};

animate();



let Xslider = document.getElementById("x_scale_input");
Xslider.oninput = function () {
    // @ts-ignore
    inputManager.ScaleGraphX(this.value);
}
let Yslider = document.getElementById("y_scale_input");
Yslider.oninput = function () {
    // @ts-ignore
    inputManager.ScaleGraphY(this.value);
}
let Zslider = document.getElementById("z_scale_input");
Zslider.oninput = function () {
    // @ts-ignore
    inputManager.ScaleGraphZ(this.value);
}


/*
* function passed to html elements to call when a file is passed to it
* */
function getFile(event:any) {
    const input = event.target;
    if ('files' in input && input.files.length > 0) {//works with repeat changes to file importing
        placeFileContent(document.getElementById('content-target'),input.files[0]);//uses only the first file if multiple are chosen

    }
}
/*
* takes the blob file and creates a data set from it.
* files are assumed to have a .extension and splits it based off of file name.
* */
function placeFileContent(target: any, file: any) {
    let fileName :string = file.name.split(".");
    let name : string = fileName[0];
    let format : string = fileName[1];
    // @ts-ignore
    readFileContent(file).then(content => {inputManager.MakeNewDataSetFromFile(content,name,format);target.value = content}).catch(error => console.log(error));
}

/*
* reads the file as a promise and returns the result when it is complete
* if it cant it throws an error log
* */
function readFileContent(file : any) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        // @ts-ignore
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    })
}