const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

function getJoke(message){
    User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
        if (err) {
            return console.log(err);
        }

        user.joked += 1;
        user.save();
    });

    Guild.findOne({guildId: message.guild.id}, function(err, guild){
        if(err) {
            return message.channel.send("Something went wrong with getting your guild from the database...");
        }

        if(guild.jokes.length > 0){
            let randomJoke = Math.floor(Math.random() * guild.jokes.length);

            message.channel.send(guild.jokes[randomJoke]);
        } else {
            message.channel.send("Looks like you have no jokes saved...");
        }
    });
}

module.exports = getJoke;