const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

var complimentCmd = require('./subUser/uCompliment.js');
var jokeCmd = require('./subUser/uJoke.js');
var rpsCmd = require('./subUser/uRps.js');
var magicCmd = require('./subUser/uMagic8ball.js');
var foxCmd = require('./subUser/uFoxhunt.js')(this.prefix);

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
        case "copy":
            copyMessage(message, args);
            break;
        case "stats":
            getStats(message);
            break;
        case "compliment":
            complimentCmd(message);
            break;
        case "joke":
            jokeCmd(message);
            break;
        case "rps":
            rpsCmd(message, args);
            break;
        case "8ball":
            magicCmd(message, args);
            break;
        case "foxhunt":
            foxCmd(message, args);
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
    help += "\n**t.8ball [question] -** Will look into the future to give you an answer.";
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
        stats += "\nRock Paper Scissors wins/ties/loses: "+user.rpsWin+"/"+user.rpsTie+"/"+user.rpsLose;
        stats += "\nShook the magic 8 ball: "+user.magicBall+" times";
        message.channel.send(stats);
    });
}

module.exports = function(bot, prefix) {
    this.client = bot;
    this.prefix = prefix;
    return switchCmd;
};