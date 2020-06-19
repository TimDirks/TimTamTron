const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

let switchCmd = function getCommand(message){
    const args = message.content.slice(this.prefix.length).trim().split(' ');
    args.splice(0, 2);

    let cmd = "";
    if(args.length) cmd = args.shift().toLowerCase();

    switch (cmd){
        case "":
            showJoinMessages(message);
            break;
        case "add":
            addJoinMessage(message, args);
            break;
        case "setchannel":
            setJoinMessageChannel(message);
            break;
        case "remove":
            removeJoinMessage(message, args);
            break;
        case "reset":
            resetJoinMessage(message);
            break;
    }
};

function showJoinMessages(message){
    Guild.findOneOrCreate({guildId: message.guild.id}, function(err, guild){
        if(err) {
            return message.channel.send("Could not get the guild from the database!");
        }

        let joinMessages = "```List of all your join messages```\n";
        guild.joinMessages.forEach(function(element, index){
            if(index % 15 === 0){
                message.channel.send(joinMessages);
                joinMessages = "";
            }

            joinMessages += "\n**"+(index+1)+".** " + element;
        });

        if (joinMessages !== "") {
            message.channel.send(joinMessages);
        }
    })
}

function removeJoinMessage(message, args){
    if(args.length === 0) {
        return message.channel.send("Please give me an index.");
    }

    let index = (args[0] -1);

    Guild.findOneOrCreate({guildId: message.guild.id}, function(err, guild){
        if(err) {
            return message.channel.send("Could not get the guild from the database!");
        }

        if(index >= 0 && index < guild.joinMessages.length){
            guild.joinMessages.splice(index, 1);
            guild.save();
            return message.channel.send("Join message removed.");
        }

        message.channel.send("The given index is not valid.");
    })
}

function setJoinMessageChannel (message) {
    let channel = message.mentions.channels.first();

    if(!channel) {
        return message.reply("Please mention a valid channel of this server");
    }

    Guild.findOneOrCreate({guildId: message.guild.id}, function(err, guild){
        if(err) {
            return message.channel.send("Something went wrong with getting your guild from the database...");
        }

        guild.config.joinMessageChannel = channel.id;
        guild.markModified('config');

        guild.save();
    });
}

function addJoinMessage(message, args){
    if(args.length === 0) {
        return message.channel.send("Please give me a join message to add.");
    }

    const newJoinMessage = args.join(' ');

    Guild.findOneAndUpdate({guildId: message.guild.id}, {$push: {joinMessages: newJoinMessage}}, function (err, guild) {
        if(err) {
            return message.channel.send("Could not add join message to the list!");
        }
    });

    message.channel.send("Join message has been added!");
}

function resetJoinMessage(message){
    Guild.resetJoinMessages({guildId: message.guild.id}, function(err, guild) {
        if (err) {
            return message.channel.send("Something went wrong with resetting the join messages for your guild.");
        }

        message.channel.send("Join messages have been reset.");
    });
}

module.exports = function(prefix) {
    this.prefix = prefix;
    return switchCmd;
};
