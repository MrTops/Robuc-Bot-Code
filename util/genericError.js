const { MessageEmbed } = require("discord.js");
const { log } = require("./log");
const { color, randomColor } = require("./color");

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

module.exports.sendInfo = async (channel, title, description="", timeout=1500, colorOverride=false) => {
    let info = await channel.send(new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(colorOverride || randomColor())
        .setFooter(`dismisses in ${timeout/1000} seconds`)
        .setTimestamp()
    ).catch(err=>log(err));
    if(info) info.delete({ timeout: timeout }).catch(err=>log(err));
}