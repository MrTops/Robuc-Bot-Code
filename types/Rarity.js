/*

    When a message is sent this class is used to calculate the Robuc given

*/
const { randomNumber } = require('../util/random')

class Rarity{
    constructor(name, low, high, weight, emoji=""){
        this.name = name; //name of it
        this.low = low; //the low bound for the amount to give
        this.high = high; //the high bound for the amount to give
        this.emoji = emoji; //the emoji to react with if given *if any
        this.weight = weight; //the weight to give it
    }
    get toGive(){
        return randomNumber(this.low, this.high);
    }
}

module.exports.Rarity = Rarity;