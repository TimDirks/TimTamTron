const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

var switchCmd = function getCommand(message){
    const args = message.content.slice(this.prefix.length).trim().split(' ');
    args.splice(0, 2);

    var cmd = "";
    if(args.length) cmd = args.shift().toLowerCase();

    switch (cmd){
        case "":
            showFortune(message);
            break;
        case "add":
            addFortune(message, args);
            break;
        case "remove":
            removeFortune(message, args);
            break;
        case "reset":
            resetFortune(message);
            break;
    }
};

function showFortune(message){
    Guild.findOne({guildId: message.guild.id}, function(err, guild){
        if(err) return message.channel.send("Could not get the guild from the database!");
        var fortunes = "```List of all your fortunes```\n";
        guild.magicBall.forEach(function(element, index){
            if(index % 15 === 0){
                message.channel.send(fortunes);
                fortunes = "";
            }
            fortunes += "\n**"+(index+1)+".** " + element;
        });
        message.channel.send(fortunes);
    })
}

function removeFortune(message, args){
    if(args.length === 0) return message.channel.send("Please give me an index.");
    var index = (args[0] -1);
    Guild.findOne({guildId: message.guild.id}, function(err, guild){
        if(err) return message.channel.send("Could not get the guild from the database!");
        if(index >= 0 && index < guild.magicBall.length){
            guild.magicBall.splice(index, 1);
            guild.save();
            return message.channel.send("Fortune removed.");
        }
        message.channel.send("The given index is not valid.");
    })
}

function addFortune(message, args){
    if(args.length === 0) return message.channel.send("Please give me a fortune to add.");
    const newFortune = args.join(' ');
    Guild.findOneAndUpdate({guildId: message.guild.id}, {$push: {magicBall: newFortune}}, function (err, guild) {
        if(err) return message.channel.send("Could not add fortune to the list!");
    });
    message.channel.send("Fortune has been added!");
}

function resetFortune(message){
    Guild.reset8ball({guildId: message.guild.id}, function(err, guild) {
        if (err) return message.channel.send("Something went wrong with reseting the fortunes for your guild.");
        message.channel.send("Fortunes have been reset.");
    });
}

module.exports = function(prefix) {
    this.prefix = prefix;
    return switchCmd;
};