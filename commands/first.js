const { MessageEmbed } = require("discord.js");
const { color } = require("../util/color");
const { sendError, sendInfo } = require("../util/genericError");
const { log } = require("../util/log");
const { getRobucs, addRobucs } = require("../util/playerDataHelper");

module.exports.run = async (client, message, args) => {
    let amount = Math.abs(parseInt(args[0]));
    if(!amount){
        sendError(message.channel, `No Number Given`);
        return;
    };
    if(amount > await getRobucs(message.guild, message.author)){
        sendError(message.channel, `Ur broke`);
        return;
    };
    let emoji = args[1] || "👍";
    args.shift(); args.shift();
    let giveawayMessage = args.join(' ') || '';
    let embed = await message.channel.send(new MessageEmbed()
        .setTitle(`Claim ${amount}!`)
        .setTimestamp()
        .setDescription(giveawayMessage)
        .setFooter(`sent by ${message.author.name}`)
    ).catch(err=>log(err));
    await embed.react(emoji).catch(err=>{
        log(err);
        embed.delete().catch(errr=>log(errr));
        sendError(message.channel, `Error`, err);
        return;
    });
    if(message.deleted) return;
    const filter = (reaction, user) => reaction.emoji.name === emoji && user.id != message.author.id;
    const collector = embed.createReactionCollector(filter);
    collector.on('collect', async (reaction, user) => {
        if(amount > await getRobucs(message.guild, message.author)){
            sendError(message.channel, `Not enough robucs`, `The user who started the giveaway does not have enough robucs to complete the transaction.`);
            embed.delete().catch(err=>log(err));
            collector.stop()
            return;
        };
        addRobucs(message.guild, message.author, -amount);
        addRobucs(message.guild, user, amount);
        sendInfo(message.channel, `Success`, `successfully gave <@!${user.id}> ${amount} robucs from <@!${message.author.id}>`, 15000, color.success);
        embed.delete().catch(err=>log(err));
        collector.stop();
        return;
    });
};

module.exports.info = {
    command: "first"
}