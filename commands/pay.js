const { MessageEmbed } = require("discord.js");
const { UserData } = require("../types/UserData");
const { alert } = require("../util/alertManager");
const { color } = require("../util/color");
const { sendError, sendInfo } = require("../util/genericError");
const { log } = require("../util/log");

module.exports.run = async (client, message, args) => {
    message.delete().catch(err=>log(err));
    let target = message.mentions.users.first() || message.guild.member(args[0]);
    if(!target) {
        sendError(message.channel, `Could not locate user`, ``, 15000);
        return;
    }else if(target == message.author) {
        sendError(message.channel, `You cannot send yourself payment!`, ``, 15000);
        return;
    }
    let amount = parseInt(args[1]);
    if(!amount){
        sendError(message.channel, `Did not find a number`, ``, 15000);
        return;
    }
    amount = Math.abs(amount);
    if(message.authorData.robucs >= amount){
        message.authorData.robucAmount = (await message.authorData.robucAmount) - amount;
        let otherData = new UserData(message.guild, target);
        otherData.robucAmount = (await otherData.robucAmount) + amount;
        alert(message.guildData, )
        sendInfo(message.channel, `${amount} successfully sent!`, `Sent ${amount} from <@!${message.author.id}>'s account to <@!${target.id}>'s account`, 15000, color.success)
    }else {
        sendError(message.channel, `Too poor`, `you don't have \`\`${amount}\`\` to pay <@!${target.id}>`, 15000);
        return;
    }
}

module.exports.info = {
    command: "pay",
    usage: "pay <usermention, id> <number>",
    description: "Pays the user a given amount from your balance."
}