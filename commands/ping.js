const { MessageEmbed } = require("discord.js");
const { log } = require("../util/log");
const { randomColor } = require("../util/color")

module.exports.run = async (client, message, args) => {
    let response = await message.channel.send(new MessageEmbed()
        .setColor(randomColor())
        .setTimestamp()
        .setTitle("Pong!")
        .setDescription(args.join(", "))
        .setFooter("deletes in 15 seconds")
    ).catch(err=>log(err));
    if (response) response.delete({ timeout: 15000 }).catch(err=>log(err));
};

module.exports.info = {
    command: "ping"
}