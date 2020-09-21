const { MessageEmbed } = require("discord.js");
const { randomColor } = require("./color");
const { log } = require("./log");

module.exports.alert = async (guildData, title="Log", description="", color=randomColor()) => {
    if(!(await guildData.alertsChannelId)) return;
    let guild = guildData.guild;
    if(!guild) return; 
    let channel = guild.channels.resolve(await guildData.alertsChannelId);
    if(!channel) return;
    channel.send(new MessageEmbed()
        .setColor(color)
        .setTimestamp()
        .setTitle(title)
        .setDescription(description)
    ).catch(err=>log(err));
};