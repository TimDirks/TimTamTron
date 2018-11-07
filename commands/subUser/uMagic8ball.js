const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

function getMagic(message, args){
    if(args.length === 0) return message.channel.send("Please give me a question to answer.");

    // Add 1 to your magic 8 ball counter
    User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
        if (err) return console.log(err);
        user.magicBall += 1;
        user.save();
    });

    Guild.findOne({guildId: message.guild.id}, function(err, guild){
        if(err) return message.channel.send("Something went wrong with getting your guild from the database...");
        if(guild.magicBall.length > 0){
            var randomReply = Math.floor(Math.random() * guild.magicBall.length);
            message.channel.send(guild.magicBall[randomReply]);
        } else {
            message.channel.send("Looks like there are no replies saved...");
        }
    });
}

module.exports = getMagic;