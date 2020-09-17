const { MessageEmbed } = require("discord.js");
const { color } = require("../util/color");
const { sendError } = require("../util/genericError");
const { log } = require("../util/log");
const { getRobucs, addRobucs } = require("../util/playerDataHelper");

module.exports.run = async (client, message, args) => {
    let target = message.mentions.users.first() || message.guild.member(args[0]);
    if(!target) {
        sendError(message.channel, `Could not locate user`, ``, 15000);
        return;
    }
    if(target == message.author) {
        sendError(message.channel, `You cannot send yourself payment!`, ``, 15000);
        return;
    }
    if(isNaN(args[1])){
        sendError(message.channel, `Did not find a number`, ``, 15000);
        return;
    }
    let amount = parseInt(args[1]);
    if(!amount){
        sendError(message.channel, `Did not find a number`, ``, 15000);
        return;
    }
    amount = Math.abs(amount);
    if((await getRobucs(message.guild, message.author)) >= amount){
        addRobucs(message.guild, message.author, -amount);
        addRobucs(message.guild, target, amount);
        message.channel.send(new MessageEmbed()
            .setColor(color.success)
            .setTimestamp()
            .setTitle(`${amount} successfully sent!`)
            .setDescription(`Sent ${amount} from <@!${message.author.id}>'s account to <@!${target.id}>'s account`)
        ).catch(err=>log(err));
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