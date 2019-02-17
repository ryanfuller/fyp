import {DataSet, DataSetAxis, DataSetChannel,Point} from "./DataSetClasses";
import {strict} from "assert";
/*
* creates data sets from files given to it by the grapher for different types of files
* */
export class DataSetFactory{
    SeperationChar = ",";
    TextChar="";
    constructor (){

    }
    public  CreateNewDataSet(input:string,name:string,format:string,plotType:string,seperationChar:string,textChar:string):DataSet{
        this.SeperationChar = seperationChar;
        this.TextChar = textChar;
        let matrixData = this.RemoveSpaceFromCSV(input);

        switch (format) {
            case "csv":{
                console.log(plotType);
                switch (plotType) {
                    case "bar":{
                        return this.CreateNewBarDataSetFromCSV(matrixData,name);
                        break;
                    }
                    case "surface":{
                        return this.CreateNewSurfaceDataSetFromCSV(matrixData,name);
                        break;
                    }
                    default:{
                        alert("your plot type doesnt match what the grapher can handle");
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
    private  CreateNewBarDataSetFromCSV(matrixData :string[][], name: string) : DataSet{
        //known issues, this does not take into account csv files with arbitrary white space
        //assumes titles at the top and side
        //assumes amount of data is constant, so no colum has more data than the other for no reason or if data sets > amount of sets


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

        let newGraph = new DataSet(name,axis,rangeX,rangeY,[0,0]);

        return newGraph;
        //tested with single csv with many different values and console.log constantly checking values
    }


    private  CreateNewSurfaceDataSetFromCSV(matrixData :string[][], name: string) : DataSet{
        console.log(matrixData);
        if(matrixData[0].length > 3){
            alert("your surface data has too many dimensions for this universe");
            return null;
        }
        let lastX= +matrixData[1][0];//doesnt check for text at the top. it asssumes it


        let axis : Array<DataSetAxis> = new Array<DataSetAxis>();
        let channels : Array<DataSetChannel> = new Array<DataSetChannel>();
        let rangeX : number[] = [0,0];
        let rangeY : number[] = [0,0];
        let rangeZ : number[] = [0,0];
        for (let c =1;c<matrixData.length;c++){

            let point = [];
            for (let r = 0 ; r < matrixData[c].length ; r++) {
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

            if(lastX>point[0]){
                axis.push(new DataSetAxis("",channels));
                channels = new Array<DataSetChannel>();
                lastX = point[0];
            }else {
                lastX = point[0];
            }
            channels.push(new DataSetChannel("",new Point(point )));

        }
        axis.push(new DataSetAxis("",channels));
        let newGraph = new DataSet(name,axis,rangeX,rangeY,rangeZ);
        return newGraph;
        //tested with single csv with many different values and console.log constantly checking values
    }

    private RemoveSpaceFromCSV(input:string){
        let rows = input.split(/\r?\n/);//split the document into rows
        if (rows.length <=1 ){
            return null;
        }
        let dataXStart = 0;
        let dataYstart = 0;
        let found = false;
        for(let y = 0; y< rows.length; y++){
            for(let x = 0; x<rows[y].length; x++){
                if(rows[y].charAt(x) != this.SeperationChar){
                    dataXStart = x;
                    dataYstart = y;
                    found = true;
                    break;
                }
            }
            if (found){
                break;
            }
        }
        //console.log(dataYstart);
        //console.log(dataXStart);


        let matrix : string[][];
        matrix = [];
        for (let i = 0; i < rows.length - dataYstart; i++) {//setup a 2 dimensional array of all the values
            matrix[i] = [];
            let rowSlice = rows[i+dataYstart].split(this.SeperationChar);

            matrix[i] = rowSlice.slice(dataXStart,rowSlice.length);
        }
        //console.log(matrix);

        return matrix;
    }


}
