const Keyv = require("keyv");
const { DBLink } = require("../config.json");
const { log } = require("../util/log");

const keyv = new Keyv(DBLink, { namespace: "USERDATA" });

class UserData{
    constructor(guild, user){
        this.guild = guild;
        this.user = user;
        this.robucs = this.robucAmount;
    };

    save(){
        keyv.set(this.dataKey + "/robucs", this.robucs).catch(err=>log(err));
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
            resolution(
                (await keyv.get(this.dataKey + "/robucs").catch(err=>log(err))) || 0
            );
        });
    };

    set robucAmount(amount){
        this.robucs = amount;
        this.save();
    }; 
};

module.exports.UserData = UserData;