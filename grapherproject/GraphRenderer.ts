import {DataSet} from "./DataSet";
import {Graph} from "./Graph";
import {SurfaceGraph} from "./SurfaceGraph";
import {BarGraph} from "./BarGraph";

const THREE = require('three');

export class GraphRenderer {
    private OrbitControls = require('three-orbitcontrols');

    private fontJSON = require("./helvetiker_regular.typeface.json");

    private scene: any;

    private camera: any;

    private renderer: any;

    private controls: any;

    private loader = new THREE.FontLoader();

    private font = this.loader.parse(this.fontJSON);

    public GetCamera() {
        return this.camera;
    }

    public GetScene() {
        return this.scene;
    }

    public GetRenderer() {
        return this.renderer;
    }

    public GetControls() {
        return this.controls;
    }

    /**
     * initialises all the objects and scene needed for the graphs to be drawn on
     * scene setup and vital three objects setup here
     */
    constructor() {
        let displayWidthRatio = 0.8;
        let displayWidth = window.innerWidth * displayWidthRatio;
        let displayHeight = window.innerHeight;

        const scene = new THREE.Scene();
        this.scene = scene;
        let camera = new THREE.PerspectiveCamera(75, displayWidth / displayHeight, 0.1, 1000);//new THREE.OrthographicCamera( displayWidth / - 25, displayWidth / 25, displayHeight / 25, displayHeight / - 25, 0, 500 );
        this.camera = camera;
        let renderer = new THREE.WebGLRenderer();
        this.renderer = renderer;
        let controls = new this.OrbitControls(camera, renderer.domElement);
        this.controls = controls;
        controls.enableDamping = true;
        controls.update();


        //scene
        scene.background = new THREE.Color(0x92ecfc);
        scene.fog = new THREE.Fog(0x92ecfc, 10, 50);
        renderer.setSize(window.innerWidth * 0.8, window.innerHeight);
        document.getElementById("DisplayArea").appendChild(renderer.domElement);

        //lights
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);
        let dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(-3, 10, -10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = -2;
        dirLight.shadow.camera.left = -2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        scene.add(dirLight);


        //floor
        let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshPhongMaterial({
            color: 0x999999,
            depthWrite: false
        }));
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        mesh.position.y = -3;
        scene.add(mesh);

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


        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            displayWidth = window.innerWidth * displayWidthRatio;
            displayHeight = window.innerHeight;

