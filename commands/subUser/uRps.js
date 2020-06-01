const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

let rps = [ "rock", "paper", "scissors"];
let rpsBeat = { rock:"scissors", paper:"rock", scissors:"paper"};

function playRps(message, args){
    if(args.length === 0 || rps.indexOf(args[0].toLowerCase()) <= -1) {
        return message.channel.send("Please give a valid option to play (Rock, Paper, Scissors).");
    }

    let play = args[0].toLowerCase();
    let botChoice = rps[Math.floor(Math.random() * rps.length)];

    let result = "I choose "+ botChoice +"! ";

    User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
        if (err) return console.log(err);

        User.findOneOrCreate({ userId: client.user.id }, function (err, bot) {
            if (err) return console.log(err);

            if(play === botChoice){
                user.rpsTie += 1;
                bot.rpsTie += 1;
                result += "It's a tie! What a tough match that was.";
            } else if(rpsBeat[play] === botChoice){
                user.rpsWin += 1;
                bot.rpsLose += 1;
                result += "You win! Nicely played!";
            } else {
                user.rpsLose += 1;
                bot.rpsWin += 1;
                result += "You Lose! Perhaps you'll win next time.";
            }

            bot.save();
            user.save();

            message.channel.send(result);
        });
    });
}

module.exports = playRps;