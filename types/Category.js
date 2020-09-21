const { MessageEmbed } = require("discord.js");
const { randomColor } = require("../util/color");

const splitLimit = 10; 

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
        //returns a array of arrays so that each array contains only 10 commands
        let returnArray = [[]];
        let currentIndex = 0;
        this.commands.forEach(command => {
            if(returnArray[currentIndex].length + 1 > splitLimit){
                currentIndex++;
                returnArray[currentIndex] = [];
            };
            returnArray[currentIndex].push(command);
        });

        return returnArray;
    };
    createEmbeds(){
        //makes a embed out of the commands
        let array = [];
        let color = randomColor()
        let split = this.getSplit()
        split.forEach(commandArray => {
            let body = "";
            commandArray.forEach(command => {
                for(var information in command.info){
                    body += `${information}: ${command.info[information]}`
                };
                body += '\n'
            });
            array.push(new MessageEmbed()
                .setTitle(array.length === 0 ? `Help with the '${this.name}' Category.` : '')
                .setColor(color)
                .setTimestamp()
                .setFooter(`Page#: ${array.length+1}/${split.length}`)
                .setDescription(body)
            );
        });

        return array;
    };
}

module.exports.Category = Category;