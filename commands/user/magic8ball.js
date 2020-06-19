const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

module.exports = {
    name: 'magic8ball',
    aliases: ['8ball', 'magic8', 'fortune'],
    description: 'The bot will use it\'s wizard powers to answer all of your burning questions!',
    args: true,
    usage: 'Will this question be answered?',
    execute(message) {
        Guild.findOneOrCreate({guildId: message.guild.id}, function(err, guild){
            if(err) {
                return message.channel.send("Something went wrong with getting your guild from the database...");
            }

            if(guild.magicBall.length > 0){
                let randomReply = Math.floor(Math.random() * guild.magicBall.length);

                message.channel.send(guild.magicBall[randomReply]);
            } else {
                message.channel.send("Looks like there are no replies saved...");
            }
        });

        User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
            if (err) {
                return console.log(err);
            }

            user.magicBall += 1;
            user.save();
        });
    },
};
