const splitLimit = 

class Category{
    //a category of commands
    constructor(name){
        this.name = name;
        this.commands = [];
    };
    addCommand(commandObject){
        this.commands.push(commandObject);
    };
    getSplit(){
        //returns a array of arrays so that each array contains only 15 commands
    };
}