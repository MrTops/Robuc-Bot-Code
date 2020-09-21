const { MessageEmbed } = require("discord.js");
const { UserData } = require("../types/UserData");
const { color } = require("../util/color");
const { sendError, sendInfo } = require("../util/genericError");
const { log } = require("../util/log");

module.exports.run = async (client, message, args) => {
    message.delete().catch(err=>log(err));
    let amount = Math.abs(parseInt(args[0]));
    if(!amount){
        sendError(message.channel, `No Number Given`);
        return;
    };
    if(amount > (await message.authorData.robucAmount)){
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
        .setFooter(`sent by ${message.author.username}`)
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
        if(amount > (await message.authorData.robucAmount)){
            sendError(message.channel, `Not enough robucs`, `The user who started the giveaway does not have enough robucs to complete the transaction.`);
            embed.delete().catch(err=>log(err));
            collector.stop()
            return;
        };
        message.authorData.robucAmount = (await message.authorData.robucAmount) - amount;
        let otherData = new UserData(message.guild, user);
        otherData.robucAmount = (await otherData.robucAmount) + amount;
        sendInfo(message.channel, `Success`, `successfully gave <@!${user.id}> ${amount} robucs from <@!${message.author.id}>`, 15000, color.success);
        embed.delete().catch(err=>log(err));
        collector.stop();
        return;
    });
};

module.exports.info = {
    command: "first"
}