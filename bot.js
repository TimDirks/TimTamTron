const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./auth.json");
const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

let adminCmd = require('./commands/adminCommands.js')(config.prefix);
let userCmd = require('./commands/userCommands.js')(client, config.prefix);

client.on("ready", () => {
    console.log("Bot has started, with " + client.users.size + " users, in " + client.channels.size + " channels of " + client.guilds.size + " guilds.");
    client.user.setActivity("Serving " + client.guilds.size + " servers");
});
client.on("guildCreate", (guild) => {
    // This event triggers when the bot joins a guild.
    Guild.findOneOrCreate({ guildId: guild.id, name: guild.name }, function (err, guild) {
        if (err) return console.log(err);
    });

    client.user.setActivity("Serving "+ client.guilds.size +" servers");
});
client.on("guildDelete", () => {
    // This event triggers when the bot is removed from a guild.
    client.user.setActivity("Serving "+ client.guilds.size +" servers");
});

client.on("message", async message =>
{
    // Ignore messages from all bots
    if (message.author.bot) return;

    // Ignore messages which don't start with the given prefix
    if (message.content.indexOf(config.prefix) !== 0) return;

    // Split the message into the command and the remaining arguments
    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const cmd = args.shift().toLowerCase();

    // Switch for the command. Expand at own desire.
    switch (cmd) {
        case "admin":
            adminCmd(message);
            break;
        default:
            userCmd(message);
            break;
    }
});

module.exports = client;