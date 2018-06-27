const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

var switchCmd = function getCommand(message){
    const args = message.content.slice(this.prefix.length).trim().split(' ');
    const cmd = args.shift().toLowerCase();

    switch (cmd){
        case "admin":
            message.channel.send("Admin stuff will come, don't worry ;)");
        break;
    }
};

module.exports = function(bot, prefix) {
    this.client = bot;
    this.prefix = prefix;
    return switchCmd;
};