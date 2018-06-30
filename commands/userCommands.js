const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

var rps = [ "rock", "paper", "scissors"];
var rpsBeat = { rock:"scissors", paper:"rock", scissors:"paper"};

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
        case "stats":
            getStats(message);
            break;
        case "joke":
            getJoke(message);
            break;
        case "rps":
            playRps(message, args);
            break;
    }
};

function getHelp(message){
    var help = "```Command list overview```\n";
    help += "\n**t.help -** You get this list. Great job, you played yourself!";
    help += "\n**t.ping -** Check the latency to the bot and to the API.";
    help += "\n**t.compliment [user] -** Will compliment the given user.";
    help += "\n**t.joke -** Will crack a funny joke.";
    help += "\n**t.copy [message] -** Will repeat what you said and delete your message.";
    help += "\n**t.stats [user] -** Get some statistics of yourself or someone else.";
    help += "\n**t.rps [rock/paper/scissors] -** Play a game of Rock Paper Scissors against the bot.";
    help += "\n\nFor admin commands use **t.admin [command]**";
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

    // Don't compliment yourself
    if(member.id === message.author.id)
        return message.channel.send("Isn't it a bit weird to compliment yourself "+member+"?");

    // Add 1 to your compliment counter
    User.findOneOrCreate({ userId: member.id }, function (err, user) {
        if (err) return console.log(err);
        user.complimented += 1;
        user.save();
    });

    User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
        if (err) return console.log(err);
        user.complimenting += 1;
        user.save();
    });

    // How kind to compliment the bot
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

function getJoke(message){
    // Add 1 to your joke counter
    User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
        if (err) return console.log(err);
        user.joked += 1;
        user.save();
    });

    Guild.findOne({guildId: message.guild.id}, function(err, guild){
        if(err) return message.channel.send("Something went wrong with getting your guild from the database...");
        if(guild.jokes.length > 0){
            var randomJoke = Math.floor(Math.random() * guild.jokes.length);
            message.channel.send(guild.jokes[randomJoke]);
        } else {
            message.channel.send("Looks like you have no jokes saved...");
        }
    });
}

function playRps(message, args){
    if(args.length === 0 || rps.indexOf(args[0].toLowerCase()) <= -1) return message.channel.send("Please give a valid option to play (Rock, Paper, Scissors).");
    var play = args[0].toLowerCase();
    var botChoice = rps[Math.floor(Math.random() * rps.length)];

    var result = "I choose "+ botChoice +"! ";
    User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
        if (err) return console.log(err);
        User.findOneOrCreate({ userId: client.user.id }, function (err, bot) {
            if (err) return console.log(err);

        if(play === botChoice){
            user.rpsTie += 1;
            bot.rpsTie += 1;
            result += "It's a tie! What a tough match that was.";
        } else if(rpsBeat[play] === botChoice){
            user.rpsWin += 1;
            bot.rpsLose += 1;
            result += "You win! Nicely played!";
        } else {
            user.rpsLose += 1;
            bot.rpsWin += 1;
            result += "You Lose! Perhaps you'll win next time.";
        }
        bot.save();
        user.save();
        message.channel.send(result);
        });
    });
}

function copyMessage(message, args){
    const copyMessage = args.join(' ');
    message.delete().catch(function(){
        console.log("Couldn't delete message...");
    });
    if(copyMessage !== "") message.channel.send(copyMessage);
}

function getStats(message){
    var member = message.mentions.members.first();
    if(!member) member = message.author;

    User.findOneOrCreate({ userId: member.id }, function (err, user) {
        if (err) return console.log(err);
        //Add more stats when there are more.
        var stats = "**Statistics for "+member+":**";
        stats += "\nGot a Compliment: "+user.complimented+" times";
        stats += "\nGave a Compliment: "+user.complimenting+" times";
        stats += "\nCracked a joke: "+user.joked+" times";
        stats += "\nRock Paper Sciccors wins/ties/loses: "+user.rpsWin+"/"+user.rpsTie+"/"+user.rpsLose;
        message.channel.send(stats);
    });
}

module.exports = function(bot, prefix) {
    this.client = bot;
    this.prefix = prefix;
    return switchCmd;
};