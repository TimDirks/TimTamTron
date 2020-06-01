const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

var complimentCmd = require('./subAdmin/aCompliment')(this.prefix);
var helpCmd = require('./subAdmin/aHelp.js')(this.prefix);
var jokeCmd = require('./subAdmin/aJoke.js')(this.prefix);
var magicBallCmd = require('./subAdmin/aMagic8ball.js')(this.prefix);
var foxHuntCmd = require('./subAdmin/aFoxhunt.js')(this.prefix);

var switchCmd = function getCommand(message){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Sorry, you need Administrator permissions for the Admin commands.");
    const args = message.content.slice(this.prefix.length).trim().split(' ');
    args.splice(0, 1);

    var cmd = "";
    if(args.length) cmd = args.shift().toLowerCase();

    switch (cmd){
        case "":
            getHelp(message);
            break;
        case "compliment":
            complimentCmd(message);
            break;
        case "help":
            helpCmd(message);
            break;
        case "joke":
            jokeCmd(message);
            break;
        case "8ball":
            magicBallCmd(message);
            break;
        case "foxhunt":
            foxHuntCmd(message);
            break;
    }
};

function getHelp(message){
    var help = "```Admin Command list overview\n";
    help += "*CRUD stands for Create, Read, Update, Delete```\n";
    help += "\n**t.admin -** You get this list. Great job, you played yourself!";
    help += "\n**t.admin help [command] -** Will give a detailed help overview for the admin commands.";
    help += "\n**t.admin compliment -** Will give you CRUD options for compliments.";
    help += "\n**t.admin joke -** Will give you CRUD options for jokes.";
    help += "\n**t.admin 8ball -** Will give you CRUD options for the magic 8 ball.";
    help += "\n**t.admin foxhunt -** Will give you the option to reset the Fox Hunt game.";
    help += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(help);
}

module.exports = function(prefix) {
    this.prefix = prefix;
    return switchCmd;
};