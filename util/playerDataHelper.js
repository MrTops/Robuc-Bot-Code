const Keyv = require('keyv');
//this isn't needed but it's good to have when I add custom stuff for servers
const { DBLink, OwnerId } = require('../config.json');
const { log } = require('./log');

//variables
const keyv = new Keyv(DBLink);

module.exports.getRobucs = async (guild, user) => {
    return (await keyv.get(`${guild.id}/${user.id}`).catch(err=>log(err))) || 0;
};

module.exports.addRobucs = async (guild, user, amount) => {
    keyv.set(`${guild.id}/${user.id}`, (await module.exports.getRobucs(guild, user)) + amount).catch(err=>log(err));
};

module.exports.isAdmin = async (user) => {
    return user.id == OwnerId || ((await keyv.get(`IsAdmin/${user.id}`).catch(err=>log(err))) || false)
};