//requirements
const { Client, Collection } = require('discord.js');
const { log } = require('./util/log');
const { readdir } = require('fs');
const { getPrefix } = require('./util/guildConfigHelper');
const { addRobucs } = require('./util/playerDataHelper');
const { Token, DBLink } = require('./config.json');
const { getRandomRarity } = require('./TypeDefs');
const Keyv = require('keyv');

//variables
const client = new Client({
    disableMentions: "everyone"
})
client.keyv = new Keyv(DBLink)

client.keyv.on('error', err => log(err));

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

    let pickedRarity = getRandomRarity()
    if(pickedRarity.emoji){
        await message.react(pickedRarity.emoji).catch(err=>log(err));
        const filter = (reaction, user) => reaction.emoji.name === pickedRarity.emoji && (user.id === message.author.id || message.guild.member(user).hasPermission('MANAGE_MESSAGES'));
        const collector = message.createReactionCollector(filter, { time: 100000 });
        collector.on('collect', r => {message.reactions.removeAll().catch(err=>log(err)); collector.stop();});
        collector.on('end', r => {message.reactions.removeAll().catch(err=>log(err))});
    }
    addRobucs(message.guild, message.author, pickedRarity.toGive);

    if(!message.content.startsWith((await getPrefix(message.guild)))) return;
    
    let args = message.content.split(" ").filter(obj => obj != " ");
    let command = args.shift().toLowerCase().slice((await getPrefix(message.guild)).length);
    let commandObject = client.Commands.get(command) || client.Aliases.get(command);
    if(!commandObject) return;
    commandObject.run(client, message, args);
});

//login
client.login(Token)