import {DataSet, DataSetAxis, DataSetChannel, Point} from "./DataSetClasses";
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
        switch (format) {
            case "csv":{
                console.log(plotType);
                switch (plotType) {
                    case "bar":{
                        return this.CreateNewBarDataSetFromCSV(input,name);
                        break;
                    }
                    case "surface":{
                        return this.CreateNewSurfaceDataSetFromCSV(input,name);
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
    private  CreateNewBarDataSetFromCSV(input :string, name: string) : DataSet{
        //known issues, this does not take into account csv files with arbitrary white space
        //assumes titles at the top and side
        //assumes amount of data is constant, so no colum has more data than the other for no reason or if data sets > amount of sets

        let matrixData = this.RemoveSpaceFromCSV(input);


        let titles = matrixData[0];

        let amountOfChannels : number = matrixData.length ;
        let amountOfAxis : number = titles.length ;


        let axis : Array<DataSetAxis> = new Array<DataSetAxis>();


        for (let c = 1; c < amountOfAxis ; c++) {//loop through arrays and make objects accordingly
            let channels : Array<DataSetChannel> = new Array<DataSetChannel>();

            for (let r = 1 ; r < amountOfChannels ; r++) {

                channels.push(new DataSetChannel(matrixData[r][0],new Point(+matrixData[r][c] )))

            }
            axis.push(new DataSetAxis(matrixData[0][c],channels));

        }

        let newGraph = new DataSet(name,axis);

        return newGraph;
        //tested with single csv with many different values and console.log constantly checking values
    }


    private  CreateNewSurfaceDataSetFromCSV(input :string, name: string) : DataSet{
        console.log(input);
        let MatrixData = this.RemoveSpaceFromCSV(input);


        let newGraph = null;
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
