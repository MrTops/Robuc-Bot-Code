//requirements
const { ShardingManager } = require("discord.js");
const { Token } = require("./config.json");
const { log } = require("./util/log")

//variables
const manager = new ShardingManager('./bot.js', { token: Token })

//code
manager.on('shardCreate', shard => log(`spawned shard #${shard.id}`))
manager.spawn()