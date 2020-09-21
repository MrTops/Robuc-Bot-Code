const { MessageEmbed } = require("discord.js");
const { log } = require("../util/log");
const { color } = require("../util/color");
const { DefaultPrefix } = require("../config.json")
const { sendError } = require("../util/genericError");

module.exports.run = async (client, message, args) => {
    message.delete().catch(err=>log(err));
    if(!message.guild.member(message).hasPermission("MANAGE_GUILD")) {
        sendError(message.channel, "You lack permission", "You need \`\`MANAGE_GUILD\`\` permission");
        return;
    }
    let oldPrefix = await message.guildData.prefix;
    message.guildData.prefixValue = args[0] || DefaultPrefix;
    let newPrefix = await message.guildData.prefix;
    let success = newPrefix !== oldPrefix;
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