const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

var switchCmd = function getCommand(message){
    const args = message.content.slice(this.prefix.length).trim().split(' ');
    args.splice(0, 1);

    var cmd = "";
    if(args.length) cmd = args.shift().toLowerCase();

    switch (cmd){
        case "": case "help":
            getHelp(message);
            break;
        case "info":
            getInfo(message);
            break;
        case "start":
            startGame(message);
            break;
        case "confirm":
            confirmGame(message);
            break;
        case "guess":
            guessFox(message);
            break;
            // TODO Make admin command to reset the game!
    }
};

function getHelp(message){
    var help = "```Fox Hunt overview```\n";
    help += "\n**t.foxhunt/t.foxhunt help -** You get this list. Great job, you played yourself!";
    help += "\n**t.foxhunt info -** Get the information on how to play the game.";
    help += "\n**t.foxhunt start -** Initiate a game of Fox Hunt! Users can enter by clicking the emote.";
    help += "\n**t.foxhunt confirm -** Starts the game of Fox Hunt with all the users who entered.";
    help += "\n**t.foxhunt guess [user] -** Make a guess at who the Fox might be! Be carefull, you can only do this once!";
    help += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(help);
}

function getInfo(message){
    var info = "```Fox Hunt information```\n";
    info += "\n**The game**";
    info += "\nFox Hunt is a pretty basic game which requires the players to create half the fun.";
    info += "\nIn a game of Fox Hunt there is 1 Fox and the rest of the players are Hunters.";
    info += "\nIt is the Hunters their goal to hunt the Fox, and ofcourse the goal of the Fox is to remain alive until there is only 1 Hunter left.";
    info += "\nTo play the game you can attempt to hunt the Fox by guessing a user. But be careful, you can only guess once!";
    info += "\nGuess wrong and you're out of the game. Guess right however, and you win the game!";
    info += "\nSide note: the Fox itself can guess once aswell, to keep it fair.";
    info += "\n\nNow ofcourse everyone can go round and guess right away but that's not fun, is it?";
    info += "\nTry to play the game sneaky, see who is acting weird when they're asked questions.";
    info += "\nBecome a true detective and try not to get outsmarted by the Fox!";
    info += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(info);
}

function startGame(message){
    /*
    * Check if Guild does not have an active game running
    * Create message where people can click on an emote to enter
    */
}

function confirmGame(message){
    /*
    * Check if Guild does not have an active game running
    * Check if more than 1 user has upvoted the suggestion to play the game
    * Get a random Fox, DM that user that they are the fox
    * Fill database object with the data
    */
}

function guessFox(message){
    /*
    * Check if Guild has an active game running
    * Check if guesser is in Guild array of hunters
    * Check if guesser is NOT in Guild array of surrenders
    * Check if guess is in Guild array of hunters
    * Check if guess is not guesser himself
    * Check if guesser guessed the correct fox
    *  -> Clear the fox game
    *  -> Add the corresponding scores to the fox and hunter
    *  Else show that guess is not the fox
    *  -> Remove guesser from the Hunters
    *  -> Add user to Surrenders
    *  -> Check if the amount of hunters is more than or equal to 2 (1 Fox (if Fox is not in surrenders yet), atleast 2 actual hunters)
    *  Remove the guess message for secrecy
    */
}

module.exports = function(prefix) {
    this.prefix = prefix;
    return switchCmd;
};