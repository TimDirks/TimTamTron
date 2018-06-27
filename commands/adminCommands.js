const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

var complimentCmd = require('./subAdmin/aCompliment')(this.prefix);

var switchCmd = function getCommand(message){
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Sorry, you need Administrator permissions for the Admin commands.");
    const args = message.content.slice(this.prefix.length).trim().split(' ');
    args.splice(0, 1);

    var cmd = "";
    if(args.length) cmd = args.shift().toLowerCase();

    switch (cmd){
        case "":
            message.channel.send("Help page here");
            break;
        case "compliment":
            complimentCmd(message);
            break;
        case "admin":
            message.channel.send("Admin stuff will come, don't worry ;)");
            break;
    }
};

module.exports = function(prefix) {
    this.prefix = prefix;
    return switchCmd;
};