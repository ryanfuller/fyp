/**
 * Primary startup file
 *
 */

import {DataSet,Graph,BarGraph} from "./DataSetClasses";
import {DataSetFactory} from "./DataSetFactory";
/*
* main parent class that controls everything
* */
class Grapher {
    private inputManager = new InputManager(this);
    private dataSetFactory = new DataSetFactory();
    private graphRenderer = new GraphRenderer();

    //private graphs : Array<Graph> = new Array<Graph>();
    private dataSets : Array<DataSet> = new Array<DataSet>();

    constructor() {
    }

    public GetInputManager(){
        return this.inputManager;
    }

    public CreateDataSetRequest(input : string,name:string,format:string,plotType : string,seperationChar : string,textChar :string){

        let newDataSet = this.dataSetFactory.CreateNewDataSet(input,name,format,plotType,seperationChar,textChar);

        if (newDataSet != null){
            console.log(newDataSet);
            this.dataSets.push(newDataSet);
            newDataSet.SetGraph(this.graphRenderer.CreateBarGraphFromDataSet(newDataSet));
        }else {
            alert("sorry the data supplied was not correctly formatted");
        }
    }
}

class GraphRenderer {
    private THREE = require('three');
    private OrbitControls = require('three-orbitcontrols');

    private fontJSON = require("./helvetiker_regular.typeface.json");

    private scene : any;

    private loader = new this.THREE.FontLoader();

    private font = this.loader.parse(this.fontJSON);

    private OneGraph : any;

    constructor(){
        let displayWidthRatio = 0.8;
        let displayWidth = window.innerWidth * displayWidthRatio;
        let displayHeight = window.innerHeight;

        const scene = new this.THREE.Scene();
        this.scene = scene;
        let camera = new this.THREE.PerspectiveCamera( 75, displayWidth/displayHeight, 0.1, 1000 );
        let renderer = new this.THREE.WebGLRenderer();
        let controls = new this.OrbitControls(camera,renderer.domElement);
        controls.enableDamping = true;
        controls.update();

        //scene
        scene.background = new this.THREE.Color( 0x92ecfc );
        scene.fog = new this.THREE.Fog( 0x92ecfc, 10, 50 );
        renderer.setSize( window.innerWidth * 0.8,window.innerHeight);
        document.getElementById("DisplayArea").appendChild( renderer.domElement );

        //lights
        let hemiLight = new this.THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 20, 0 );
        scene.add( hemiLight );
        let dirLight = new this.THREE.DirectionalLight( 0xffffff );
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
        let mesh = new this.THREE.Mesh( new this.THREE.PlaneBufferGeometry( 100, 100 ), new this.THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        mesh.position.y = -3;
        scene.add( mesh );

        //cube test
        /*let geometry = new this.THREE.BoxGeometry( 1, 1, 1 );
        let material = new this.THREE.MeshPhongMaterial( { color: 0x00ff00 } );

        let cube = new this.THREE.Mesh( geometry, material );
        cube.castShadow = true;
        cube.position.y = -3;
        scene.add( cube );*/

        //geometry test
        let material = new this.THREE.MeshPhongMaterial( { color: 0x00ff00 } );
        let geo = new this.THREE.Geometry();
        geo.vertices.push(
            new this.THREE.Vector3(-1,0,0),
            new this.THREE.Vector3(0,1.2,0),
            new this.THREE.Vector3(0,0.5,1),
            new this.THREE.Vector3(1,0,2),
        );
        geo.faces.push(new this.THREE.Face3(0,1,2));

        let generatedmesh = new this.THREE.Mesh(geo,material);
        scene.add(generatedmesh);

        //camera
        camera.position.z = 5;


        const animate = function () {
            requestAnimationFrame( animate );

            //cube.rotation.x += 0.12;
            //cube.rotation.y += 0.01;
            controls.update();

            renderer.render( scene, camera );
        };
        animate();


        window.addEventListener( 'resize', onWindowResize, false );
        function onWindowResize() {
            displayWidth = window.innerWidth * displayWidthRatio;
            displayHeight = window.innerHeight;

            camera.aspect = displayWidth / displayHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( displayWidth, displayHeight );

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

            let blackMaterial = new this.THREE.MeshLambertMaterial({color:0x000000});
            let RedMaterial = new this.THREE.MeshLambertMaterial({color:0xff0000});


            let NameTextgeometry = new this.THREE.TextGeometry(dataSet.GetName,{font : this.font,size:0.5,height:0.1,material:0});
            let NameTextmesh = new this.THREE.Mesh(NameTextgeometry,blackMaterial);

            //text
            for( let textChannelNameIter = 0; textChannelNameIter < dataSet.GetAxis[0].GetChannels.length; textChannelNameIter++){
                let channelNameGeo = new this.THREE.TextGeometry(dataSet.GetAxis[0].GetChannels[textChannelNameIter].GetName,{font : this.font,size:0.5,height:0.1,material:0});
                let channelNameMesh = new this.THREE.Mesh(channelNameGeo,blackMaterial);

                channelNameMesh.rotation.z = -Math.PI / 2;
                channelNameMesh.position.x = textChannelNameIter * barDistanceX;
                channelNameMesh.position.z = -barDistanceZ;
                channelNameMesh.position.y = -textOffset;

                NameTextmesh.add(channelNameMesh);
            }

            for (let barAxisIter = 0;barAxisIter < dataSet.GetAxis.length;barAxisIter++ ){
                let randoMaterial = new this.THREE.MeshLambertMaterial({color:Math.random()*0xffffff});
                for(let barChannelIter = 0;barChannelIter <dataSet.GetAxis[barAxisIter].GetChannels.length;barChannelIter++){
                    let value = dataSet.GetAxis[barAxisIter].GetChannels[barChannelIter].GetPoint.GetValue() * dataScalingFactor;
                    let cubegeo = new this.THREE.BoxGeometry( 1, value , 1 );
                    let cube = new this.THREE.Mesh( cubegeo, randoMaterial );
                    cube.castShadow = true;
                    cube.position.x = barChannelIter * barDistanceX;
                    cube.position.z = -barDistanceZ - barAxisIter;
                    cube.position.y = value/2;
                    NameTextmesh.add(cube);
                }
            }


            NameTextmesh.scale.set(graphScalingFactor,graphScalingFactor,graphScalingFactor);
            NameTextmesh.position.x = -dataSet.GetAxis[0].GetChannels.length/2 * graphScalingFactor;

            this.OneGraph = NameTextmesh;

            this.scene.add(NameTextmesh);
        }
        let barGraph : BarGraph = new BarGraph();

        return barGraph;
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