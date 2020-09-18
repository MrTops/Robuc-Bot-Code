const Keyv = require("keyv");
const { DBLink } = require("../config.json");
const { log } = require("../util/log");

const keyv = new Keyv(DBLink);

class UserData{
    constructor(guild, user){
        this.guild = guild;
        this.user = user;
        this.robucs = this.robucAmount;
    };

    save(){
        keyv.set(this.userId, {
            robucs: this.robucs
        }).catch(err=>log(err))
    };

    get guildId(){
        return this.guild.id || this.guild;
    };

    get userId(){
        return this.user.id || this.user;
    };

    get dataKey(){
        return `${this.guildId}/${this.userId}`
    };

    get robucAmount(){
        return new Promise(async (resolution, rejection) => {
            resolution((await keyv.get(this.dataKey).catch(err=>log(err))).robucs || 0);
        });
    };

    set robucAmount(amount){
        if(isNaN(amount)) return;
        this.robucs = amount;
        this.save();
    }; 
};

module.exports.UserData = UserData;