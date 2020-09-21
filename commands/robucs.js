const { MessageEmbed } = require("discord.js");
const { log } = require("../util/log");
const { randomColor } = require("../util/color");
const { comma } = require("../util/comma");

module.exports.run = async (client, message, args, options) => {
    message.delete().catch(err=>log(err));
    let response = await message.channel.send(new MessageEmbed()
        .setColor(randomColor())
        .setTimestamp()
        .setTitle(`${message.author.username}'s Robucs`)
        .setDescription(`${options.includes('-no_comma') ? await message.authorData.robucAmount : comma(await message.authorData.robucAmount)}`)
    ).catch(err=>log(err));
};

module.exports.info = {
    command: "robucs",
    options: ['-no_comma']
}