            camera.aspect = displayWidth / displayHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(displayWidth, displayHeight);

        }
    }

    /**
     * creates the surface graph graphics from the dataset given
     * adds it to the scene and then renders it and passes back the surface graph data
     * @param dataSet - dataset in surface format with triplet values
     * @return surfaceGraph - surface graph object
     * @constructor
     */
    public CreateSurfaceGraphFromDataSet(dataSet: DataSet): Graph {


        if (dataSet.GetGraph == null && dataSet.GetAxis.length > 0) {
            let graphFixedSize = 6;//the scale of the graph in world units and what it fits the data into
            let axisScalingFactorX = graphFixedSize / (dataSet.GetRangeX[1] - dataSet.GetRangeX[0]);//based on max values these are
            let axisScalingFactorY = graphFixedSize / (dataSet.GetRangeY[1] - dataSet.GetRangeY[0]);
            let axisScalingFactorZ = graphFixedSize / (dataSet.GetRangeZ[1] - dataSet.GetRangeZ[0]);

            //setup materials, wireframe draws the lines on the surface
            let wireMaterial = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2});
            let blackMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
            let redMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
            let randMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff})
            redMaterial.side = THREE.DoubleSide;
            randMaterial.side = THREE.DoubleSide;

            let NameTextgeometry = new THREE.TextGeometry(dataSet.GetName, {
                font: this.font,
                size: 0.5,
                height: 0,
                material: 0
            });
            let NameTextmesh = new THREE.Mesh(NameTextgeometry, blackMaterial);
            NameTextmesh.position.y = graphFixedSize + 1;

            //grids setup and positioned for plotting visability
            let size = 20;
            let divisions = 20;

            let gridX = new THREE.GridHelper(size, divisions);
            let gridY = new THREE.GridHelper(size, divisions);
            gridY.rotation.x = -Math.PI / 2;
            let gridZ = new THREE.GridHelper(size, divisions);
            gridZ.rotation.z = -Math.PI / 2;
            gridX.add(NameTextmesh);
            gridX.add(gridY);
            gridY.add(gridZ);

            //graph mesh loops through the points and makes a new mesh for the data
            let geo = new THREE.Geometry();


            for (let a = 0; a < dataSet.GetAxis.length; a++) {
                for (let c = 0; c < dataSet.GetAxis[a].GetChannels.length; c++) {

                    let point = dataSet.GetAxis[a].GetChannels[c].GetPoint.GetValue();
                    geo.vertices.push(new THREE.Vector3(point[0] * axisScalingFactorX, point[1] * axisScalingFactorY, point[2] * axisScalingFactorZ));

                }
            }


            let width = dataSet.GetAxis[0].GetChannels.length;
            let totalPoints = dataSet.GetAxis.length * width;
            let normal = new THREE.Vector3(0, 1, 0);

            //draws faces on all the points in order
            //squares for bottom right triangles
            for (let i = 0; i < totalPoints - width - 1; i++) {
                if (i % width != width - 1 || i == 0) {
                    geo.faces.push(new THREE.Face3(i, i + 1, i + 1 + width, normal));
                }
            }
            //squares for top left triangle
            for (let i = 0; i < totalPoints - width - 1; i++) {
                if (i % width != width - 1 || i == 0) {
                    geo.faces.push(new THREE.Face3(i, i + 1 + width, i + width, normal));
                }
            }


            let mesh = new THREE.Mesh(geo, randMaterial);

            //labels and scales
            let geoEdge = new THREE.EdgesGeometry(mesh.geometry);
            let generatedmesh = new THREE.LineSegments(geoEdge, wireMaterial);
            generatedmesh.add(mesh);
            generatedmesh.rotation.x = -Math.PI / 2;
            gridX.add(generatedmesh);
            let NumberListX = new Array<typeof THREE.Object3D>();
            let NumberListY = new Array<typeof THREE.Object3D>();
            let NumberListZ = new Array<typeof THREE.Object3D>();
            let AmountOfNumbersPerAxis = 5;

            let XExponent = Math.round(Math.log10(dataSet.GetRangeX[1]));
            let YExponent = Math.round(Math.log10(dataSet.GetRangeX[1]));
            let ZExponent = Math.round(Math.log10(dataSet.GetRangeX[1]));

            let XNumberDiferance = 10** XExponent;
            let YNumberDiferance = 10** YExponent;
            let ZNumberDiferance = 10** ZExponent;
            /*let XNumberDiferance = Math.round(10 * (dataSet.GetRangeX[1]/AmountOfNumbersPerAxis))/10;
            let YNumberDiferance = Math.round(10 * (dataSet.GetRangeY[1]/AmountOfNumbersPerAxis))/10;
            let ZNumberDiferance = Math.round(10 * (dataSet.GetRangeZ[1]/AmountOfNumbersPerAxis))/10;*/

            //graph axis objects
            for (let x = 0; x < AmountOfNumbersPerAxis+1; x++) {
                let value = x * XNumberDiferance;
                let numberGeo = new THREE.TextGeometry("" + Number((value).toFixed(1)), {
                    font: this.font,
                    size: 0.3,
                    height: 0,
                    material: 0
                });
                let number = new THREE.Mesh(numberGeo, blackMaterial);
                number.position.x = (value / dataSet.GetRangeX[1]) * graphFixedSize;
                number.lookAt(this.camera.position);
                NumberListX.push(number);
                gridX.add(number);
            }
            let axisXGeo = new THREE.TextGeometry("X", {font: this.font, size: 0.3, height: 0, material: 0});
            let axisX = new THREE.Mesh(axisXGeo, blackMaterial);
            axisX.position.x = graphFixedSize + 1;
            NumberListX.push(axisX);
            gridX.add(axisX);
            for (let y = 0; y < AmountOfNumbersPerAxis + 1; y++) {
                let value = y * YNumberDiferance;
                let numberGeo = new THREE.TextGeometry("" + Number((value).toFixed(1)), {
                    font: this.font,
                    size: 0.3,
                    height: 0,
                    material: 0
                });
                let number = new THREE.Mesh(numberGeo, blackMaterial);
                number.position.z = -(value / dataSet.GetRangeY[1]) * graphFixedSize;
                number.lookAt(this.camera.position);
                NumberListY.push(number);
                gridX.add(number);
            }
            let axisYGeo = new THREE.TextGeometry("Y", {font: this.font, size: 0.3, height: 0, material: 0});
            let axisY = new THREE.Mesh(axisYGeo, blackMaterial);
            axisY.position.z = -graphFixedSize - 1;
            NumberListY.push(axisY);
            gridX.add(axisY);
            for (let z = 0; z < AmountOfNumbersPerAxis + 1; z++) {
                let value = z * ZNumberDiferance;
                let numberGeo = new THREE.TextGeometry("" + Number((value).toFixed(1)), {
                    font: this.font,
                    size: 0.3,
                    height: 0,
                    material: 0
                });
                let number = new THREE.Mesh(numberGeo, blackMaterial);

                number.position.y = (value / dataSet.GetRangeZ[1]) * graphFixedSize;
                number.lookAt(this.camera.position);
                NumberListY.push(number);
                gridX.add(number);
            }
            let axisZGeo = new THREE.TextGeometry("Z", {font: this.font, size: 0.3, height: 0, material: 0});
            let axisZ = new THREE.Mesh(axisZGeo, blackMaterial);
            axisZ.position.y = graphFixedSize + 1;
            NumberListZ.push(axisZ);
            gridX.add(axisZ);

            //text
            //NameTextmesh.scale.set(graphScalingFactor,graphScalingFactor,graphScalingFactor);
            //NameTextmesh.position.x = -dataSet.GetAxis[0].GetChannels.length/2 * graphScalingFactor;


            gridX.position.x = -graphFixedSize / 2;
            gridX.position.y = -graphFixedSize / 2;
            gridX.position.z = -graphFixedSize / 2;


            this.scene.add(gridX);

            let surfaceGraph: SurfaceGraph = new SurfaceGraph();

            surfaceGraph.SetDrawableObject(gridX);
            surfaceGraph.SetScaleObjectX(gridX);
            surfaceGraph.SetAxisLabelsX(NumberListX);
            surfaceGraph.SetScaleObjectY(gridY);
            surfaceGraph.SetAxisLabelsY(NumberListY);
            surfaceGraph.SetScaleObjectZ(gridZ);
            surfaceGraph.SetAxisLabelsZ(NumberListZ);
            surfaceGraph.SetTitleObject(NameTextmesh);
            surfaceGraph.SetMeshObject(mesh);
            surfaceGraph.SetGridObjects([gridX, gridY, gridZ]);

            return surfaceGraph;
        } else {
            //something!
            return null;
        }
    }

    public RemoveAllGraphsFromScene(sets: DataSet[]) {
        for (let i = 0; i < sets.length; i++) {
            this.scene.remove(sets[i].GetGraph.GetDrawableObject());
        }
    }

    public DrawGraph(set: DataSet) {
        this.scene.add(set.GetGraph.GetDrawableObject());
    }

    /**
     * creates the bargraph graphics from the dataset given
     * adds it to the scene and then renders it and passes back the bargraph data
     * @param dataSet - dataset in bargraph format with single values
     * @return barGraph - barGraph Graph object
     * @constructor
     */
    public CreateBarGraphFromDataSet(dataSet: DataSet): Graph {

        let barGraph: BarGraph = new BarGraph();
        if (dataSet.GetGraph == null && dataSet.GetAxis.length > 0) {
            let barDistanceZ = 1;//size of the bars depth
            let barDistanceX = 1;//size of the bars width
            let dataScalingFactor = 0.5;//data scaling for each value
            let graphScalingFactor = 0.5;//graph as a whole scaled down
            let textOffset = 0.1;//text distance away from the graph

            let blackMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
            let RedMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});


            let NameTextgeometry = new THREE.TextGeometry(dataSet.GetName, {
                font: this.font,
                size: 0.5,
                height: 0.1,
                material: 0
            });
            let NameTextmesh = new THREE.Mesh(NameTextgeometry, blackMaterial);

            //text creation
            let textList = new Array<typeof THREE.Object3D>();
            for (let textChannelNameIter = 0; textChannelNameIter < dataSet.GetAxis[0].GetChannels.length; textChannelNameIter++) {
                let channelNameGeo = new THREE.TextGeometry(dataSet.GetAxis[0].GetChannels[textChannelNameIter].GetName, {
                    font: this.font,
                    size: 0.5,
                    height: 0.1,
                    material: 0
                });
                let channelNameMesh = new THREE.Mesh(channelNameGeo, blackMaterial);

                channelNameMesh.rotation.z = -Math.PI / 2;
                channelNameMesh.position.x = textChannelNameIter * barDistanceX;
                channelNameMesh.position.z = -barDistanceZ;
                channelNameMesh.position.y = -textOffset;
                channelNameMesh.lookAt(this.camera.position);
                textList.push(channelNameMesh);
                NameTextmesh.add(channelNameMesh);
            }

            //create a cube for each channel in all axis stored in the dataset
            for (let barAxisIter = 0; barAxisIter < dataSet.GetAxis.length; barAxisIter++) {
                let randoMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
                for (let barChannelIter = 0; barChannelIter < dataSet.GetAxis[barAxisIter].GetChannels.length; barChannelIter++) {
                    let value = dataSet.GetAxis[barAxisIter].GetChannels[barChannelIter].GetPoint.GetValue()[0] * dataScalingFactor;
                    let cubegeo = new THREE.BoxGeometry(1, value, 1);
                    let cube = new THREE.Mesh(cubegeo, randoMaterial);
                    cube.castShadow = true;
                    cube.position.x = barChannelIter * barDistanceX;
                    cube.position.z = -barDistanceZ - barAxisIter;
                    cube.position.y = value / 2;
                    NameTextmesh.add(cube);
                }
            }

            //name mesh is the parent for all the objects in the graph
            NameTextmesh.scale.set(graphScalingFactor, graphScalingFactor, graphScalingFactor);
            NameTextmesh.position.x = -dataSet.GetAxis[0].GetChannels.length / 2 * graphScalingFactor;


            this.scene.add(NameTextmesh);

            barGraph.SetDrawableObject(NameTextmesh);
            barGraph.SetScaleObjectX(NameTextmesh);
            barGraph.SetAxisLabelsX(textList);
            barGraph.SetScaleObjectY(NameTextmesh);
            barGraph.SetScaleObjectZ(NameTextmesh);
            barGraph.SetTitleObject(NameTextmesh);

        }


        return barGraph;
    }

    /**
     * requests an array of datasets and then sets each of the available labels to look at the camera
     * @param objects - dataset array
     * @constructor
     */
    public UpdateLookAtCameraObjects(objects: DataSet[]) {
        for (let i = 0; i < objects.length; i++) {
            for (let n = 0; n < objects[i].GetGraph.GetObjectsToFaceCamera().length; n++) {
                objects[i].GetGraph.GetObjectsToFaceCamera()[n].lookAt(this.camera.position);
            }
        }
    }
}