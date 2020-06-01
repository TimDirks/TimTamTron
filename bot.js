const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

let adminCmd = require('./commands/adminCommands.js')(config.prefix);
let userCmd = require('./commands/userCommands.js')(client, config.prefix);
let joinCmd = require('./commands/subGuild/gJoinMessage.js');

client.on("ready", () => {
    console.log("Bot has started, with " + client.users.cache.size + " users, in " + client.channels.cache.size + " channels of " + client.guilds.cache.size + " guilds.");

    client.user.setActivity("Serving " + client.guilds.cache.size + " servers");
});

client.on("guildCreate", (guild) => {
    Guild.findOneOrCreate({ guildId: guild.id, name: guild.name }, function (err, guild) {
        if (err) {
            return console.log(err);
        }
    });

    client.user.setActivity("Serving "+ client.guilds.cache.size +" servers");
});

client.on("guildDelete", () => {
    client.user.setActivity("Serving "+ client.guilds.cache.size +" servers");
});

client.on('guildMemberAdd', joinCmd);

client.on("message", async message =>
{
    if (message.author.bot) return;

    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const cmd = args.shift().toLowerCase();

    if (cmd === 'admin') {
        adminCmd(message);
    } else {
        userCmd(message);
    }
});

module.exports = client;