const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

let rps = ['rock', 'paper', 'scissors'];
let rpsBeat = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

module.exports = {
    name: 'rockpaperscissors',
    aliases: ['rps'],
    description: 'Challenge the bot with a game of rock, paper, scissors!',
    args: true,
    usage: '[rock/paper/scissors]',
    execute(message, args) {
        if(rps.indexOf(args[0].toLowerCase()) <= -1) {
            return message.channel.send('Please give a valid option to play (Rock, Paper, Scissors).');
        }

        let play = args[0].toLowerCase();
        let botChoice = rps[Math.floor(Math.random() * rps.length)];

        let result = `I choose ${botChoice}! `;

        User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
            if (err) return console.log(err);

            User.findOneOrCreate({ userId: message.client.user.id }, function (err, bot) {
                if (err) return console.log(err);

                if(play === botChoice){
                    user.rpsTie += 1;
                    bot.rpsTie += 1;
                    result += 'It\'s a tie! What a difficult match that was.';
                } else if(rpsBeat[play] === botChoice){
                    user.rpsWin += 1;
                    bot.rpsLose += 1;
                    result += 'You won! Nicely played!';
                } else {
                    user.rpsLose += 1;
                    bot.rpsWin += 1;
                    result += 'You Lost! Perhaps you\'ll win next time.';
                }

                bot.save();
                user.save();

                message.channel.send(result);
            });
        });
    },
};
