const mongoose = require('mongoose');

Guild = mongoose.model('Guild');

function sendJoinMessage (member) {
    Guild.findOne({guildId: member.guild.id}, function(err, guild){
        const channel = member.guild.channels.cache.find(channel => channel.id === guild.config.joinMessageChannel);

        if(channel){
            let joinMessage = guild.joinMessages[Math.floor(Math.random() * guild.joinMessages.length)];

            let msg = joinMessage.indexOf('[user]') >= 0 ? joinMessage.replace('[user]', member) : `${member}, ${joinMessage}`;

            channel.send(msg);
        }
    });
}

module.exports = sendJoinMessage;