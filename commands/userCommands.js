const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

var switchCmd = function getCommand(message){
    const args = message.content.slice(this.prefix.length).trim().split(' ');
    const cmd = args.shift().toLowerCase();
    switch (cmd){
        case "help":
            getHelp(message);
            break;
        case "ping":
            getLatency(message);
            break;
        case "compliment":
            complimentUser(message);
            break;
        case "copy":
            copyMessage(message, args);
            break;
    }
};

function getHelp(message){
    var help = "```Command list overview```\n";
    help += "\n**t.help -** you get this list. Great job, you played yourself!";
    help += "\n**t.ping -** check the latency to the bot and to the API.";
    help += "\n**t.compliment [user] -** will compliment the given user.";
    help += "\n**t.copy [message] -** will repeat what you said and delete your message.";
    help += "\n**t.save -** will save an instance of the user in the database.";
    help += "\n\nFor admin commands use **t.admin [command]** for admin information.";
    help += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(help);
}

// Function needs to be async for the await
async function getLatency(message){
    const m = await
    message.channel.send("Ping?");
    m.edit("Pong! Latency is "+(m.createdTimestamp - message.createdTimestamp)+"ms. API Latency is "+Math.round(client.ping)+"ms");
}

function complimentUser(message){
    var member = message.mentions.members.first();
    if(!member)
        return message.reply("Please mention a valid member of this server");

    if(member.id === message.author.id)
        return message.channel.send("Isn't it a bit weird to compliment yourself "+member+"?");
    if(member.id === client.user.id)
        return message.channel.send("I appreciate the kindness but wouldn't it be a bit weird for me to compliment myself?");

    Guild.findOne({guildId: message.guild.id}, function(err, guild){
        if(err) return message.channel.send("Something went wrong with getting your guild from the database...");
        if(guild.compliments.length > 0){
            var randomComp = Math.floor(Math.random() * guild.compliments.length);
            var compliment = guild.compliments[randomComp];
            message.channel.send(compliment.replace("[user]", member));
        } else {
            message.channel.send("Looks like you have no compliments saved...");
        }
    });
}

function copyMessage(message, args){
    const copyMessage = args.join(' ');
    message.delete().catch(function(){
        console.log("Couldn't delete message...");
    });
    if(copyMessage !== "") message.channel.send(copyMessage);
}

module.exports = function(prefix) {
    this.prefix = prefix;
    return switchCmd;
};