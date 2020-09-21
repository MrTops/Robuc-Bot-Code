const { color } = require("../util/color");
const { sendError, sendInfo } = require("../util/genericError");
const { log } = require("../util/log");

module.exports.run = async (client, message, args) => {
    message.delete().catch(err=>log(err));
    if(!message.guild.member(message).hasPermission("MANAGE_GUILD")){
        sendError(message.channel, `You lack permission`, `You need the \`\`MANAGE_GUILD\`\` permission to set the alerts channel.`);
        return;
    };
    let targetChannel = message.mentions.channels.first() || message.guild.channels.resolve(args[0]);
    if(args[0].toLowerCase() === "none") targetChannel = "none";
    if(!targetChannel){
        sendError(message.channel, `Could not find the channel!`, `The channel \`\`${args[0]}\`\` was not found. If you wish to remove the alerts channel then do rb.set-alert-channel none`);
        return;
    }
    if(targetChannel === "none"){
        sendInfo(message.channel, `Success`, `Reset the alerts channel.\nYou will no longer get logs about transactions.`);
    }else{
        sendInfo(message.channel, `Success`, `Set the alerts channel to \`\`${targetChannel.name} (id:${targetChannel.id})\`\``);
    }
    message.guildData.alertsChannelId = targetChannel === "none" ? false : targetChannel.id;
};

module.exports.info = {
    command: "set-alert-channel"
}