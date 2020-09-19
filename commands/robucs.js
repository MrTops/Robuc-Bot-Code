const { MessageEmbed } = require("discord.js");
const { log } = require("../util/log");
const { randomColor } = require("../util/color");
const { getRobucs } = require("../util/playerDataHelper");

module.exports.run = async (client, message, args) => {
    let response = await message.channel.send(new MessageEmbed()
        .setColor(randomColor())
        .setTimestamp()
        .setTitle(`${message.author.username}'s Robucs`)
        .setDescription(`${await message.authorData.robucAmount}`)
    ).catch(err=>log(err));
};

module.exports.info = {
    command: "robucs"
}