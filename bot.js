//requirements
const { Client, Collection, MessageEmbed } = require('discord.js');
const { log } = require('./util/log');
const { readdir } = require('fs');
const { Token, DefaultPrefix } = require('./config.json');
const { getRandomRarity } = require('./TypeDefs');
const { UserData } = require('./types/UserData');
const { GuildData } = require('./types/GuildData');
const { color } = require('./util/color');
const { alert } = require('./util/alertManager');

//variables
const client = new Client({
    disableMentions: "everyone"
})

//code
//init commands
client.Commands = new Collection()
client.Aliases = new Collection()
readdir('./commands', (err, files) => {
    if (err) log(err);
    if(client.shard.ids[0] === 0) log(`Loading ${files.length} commands`);
    files.forEach(file => {
        if(client.shard.ids[0] === 0) log(` Loading ${file} command`);
        let loaded = require(`./commands/${file}`);
        client.Commands.set(loaded.info.command.toLowerCase(), loaded);
        if (loaded.info.aliases) loaded.info.aliases.forEach(alias => {
            if(client.shard.ids[0] === 0) log(`     ${alias} alias`);
            client.Aliases.set(alias.toLowerCase(), loaded);
        });
    });
    if(client.shard.ids[0] === 0) log(`done loading commands`);
});

//events
client.on('ready', () => {
    if(client.shard.ids[0] === 0) log("Bot is ready");
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type != "text") return;

    message.guildData = new GuildData(message.guild);
    message.authorData = new UserData(message.guild, message.author);

    if(message.content === `<@!${client.user.id}>`) message.channel.send(new MessageEmbed()
        .setTitle(`Prefix!`)
        .setDescription(`The prefix \`\`${DefaultPrefix}\`\` is always accepted.\nThis server's prefix \`\`${await message.guildData.prefixValue}\`\``)
        .setTimestamp()
        .setFooter(`will dismiss in 15 seconds`)
        .setColor(color.success)
    ).then(sent=>{sent.delete({ timeout: 15000 }); message.delete().catch(err=>log(err))}).catch(err=>log(err));

    let pickedRarity = getRandomRarity()
    if(pickedRarity.emoji){
        alert(message.guildData, `Rare '${pickedRarity.emoji}' appeared`, `${message.author.username} has gotten a ${pickedRarity.name}`);
        await message.react(pickedRarity.emoji).catch(err=>log(err));
        const filter = (reaction, user) => reaction.emoji.name === pickedRarity.emoji && (user.id === message.author.id || message.guild.member(user).hasPermission('MANAGE_MESSAGES'));
        const collector = message.createReactionCollector(filter, { time: 100000 });
        collector.on('collect', r => {message.reactions.removeAll().catch(err=>log(err)); collector.stop();});
        collector.on('end', r => {message.reactions.removeAll().catch(err=>log(err))});
    }

    message.authorData.robucAmount = (await message.authorData.robucAmount) + pickedRarity.toGive;
    if(!(message.content.startsWith(await message.guildData.prefix) || message.content.startsWith(DefaultPrefix))) return;
    
    let args = message.content.split(" ").filter(obj => obj != "");
    let command = args.shift().toLowerCase();
    let minusServerPrefix = await message.guildData.prefix ? command.slice((await message.guildData.prefix).length) : "rb.";
    let minusDefault = command.slice(DefaultPrefix.length);
    let commandObject = client.Commands.get(minusServerPrefix) || client.Aliases.get(minusServerPrefix) || client.Commands.get(minusDefault) || client.Aliases.get(minusDefault);
    let options = message.content.split(' ').filter(obj => obj.startsWith('-') && commandObject.info.options);
    if(commandObject.info.options) options = options.filter(obj => commandObject.info.options.includes(obj));
    args = args.filter(obj => !options.includes(obj));
    if(!commandObject) return;
    if(commandObject.info.options)
        commandObject.run(client, message, args, options)
    else
        commandObject.run(client, message, args);
});

//login
client.login(Token)