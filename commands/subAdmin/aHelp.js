let switchCmd = function getCommand(message){
    const args = message.content.slice(this.prefix.length).trim().split(' ');
    args.splice(0, 2);

    let cmd = "";
    if(args.length) cmd = args.shift().toLowerCase();

    switch (cmd){
        case "":
            getHelp(message);
            break;
        case "compliment":
            getHelpComp(message);
            break;
        case "joke":
            getHelpJoke(message);
            break;
        case "8ball":
            getHelp8ball(message);
            break;
        case "foxhunt":
            getHelpFoxhunt(message);
            break;
    }
};

function getHelp(message){
    let help = "```Admin Help Command overview```\n";
    help += "\n**Usage:** t.admin help [command]";
    help += "\n**Valid [command] options:** compliment, joke, 8ball, foxhunt";
    help += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(help);
}
function getHelpComp(message){
    let help = "```Admin Compliment Command overview```\n";
    help += "\n**t.admin compliment -** You get a list of all the compliments from you server.";
    help += "\n**t.admin compliment reset -** Resets the compliments to the default list.";
    help += "\n**t.admin compliment add [compliment] -** Add your own compliment. Include ``[user]`` in the compliment to @ the given user when the command is called.";
    help += "\n**t.admin compliment remove [index] -** Will remove the compliment with the given index from the list. To check the indexes use t.admin compliment.";
    help += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(help);
}
function getHelpJoke(message){
    let help = "```Admin Joke Command overview```\n";
    help += "\n**t.admin joke -** You get a list of all the jokes from you server.";
    help += "\n**t.admin joke reset -** Resets the jokes to the default list.";
    help += "\n**t.admin joke add [joke] -** Add your own joke.";
    help += "\n**t.admin joke remove [index] -** Will remove the joke with the given index from the list. To check the indexes use t.admin joke.";
    help += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(help);
}
function getHelp8ball(message){
    let help = "```Admin magic 8 ball Command overview```\n";
    help += "\n**t.admin 8ball -** You get a list of all the fortunes from you server.";
    help += "\n**t.admin 8ball reset -** Resets the fortunes to the default list.";
    help += "\n**t.admin 8ball add [fortune] -** Add your own fortune.";
    help += "\n**t.admin 8ball remove [index] -** Will remove the fortune with the given index from the list. To check the indexes use t.admin 8ball.";
    help += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(help);
}
function getHelpFoxhunt(message){
    let help = "```Admin Fox Hunt Command overview```\n";
    help += "\n**t.admin foxhunt reset -** Resets the game of Fox Hunt so a clean new one can be started.";
    help += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(help);
}

module.exports = function(prefix) {
    this.prefix = prefix;
    return switchCmd;
};