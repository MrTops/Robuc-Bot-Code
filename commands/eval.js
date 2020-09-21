const { MessageEmbed } = require('discord.js');
const { OwnerId } = require('../config.json');
const { color } = require('../util/color');
const { sendError } = require('../util/genericError');
const { log } = require('../util/log');

module.exports.run = async (client, message, args, options) => {
    if(message.author.id !== OwnerId) {
        sendError(message.channel, `Lacking Permission`, `You need to be the bot developer\n\`\`author id: ${message.author.id} != developer id: ${OwnerId}\`\`\nA high level of permission is required for this command as it can be used to **delete the entire *fricking* server**`);
        return;
    };
    message.delete().catch(err=>log(err));
    try{
        let evaled = eval(args.join(" "));
        if(!options.includes('-no_respond')){
            if(typeof evaled !== "string") evaled = require("util").inspect(evaled);
            let response = await message.channel.send(new MessageEmbed()
                .setTitle(`Evaluated Code:`)
                .setTimestamp()
                .setDescription(evaled)
                .setColor(color.success)
            ).catch(err=>log(err));
            await response.react('🚫');
            let filter = (reaction, user) => user.id === message.author.id && reaction.emoji.name === "🚫";
            let collector = response.createReactionCollector(filter, { time: 6000 });
            collector.on('collect', (reaction, user) => {
                response.delete().catch(err=>log(err));
                collector.stop()
            });
            collector.on('end', () => {
                if(!response.deleted)response.delete().catch(err=>log(err));
            });
        }
    } catch(err) {
        log(err);
        sendError(message.channel, `Error`, `A error occurred whilst evaluating the code\n\`\`${err}\`\``)
    };
};

module.exports.info = {
    command: "eval",
    options: ["-no_respond"]
};