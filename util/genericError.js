const { MessageEmbed } = require("discord.js");
const { log } = require("./log");
const { color } = require("./color");

module.exports.sendError = async (channel, title, description="", timeout=15000) => {
    let error = await channel.send(new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter(`deletes in ${timeout/1000} seconds`)
        .setColor(color.error)
    ).catch(err=>log(err));
    if(error) error.delete({ timeout: timeout }).catch(err=>log(err));
};