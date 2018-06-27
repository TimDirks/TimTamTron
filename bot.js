const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./auth.json");
const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

var adminCmd = require('./commands/adminCommands.js')(client, config.prefix);
var userCmd = require('./commands/userCommands.js')(client, config.prefix);

client.on("ready", function() {
    console.log("Bot has started, with " + client.users.size + " users, in " + client.channels.size + " channels of " + client.guilds.size + " guilds.");
    client.user.setActivity("Serving " + client.guilds.size + " servers");
});
client.on("guildCreate", function (guild) {
    // This event triggers when the bot joins a guild.
    Guild.findOneOrCreate({ guildId: guild.id, name: guild.name }, function (err, guild) {
        if (err) return console.log(err);
        console.log("Added guild to the database");
    });

    console.log("New guild joined: "+guild.name+" (id: "+guild.id+"). This guild has "+guild.memberCount+" members!");
    client.user.setActivity("Serving "+ client.guilds.size +" servers");
});
client.on("guildDelete", function(guild) {
    // This event triggers when the bot is removed from a guild.
    console.log("I have been removed from: "+guild.name+" (id: "+guild.id+").");
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
        case "help": case "ping": case "compliment": case "copy":
            userCmd(message);
            break;
        case "admin":
            adminCmd(message);
            break;
        case "save":
            addUser(message);
            break;

    }
})

function addUser(message){
    User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
        if (err) return console.log(err);
        message.channel.send("I saved you in the database!");
    });
}

module.exports = client;