const Keyv = require('keyv');
//this isn't needed but it's good to have when I add custom stuff for servers
const { DefaultPrefix, DBLink } = require('../config.json');
const { log } = require('./log');

//variables
const keyv = new Keyv(DBLink);

module.exports.getPrefix = async (guild) => {
    return (await keyv.get(guild.id).catch(err=>log(err))) || DefaultPrefix
};