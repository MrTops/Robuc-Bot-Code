const { MessageEmbed } = require("discord.js");
const { default: fetch } = require("node-fetch");
const { randomColor } = require("../util/color");
const { comma } = require("../util/comma");
const { log } = require("../util/log");

const url = 'https://api.thevirustracker.com/free-api?global=stats';

module.exports.run = async (client, message, args) => {
    message.delete().catch(err=>log(err));
    let coronaStats = (await (await fetch(url, { method: 'Get' })).json()).results[0];
    message.channel.send(new MessageEmbed()
        .setColor(randomColor())
        .setTimestamp()
        .setFooter(`stats provided by ${url}`)
        .setTitle(`COVID-19 stats`)
        .setDescription(`Total Cases: ${comma(coronaStats.total_cases)}\nTotal Deaths: ${comma(coronaStats.total_deaths)}\nTotal Recovered: ${comma(coronaStats.total_recovered)}`)
    ).catch(err=>log(err));
};

module.exports.info = {
    command: 'covid-19',
    aliases: ['coronastats']
};