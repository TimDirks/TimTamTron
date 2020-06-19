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
            showJoke(message);
            break;
        case "add":
            addJoke(message, args);
            break;
        case "remove":
            removeJoke(message, args);
            break;
        case "reset":
            resetJoke(message);
            break;
    }
};

function showJoke(message){
    Guild.findOneOrCreate({guildId: message.guild.id}, function(err, guild){
        if(err) {
            return message.channel.send("Could not get the guild from the database!");
        }

        let jokes = "```List of all your jokes```\n";
        guild.jokes.forEach(function(element, index){
            if(index % 15 === 0){
                message.channel.send(jokes);
                jokes = "";
            }
            jokes += "\n**"+(index+1)+".** " + element;
        });

        if (jokes !== "") {
            message.channel.send(jokes);
        }
    })
}

function removeJoke(message, args){
    if(args.length === 0) {
        return message.channel.send("Please give me an index.");
    }

    let index = (args[0] -1);
    Guild.findOneOrCreate({guildId: message.guild.id}, function(err, guild){
        if(err) {
            return message.channel.send("Could not get the guild from the database!");
        }

        if(index >= 0 && index < guild.jokes.length){
            guild.jokes.splice(index, 1);
            guild.save();

            return message.channel.send("Joke removed.");
        }

        message.channel.send("The given index is not valid.");
    })
}

function addJoke(message, args){
    if(args.length === 0) {
        return message.channel.send("Please give me a joke to add.");
    }

    const newJoke = args.join(' ');

    Guild.findOneAndUpdate({guildId: message.guild.id}, {$push: {jokes: newJoke}}, function (err, guild) {
        if(err) {
            return message.channel.send("Could not add joke to the list!");
        }
    });

    message.channel.send("Joke has been added!");
}

function resetJoke(message){
    Guild.resetJokes({guildId: message.guild.id}, function(err, guild) {
        if (err) {
            return message.channel.send("Something went wrong with reseting the jokes for your guild.");
        }

        message.channel.send("Jokes have been reset.");
    });
}

module.exports = function(prefix) {
    this.prefix = prefix;
    return switchCmd;
};
