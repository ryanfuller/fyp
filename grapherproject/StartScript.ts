/**
 * Primary startup file
 *
 */

import {DataSet} from "./DataSet";
import {DataSetFactory} from "./DataSetFactory";
import {GraphRenderer} from "./GraphRenderer";

/**
* main parent class that controls everything
* */
class Grapher {
    private inputManager = new InputManager(this);
    private dataSetFactory = new DataSetFactory();
    private graphRenderer = new GraphRenderer();
    private graphID = 0;
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

    public SetSelectedDataSet(dataSet:DataSet){
        this.selectedDataSet = dataSet;
        this.graphRenderer.RemoveAllGraphsFromScene(this.dataSets);
        this.graphRenderer.DrawGraph(dataSet);
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
            newDataSet = this.dataSetFactory.CreateNewDataSet(input,name,format,plotType,seperationChar,textChar,this.graphID);
        }catch (e) {
            alert(e.toString());
        }
        this.graphID+=1;
        if (newDataSet != null){
            this.dataSets.push(newDataSet);
            this.selectedDataSet = newDataSet;
            console.log("dataset v");
            console.log(newDataSet );
            console.log("datasets v");
            console.log(this.dataSets);
            console.log(plotType);
            switch (plotType){
                case "bar":{
                    newDataSet.SetGraph(this.graphRenderer.CreateBarGraphFromDataSet(newDataSet));
                    this.inputManager.UpdateGraphList();
                    this.graphRenderer.RemoveAllGraphsFromScene(this.dataSets);
                    this.graphRenderer.DrawGraph(newDataSet);
                    break;
                }case "surface":{
                    newDataSet.SetGraph(this.graphRenderer.CreateSurfaceGraphFromDataSet(newDataSet));
                    this.inputManager.UpdateGraphList();
                    this.graphRenderer.RemoveAllGraphsFromScene(this.dataSets);
                    this.graphRenderer.DrawGraph(newDataSet);
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






/**
* manages the input given to it by the ui and then communicates functions accordingly
 * only parses signals and does not perform functions on them
* */
class InputManager{
    owner : Grapher;
    //html elements ids
    PlotTypeId = "plot_type";
    SeperationTypeId = "seperation_type";
    TextTypeId = "text_type";
    GraphListId = "graph_list";

    /**
     * must be initialised with a main grapher to control it and to send inputs to
     * @param owner
     */
    constructor (owner : Grapher){
        this.owner=owner;
        document.getElementById('input_file').addEventListener('change', getFile)
    }

    /**
     * takes in a 0 to 100 value from the sliders for scale
     * @param value - number ranging from 0 to 100
     * @constructor
     */
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

    ChangeGraphTitleLabel(value: string) {
        let dataSet = this.owner.GetSelectedDataSet();
        if(dataSet != null){
            if(dataSet.GetGraph!=null){
                dataSet.GetGraph.SetTitleText(value);
            }
        }
    }
    ChangeGraphColour(value: string) {
        let dataSet = this.owner.GetSelectedDataSet();
        if(dataSet != null){
            if(dataSet.GetGraph!=null){
                dataSet.GetGraph.SetColour(value);
            }
        }
    }

    ToggleGrid(checked: boolean) {
        let dataSet = this.owner.GetSelectedDataSet();
        if(dataSet != null){
            if(dataSet.GetGraph!=null){
                dataSet.GetGraph.SetGridVisable(checked);
            }
        }
    }

    ToggleNumbers(checked: boolean) {
        let dataSet = this.owner.GetSelectedDataSet();
        if(dataSet != null){
            if(dataSet.GetGraph!=null){
                dataSet.GetGraph.SetNumbersVisable(checked);
            }
        }
    }
    /**
     * when any file is uploaded this is called by the async file upload button
     * it then searches for the inputs given and then passes them to the grapher
     * @param rawInput - file data
     * @param name - file name
     * @param format - format of the file (only csv accepted so far)
     * @constructor
     */
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
        //passes signals to a create data request
        this.owner.CreateDataSetRequest(rawInput,name,format,plotType,seperationChar,textChar);
    }

    public UpdateGraphList(){
        let list = document.getElementById(this.GraphListId);
        
        // @ts-ignore
        for (let x = 0;x<list.options.length;x++) {
            // @ts-ignore
            list.options[x] = null;
        }
        let sets = this.owner.GetDataSets();
        for (let i =0;i<sets.length;i++) {
            let option = document.createElement("option");
            option.value = sets[i].GetID + "";
            option.innerText = sets[i].GetName;
            if (sets[i] == this.owner.GetSelectedDataSet()){
                option.selected = true;
            }
            // @ts-ignore
            list.add(option);
        }
    }

    public SetSelectedGraph(id:number){
        let sets = this.owner.GetDataSets();
        for (let i =0;i<sets.length;i++){
            if(sets[i].GetID == id){
                this.owner.SetSelectedDataSet(sets[i]);
            }
        }
    }
}

//initialise grapher and input manager
let grapher = new Grapher();
let inputManager = grapher.GetInputManager();

/**
 * the animate function that updates every frame
 * only vital things can go in here like rendering the scene and updating camera controls
 */
const animate = function () {
    requestAnimationFrame( animate );


    grapher.GetGraphRenderer().UpdateLookAtCameraObjects(grapher.GetDataSets());

    grapher.GetGraphRenderer().GetControls().update();
    grapher.GetGraphRenderer().GetRenderer().render( grapher.GetGraphRenderer().GetScene(), grapher.GetGraphRenderer().GetCamera());
};

animate();


/**
 * sliders for the ui
 */
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

/**
 * title label for the ui
 */
let titleInput = document.getElementById("title_label");
titleInput.oninput = function () {
    // @ts-ignore
    inputManager.ChangeGraphTitleLabel(this.value);
}
/**
 * colour label for the ui
 */
let colourInput = document.getElementById("colour_input");
colourInput.oninput = function () {
    // @ts-ignore
    inputManager.ChangeGraphColour(this.value);
}
/**
 * Toggle Grid for the graph
 */
let toggleGridInput = document.getElementById("toggle_grid");
toggleGridInput.onclick = function () {
    // @ts-ignore
    inputManager.ToggleGrid(this.checked);
}
/**
 * Toggle Numbers for the graph
 */
let toggleNumbersInput = document.getElementById("toggle_numbers");
toggleNumbersInput.onclick = function () {
    // @ts-ignore
    inputManager.ToggleNumbers(this.checked);
}

/**
 * change the graph chosen from the list
 */
let graphListInput = document.getElementById("graph_list");
graphListInput.onchange = function () {
    // @ts-ignore
    inputManager.SetSelectedGraph(this.value);
}




/**
* function passed to html elements to call when a file is passed to it
* */
function getFile(event:any) {
    const input = event.target;
    if ('files' in input && input.files.length > 0) {//works with repeat changes to file importing
        placeFileContent(document.getElementById('content-target'),input.files[0]);//uses only the first file if multiple are chosen

    }
}
/**
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

/**
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