/**
 * Primary startup file
 *
 */

import {DataSet} from "./DataSetClasses";
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

    public CreateDataSetRequest(input : string,name:string,format:string){
        let newDataSet = this.dataSetFactory.CreateNewDataSet(input,name,format);

        console.log(newDataSet);
        if (newDataSet != null){
            this.dataSets.push(newDataSet);
        }
    }
}

class GraphRenderer {
    constructor(){
        const THREE = require('three');
        const OrbitControls = require('three-orbitcontrols');
        let displayWidth = window.innerWidth * 0.8;
        let displayHeight = window.innerHeight;

        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera( 75, displayWidth/displayHeight, 0.1, 1000 );
        let renderer = new THREE.WebGLRenderer();
        let controls = new OrbitControls(camera,renderer.domElement);
        controls.enableDamping = true;
        controls.update();

        renderer.setSize( window.innerWidth * 0.8,window.innerHeight);
        document.getElementById("DisplayArea").appendChild( renderer.domElement );

        let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

        scene.add( new THREE.AmbientLight( 0xcccccc ) );

        let cube = new THREE.Mesh( geometry, material );

        scene.add( cube );

        camera.position.z = 5;


        const animate = function () {
            requestAnimationFrame( animate );

            cube.rotation.x += 0.12;
            cube.rotation.y += 0.01;
            controls.update();

            renderer.render( scene, camera );
        };
        animate();


        window.addEventListener( 'resize', onWindowResize, false );
        function onWindowResize() {

            camera.aspect = displayWidth / displayHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( displayWidth, displayWidth );

        }

    }
}



/*
* manages the input given to it by the ui and then communicates functions accordingly
* */
class InputManager{
    owner : Grapher;
    constructor (owner : Grapher){
        this.owner=owner;
        document.getElementById('input_file').addEventListener('change', getFile)
    }
    public MakeNewDataSetFromFile(rawInput : string,name:string ,format:string) {
        //check for faulty files here
        this.owner.CreateDataSetRequest(rawInput,name,format);
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