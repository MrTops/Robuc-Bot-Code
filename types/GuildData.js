const Keyv = require("keyv");
const { DBLink, DefaultPrefix } = require("../config.json");
const { log } = require("../util/log");

const keyv = new Keyv(DBLink, { namespace: "GUILDDATA" });

class GuildData{
    constructor(guild){
        this.guild = guild;
        this.prefix = this.prefixValue;
    };

    save(){
        keyv.set(this.dataKey, {
            prefix: this.prefix
        }).catch(err=>log(err));
    }

    get guildId(){
        return this.guild.id || this.guild;
    };

    get dataKey(){
        return `SSDK:${this.guildId}`;
    };

    get prefixValue(){
        return new Promise(async (resolution, rejection) => {
            resolution(((await keyv.get(this.dataKey).catch(err=>log(err))) || {prefix: DefaultPrefix}).prefix)
        });
    };

    set prefixValue(newPrefix){
        this.prefix = newPrefix;
        this.save();
    };
};

module.exports.GuildData = GuildData;