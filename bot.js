const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./auth.json");
const mongoose = require('mongoose');

User = mongoose.model('User');

client.on("ready", function() {
    console.log("Bot has started, with " + client.users.size + " users, in " + client.channels.size + " channels of " + client.guilds.size + " guilds.");
    client.user.setActivity("Serving " + client.guilds.size + " servers");
});
client.on("guildCreate", function (guild) {
    // This event triggers when the bot joins a guild.
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
        case "help":
            getHelp(message);
            break;
        case "ping":
            getLatency(message);
            break;
        case "at":
            pingUser(message);
            break;
        case "copy":
            copyMessage(message, args);
            break;
        case "save":
            addUser(message);
            break;
    }
})

function getHelp(message){
    var help = "```Command list overview```\n";
    help += "\n**t.help -** you get this list. Great job, you played yourself!";
    help += "\n**t.ping -** check the latency to the bot and to the API.";
    help += "\n**t.at [user] -** will ping the given user.";
    help += "\n**t.copy [message] -** will repeat what you said and delete your message.";
    help += "\n**t.save -** will save an instance of the user in the database.";
    help += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(help);
}

// Function needs to be async for the await
async function getLatency(message){
    const m = await
    message.channel.send("Ping?");
    m.edit("Pong! Latency is "+(m.createdTimestamp - message.createdTimestamp)+"ms. API Latency is "+Math.round(client.ping)+"ms");
}

function pingUser(message){
    var member = message.mentions.members.first();
    if(!member)
        return message.reply("Please mention a valid member of this server");

    if(member.id === message.author.id)
        return message.channel.send("Aahw! Poor thing, do you feel a bit lonely "+member+"?");
    if(member.id === client.user.id)
        return message.channel.send("How kind of you to give me, "+member+", some love aswell!");
    message.channel.send("Boop! "+member+" just got pinged! id: "+ member.id);
}

function copyMessage(message, args){
    const copyMessage = args.join(' ');
    message.delete().catch(function(){
        console.log("Couldn't delete message...");
    });
    if(copyMessage !== "") message.channel.send(copyMessage);
}

function addUser(message){
    User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
        if (err) return console.log(err);
        message.channel.send("I saved you in the database!");
    });
}

module.exports = client;