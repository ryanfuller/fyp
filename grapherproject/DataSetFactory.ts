import {DataSet, DataSetAxis, DataSetChannel, Point} from "./DataSetClasses";
/*
* creates data sets from files given to it by the grapher for different types of files
* */
export class DataSetFactory{
    constructor (){

    }
    public  CreateNewDataSet(input:string,name:string,format:string):DataSet{
        switch (format) {
            case "csv":{
                return this.CreateNewDataSetFromCSV(input,name);
            }
            default :{
                return null;
            }
        }
    }
    public  CreateNewDataSetFromCSV(input :string, name: string) : DataSet{
        //known issues, this does not take into account csv files with arbitrary white space
        //assumes titles at the top and side
        //assumes amount of data is constant, so no colum has more data than the other for no reason or if data sets > amount of sets

        let rows = input.split(/\r?\n/);//split the document into rows
        if (rows.length <=1 ){
            return null;
        }
        let matrix : string[][];

        matrix = [];
        for (let i = 0; i < rows.length; i++) {//setup a 2 dimensional array of all the values
            matrix[i] = [];
            matrix[i] = rows[i].split(",");
        }

        let titles = matrix[0];

        let amountOfChannels : number = rows.length ;
        let amountOfAxis : number = titles.length ;


        let axis : Array<DataSetAxis> = new Array<DataSetAxis>();


        for (let c = 1; c < amountOfAxis ; c++) {//loop through arrays and make objects accordingly
            let channels : Array<DataSetChannel> = new Array<DataSetChannel>();

            for (let r = 1 ; r < amountOfChannels ; r++) {

                channels.push(new DataSetChannel(matrix[r][0],new Point(+matrix[r][c] )))

            }
            axis.push(new DataSetAxis(matrix[0][c],channels));

        }

        let newGraph = new DataSet(name,axis);

        return newGraph;
        //tested with single csv with many different values and console.log constantly checking values
    }
}
