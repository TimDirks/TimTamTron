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
            showComp(message);
            break;
        case "add":
            addComp(message, args);
            break;
        case "remove":
            removeComp(message, args);
            break;
        case "reset":
            resetComp(message);
            break;
    }
};

function showComp(message){
    Guild.findOne({guildId: message.guild.id}, function(err, guild){
        if(err) {
            return message.channel.send("Could not get the guild from the database!");
        }

        let compliments = "```List of all your compliments```\n";
        guild.compliments.forEach(function(element, index){
            if(index % 15 === 0){
                message.channel.send(compliments);
                compliments = "";
            }

            compliments += "\n**"+(index+1)+".** " + element;
        });

        if (compliments !== "") {
            message.channel.send(compliments);
        }
    })
}

function removeComp(message, args){
    if(args.length === 0) {
        return message.channel.send("Please give me an index.");
    }

    let index = (args[0] -1);

    Guild.findOne({guildId: message.guild.id}, function(err, guild){
        if(err) {
            return message.channel.send("Could not get the guild from the database!");
        }

        if(index >= 0 && index < guild.compliments.length){
            guild.compliments.splice(index, 1);
            guild.save();
            return message.channel.send("Compliment removed.");
        }

        message.channel.send("The given index is not valid.");
    })
}

function addComp(message, args){
    if(args.length === 0) {
        return message.channel.send("Please give me a compliment to add.");
    }

    const newCompliment = args.join(' ');

    Guild.findOneAndUpdate({guildId: message.guild.id}, {$push: {compliments: newCompliment}}, function (err, guild) {
        if(err) {
            return message.channel.send("Could not add compliment to the list!");
        }
    });

    message.channel.send("Compliment has been added!");
}

function resetComp(message){
    Guild.resetCompliments({guildId: message.guild.id}, function(err, guild) {
        if (err) {
            return message.channel.send("Something went wrong with resetting the compliments for your guild.");
        }

        message.channel.send("Compliments have been reset.");
    });
}

module.exports = function(prefix) {
    this.prefix = prefix;
    return switchCmd;
};