import {DataSet, DataSetAxis, DataSetChannel,Point} from "./DataSetClasses";

/*
* creates data sets from files given to it by the grapher for different types of files
* */
export class DataSetFactory{
    SeperationChar = ",";//used for declaring the character the csv which seperates cells
    TextChar="";//used for saying if the file has text surrounded by "" if using spaces
    constructor (){

    }

    /**
     * the main entry function to create a dataset structure and return it.
     * takes in various settings in order to decode the data set needed.
     * being basically bar or surface data and changes the output depending on the input.
     * based off of the inputs it directs it to another function.
     * @param input - string of data from the file in raw text
     * @param name - name of the data set
     * @param format - csv only right now but can be implemented
     * @param plotType - the kind of plot that was supplied either bar or surface
     * @param seperationChar - the character that seperates cells in the file
     * @param textChar - " if the words are surrounded by quotes
     * @param id - the id of the graph
     * @constructor
     */
    public CreateNewDataSet(input:string,name:string,format:string,plotType:string,seperationChar:string,textChar:string,id:number):DataSet{
        this.SeperationChar = seperationChar;
        this.TextChar = textChar;
        let matrixData = this.RemoveSpaceFromCSV(input);//clean the input data to an expected format
        console.log(matrixData);
        if(matrixData == null){//switch through the types this can accept
            throw new Error("a reading error occured, please check weather your file is comma or spaces.");
        }else{
            switch (format) {
                case "csv":{
                    console.log(plotType);
                    switch (plotType) {
                        case "bar":{
                            return this.CreateNewBarDataSetFromCSV(matrixData,name,id);
                            break;
                        }
                        case "surface":{
                            return this.CreateNewSurfaceDataSetFromCSV(matrixData,name,id);
                            break;
                        }
                        default:{
                            throw new Error("your plot type doesnt match what the grapher can handle, please use either bar or surface");
                            break;
                        }
                    }
                    break;
                }
                default :{
                    return null;
                }
            }

        }
    }

    /**
     * creates a bar data structure from the bar data
     * expects tabulated data so it throws an exception if not.
     * @param matrixData - grid of data in string format seperated by cells
     * @param name - name of the dataset
     * @return newGraph - dataset of the new graph as a bar graph plot
     * @constructor
     */
    private  CreateNewBarDataSetFromCSV(matrixData :string[][], name: string,id:number) : DataSet{
        //assumes titles at the top and side
        //assumes amount of data is constant, so no column has more data than the other for no reason or if data sets > amount of sets

        let titles = matrixData[0];

        let amountOfChannels : number = matrixData.length ;
        let amountOfAxis : number = titles.length ;


        let axis : Array<DataSetAxis> = new Array<DataSetAxis>();
        let rangeX : number[] = [0,amountOfAxis];
        let rangeY : number[] = [0,0];

        for (let c = 1; c < amountOfAxis ; c++) {//loop through arrays and make objects accordingly
            let channels : Array<DataSetChannel> = new Array<DataSetChannel>();

            for (let r = 1 ; r < amountOfChannels ; r++) {

                let point = new Point([+matrixData[r][c] ]);

                channels.push(new DataSetChannel(matrixData[r][0],point))
                if(point.GetValue()[0]<rangeY[0]){
                    rangeY[0] = point.GetValue()[0];
                }
                if(point.GetValue()[0]>rangeY[1]){
                    rangeY[1] = point.GetValue()[0];
                }
            }
            axis.push(new DataSetAxis(matrixData[0][c],channels));

        }
        let newGraph = new DataSet(name,axis,rangeX,rangeY,[0,0],id);

        return newGraph;
        //tested with single csv with many different values and console.log constantly checking values
    }

    /**
     * creates a surface data structure from the surface plot with triplets.
     * expects surface data so it throws an exception if not.
     * @param matrixData - grid of data in string format seperated by cells
     * @param name - name of the dataset
     * @return newGraph - dataset of the new graph as a surface plot
     * @constructor
     */
    private  CreateNewSurfaceDataSetFromCSV(matrixData :string[][], name: string,id : number) : DataSet{
        if(matrixData[0].length > 3){//if not in triplet format it spits it back out
            throw new Error("your data supplied is not consistent. check the columns are the same length and that you chose comma or space correctly.");
            return null;
        }
        let lastX= +matrixData[1][0];//doesnt check for text at the top. it asssumes it


        let axis : Array<DataSetAxis> = new Array<DataSetAxis>();
        let channels : Array<DataSetChannel> = new Array<DataSetChannel>();
        let rangeX : number[] = [0,0];//finds the largest and smallest values whilst parsing the data and is stored in these
        let rangeY : number[] = [0,0];//smallest first (0) and largest second (1)
        let rangeZ : number[] = [0,0];
        for (let c =1;c<matrixData.length;c++){

            let point = [];
            for (let r = 0 ; r < matrixData[c].length ; r++) {//finding largest nad smallest values
                point.push(+matrixData[c][r]);
                if(point[0]<rangeX[0]){
                    rangeX[0] = point[0];
                }
                if(point[0]>rangeX[1]){
                    rangeX[1] = point[0];
                }
                if(point[1]<rangeY[0]){
                    rangeY[0] = point[1];
                }
                if(point[1]>rangeY[1]){
                    rangeY[1] = point[1];
                }
                if(point[2]<rangeZ[0]){
                    rangeX[0] = point[2];
                }
                if(point[2]>rangeZ[1]){
                    rangeZ[1] = point[2];
                }

            }

            //setup the channels and axis for the data
            if(lastX>point[0]){
                axis.push(new DataSetAxis("",channels));
                channels = new Array<DataSetChannel>();
                lastX = point[0];
            }else {
                lastX = point[0];
            }
            // point has an array of values x,y,z
            channels.push(new DataSetChannel("",new Point(point )));

        }
        axis.push(new DataSetAxis("",channels));
        let newGraph = new DataSet(name,axis,rangeX,rangeY,rangeZ,id);
        return newGraph;
        //tested with single csv with many different values and console.log constantly checking values
    }

    /**
     * takes in data and strips out all unnecisary details that all formats dont need.
     * like blank space between cells and offset data. then returns it as a matrix
     * @param input - raw text input for data
     * @return matrix - matrix of string values for each cell in place
     * @constructor
     */
    private RemoveSpaceFromCSV(input:string){
        let rows = input.split(/\r?\n/);//split the document into rows
        if (rows.length <=1 ){//assumed rows of 1 are not plottable
            return null;
        }
        let dataXStart = 0;
        let dataYStart = 0;
        let found = false;
        for(let y = 0; y< rows.length; y++){
            for(let x = 0; x<rows[y].length; x++){
                if(rows[y].charAt(x) != this.SeperationChar){//searches for the data hidden in the text
                    dataXStart = x;
                    dataYStart = y;
                    found = true;
                    break;
                }
            }
            if (found){
                break;
            }
        }


        let matrix : string[][];
        matrix = [];
        let testLine = rows[0];
        if(!testLine.includes(this.SeperationChar)){//if the line doesnt include the seperation character its assumed a faulty file or wrong input settings
            return null;
        }
        let lastLength = testLine.split(this.SeperationChar).length;
        for (let i = 0; i < rows.length - dataYStart; i++) {//setup a 2 dimensional array of all the values
            matrix[i] = [];
            let rowSlice = rows[i+dataYStart].split(this.SeperationChar);//seperate out the values by the character set in the feilds
            if(rowSlice.length != lastLength){//if length is not consistent then its assumed faulty data
                return null;
            }
            matrix[i] = rowSlice.slice(dataXStart,rowSlice.length);
        }


        return matrix;
    }
}
