const mongoose = require('mongoose');

Guild = mongoose.model('Guild');

let switchCmd = function getCommand(message){
    const args = message.content.slice(this.prefix.length).trim().split(' ');
    args.splice(0, 2);

    let cmd = "";
    if(args.length) cmd = args.shift().toLowerCase();

    switch (cmd){
        case "reset":
            resetFoxHunt(message);
            break;
    }
};

function resetFoxHunt(message){
    Guild.resetFoxHunt({guildId: message.guild.id}, function(err) {
        if (err) {
            return message.channel.send("Something went wrong with resetting the Fox Hunt for your guild.");
        }

        return message.channel.send("The Fox Hunt game has been reset");
    });
}

module.exports = function(prefix) {
    this.prefix = prefix;
    return switchCmd;
};