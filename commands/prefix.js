const { MessageEmbed } = require("discord.js");
const { log } = require("../util/log");
const { randomColor, color } = require("../util/color");
const { getPrefix } = require("../util/guildConfigHelper");
const { DefaultPrefix } = require("../config.json")
const { sendError } = require("../util/genericError");

module.exports.run = async (client, message, args) => {
    if(!message.guild.member(message).hasPermission("MANAGE_GUILD")) {
        sendError(message.channel, "You lack permission", "You need \`\`MANAGE_GUILD\`\` permission");
        return;
    }
    let oldPrefix = await getPrefix(message.guild);
    let success = await client.keyv.set(message.guild.id, args[0]).catch(err=>log(err));
    let newPrefix = await getPrefix(message.guild);
    message.channel.send(new MessageEmbed()
        .setTitle(success ? "Prefix changed!" : "Something happened!")
        .setColor(success ? color.success : color.error)
        .setTimestamp()
        .setDescription(`Old prefix: \`\`${oldPrefix}\`\`\nNew prefix: \`\`${newPrefix}\`\``)
        .setFooter(`Changed by ${message.author.username}`)
    ).catch(err=>log(err));
};

module.exports.info = {
    command: "prefix"
}