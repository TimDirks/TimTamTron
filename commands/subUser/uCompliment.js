const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

function complimentUser(message){
    let member = message.mentions.members.first();
    if(!member)
        return message.reply("Please mention a valid member of this server");

    // Don't compliment yourself
    if(member.id === message.author.id)
        return message.channel.send("Isn't it a bit weird to compliment yourself "+member+"?");

    // How kind to compliment the bot
    if(member.id === client.user.id)
        return message.channel.send("I appreciate the kindness but wouldn't it be a bit weird for me to compliment myself?");

    Guild.findOne({guildId: message.guild.id}, function(err, guild){
        if(err) return message.channel.send("Something went wrong with getting your guild from the database...");
        if(guild.compliments.length > 0){
            let randomComp = Math.floor(Math.random() * guild.compliments.length);
            let compliment = guild.compliments[randomComp];
            let msg = compliment.indexOf('[user]') >= 0 ? compliment.replace("[user]", member) : `${member}, ${compliment}`;

            message.channel.send(msg);
        } else {
            return message.channel.send("Looks like you have no compliments saved...");
        }
    });

    // Add 1 to your compliment counter
    User.findOneOrCreate({ userId: member.id }, function (err, user) {
        if (err) return console.log(err);
        user.complimented += 1;
        user.save();
    });

    User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
        if (err) return console.log(err);
        user.complimenting += 1;
        user.save();
    });
}

module.exports = complimentUser;