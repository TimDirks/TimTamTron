const mongoose = require('mongoose');

User = mongoose.model('User');
Guild = mongoose.model('Guild');

let switchCmd = function getCommand(message){
    const args = message.content.slice(this.prefix.length).trim().split(' ');
    args.splice(0, 1);

    let cmd = "";
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
        case "shoot":
            shootFox(message);
            break;
        case "getplayers":
            getPlayers(message);
            break;
    }
};

function getHelp(message){
    let help = "```Fox Hunt overview```\n";
    help += "\n**t.foxhunt/t.foxhunt help -** You get this list. Great job, you played yourself!";
    help += "\n**t.foxhunt info -** Get the information on how to play the game.";
    help += "\n**t.foxhunt start -** Initiate a game of Fox Hunt! Users can enter by clicking the emote.";
    help += "\n**t.foxhunt confirm -** Starts the game of Fox Hunt with all the users who entered.";
    help += "\n**t.foxhunt shoot [user] -** Make a guess at who the Fox might be! Be careful, you can only do this once!";
    help += "\n**t.foxhunt getPlayers -** Show a list of players who are in the current game.";
    help += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(help);
}

function getInfo(message){
    let info = "```Fox Hunt information```\n";
    info += "\n**The game**";
    info += "\nFox Hunt is a pretty basic game which relies on the players to create half the fun.";
    info += "\nIn a game of Fox Hunt there is 1 Fox and the rest of the players are Hunters.";
    info += "\nIt is the Hunters' goal to hunt the Fox, and of course the goal of the Fox is to remain alive until there is only 1 Hunter left.";
    info += "\nTo play the game you can attempt to hunt the Fox by 'shooting' a user. But be careful, you can only shoot once!";
    info += "\nThe Fox will die if he gets shot. However shooting another hunter has a 75% chance of killing that hunter, thus meaning they can't make their shot!";
    info += "\nSide note: the Fox itself can 'shoot' (or 'eat') a hunter once as well, to keep it fair.";
    info += "\n\nNow of course everyone can go round and shoot right away but that's not fun, is it?";
    info += "\nTry to play the game sneakily, see who is acting weird when they're asked questions.";
    info += "\nBecome a true detective and try not to get outsmarted by the Fox!";
    info += "\n\n```For any more information look for TimTam :)```";

    message.channel.send(info);
}

function startGame(message){
    Guild.findOneOrCreate({guildId: message.guild.id}, function(err, guild){
        if(err) return message.channel.send("Something went wrong with getting your guild from the database...");
        if(guild.foxHunt.status !== undefined && guild.foxHunt.status !== "ready") return message.channel.send("Looks like this server already has a game of Fox Hunt pending or active. You could ask an admin to reset the game.");

        message.channel.send("I will start a game of Fox Hunt. React with :arrow_up: to be participate in the game").then(function (message) {
            message.react("⬆");
            guild.foxHunt.status = "pending";
            guild.foxHunt.messageId = message.id;
            guild.markModified('foxHunt');
            guild.save();
        });
    });
}

function confirmGame(message){
    Guild.findOneOrCreate({guildId: message.guild.id}, function(err, guild){
        if(err) return message.channel.send("Something went wrong with getting your guild from the database...");

        if(guild.foxHunt.messageId === "")
            return message.channel.send("Looks like this server hasn't initialized a game of Fox Hunt yet. Use t.foxHunt help to see how to initialize a game of Fox Hunt!");

        if(guild.foxHunt.status !== "pending")
            return message.channel.send("Looks like this server already has a game of Fox Hunt active. You could ask an admin to reset the game.");

        let players = [];

        message.channel.fetchMessage(guild.foxHunt.messageId).then(message => {
            const react = message.reactions.filter(r => r.emoji.name === "⬆").first();
            let reacts = react.count;

            react.fetchUsers()
                .then(users => {
                    users.map(user => {
                        if (!user.bot) {
                            players.push({
                                id: user.id,
                                name: user.username
                            });
                        }
                    });
                })
                .then(() => {
                    if (players.length < 3)
                        return message.channel.send("Looks like there aren't enough people joining yet. You'll need at least 3 players!");

                    assignFox(guild, message, players);
                })
                .catch(err => message.reply("Cannot fetch users for react: '" + reacts + "', err: " + err + "!"));

        }).catch(err => {
            console.log(err);
        });
    });
}

function shootFox(message){
    Guild.findOneOrCreate({guildId: message.guild.id}, function(err, guild){
        if(err) return message.channel.send("Something went wrong with getting your guild from the database...");

        if (guild.foxHunt.status !== "started")
            return message.channel.send("Looks like this server doesn't have a game of Fox Hunt active. Use t.foxHunt help to see how to start a game.");

        if (!guild.foxHunt.hunters.includes(message.author.id))
            return message.channel.send(`I'm sorry ${message.member}, it looks like you aren't part of this game of Fox Hunt. Your shot won't do anything.`);

        if (guild.foxHunt.failed.includes(message.author.id))
            return message.reply("Looks like you either died to a shot or took a shot but didn't kill the fox. I'm afraid that you're out!");

        let guessedMember = message.mentions.members.first();

        if (!guessedMember)
            return message.reply("Please tag a member in your message who you think might be the fox.");

        if (message.author.id === guessedMember.id)
            return message.reply("You aren't allowed to shoot yourself. But no worries, you can still shoot again!");

        if (!guild.foxHunt.hunters.includes(guessedMember.id))
            return message.reply("It appears that the person you shot isn't in the current game. But no worries, you can still shoot again!");


        if (guild.foxHunt.curFox === guessedMember.id) {
            message.channel.send(`Congratulations, **${message.member.displayName}** has shot the fox! **${guessedMember.displayName}** was the fox all along! Well played!`);

            User.findOneOrCreate({ userId: message.author.id }, function (err, user) {
                if (err) return console.log(err);
                user.foxHunted += 1;
                user.save();
            });

            return resetGame(message);
        }

        if (!Math.floor(Math.random()*4)) {
            message.channel.send(`It turns out that **${guessedMember.displayName}** isn't the fox, but luckily survived the shot. Barely. However I'm afraid that you're out yourself. Be more careful next time!`);
        } else {
            message.channel.send(`It turns out that **${guessedMember.displayName}** isn't the fox but still died to the shot. Now both of you are out! Be more careful next time!`);
            guild.foxHunt.failed.push(guessedMember.id);
        }

        guild.foxHunt.failed.push(message.author.id);

        let playersLeft = guild.foxHunt.hunters.filter((id) => !guild.foxHunt.failed.includes(id));

        let index = playersLeft.indexOf(guild.foxHunt.curFox);
        if (index > -1) {
            playersLeft.splice(index, 1);
        }

        if (playersLeft.length < 2) {
            let fox = message.guild.members.find(member => member.id === guild.foxHunt.curFox);

            if (!fox) {
                message.channel.send("It appears the fox is left with just one hunter but the fox can't be found? Perhaps they left the server... In any case, I'll clear the game so a new one can be started!");
            } else {
                message.channel.send(`It appears that the fox is left with just one hunter, meaning the fox wins! Great job fox, or should I say **${fox.displayName}**! I'll reset the game so you can start a new one again!`);

                User.findOneOrCreate({userId: fox.id}, function (err, user) {
                    if (err) return console.log(err);
                    user.foxWon += 1;
                    user.save();
                });
            }

            return resetGame(message, false);
        }

        guild.markModified('foxHunt');
        guild.save();

        getPlayers(message, guild);
    });
}

function getPlayers(message, guild = {}) {
    if (Object.keys(guild).length === 0 && guild.constructor === Object) {
        Guild.findOneOrCreate({guildId: message.guild.id}, function(err, guild) {
            let leftPlayers = guild.foxHunt.hunters.filter((id) => !guild.foxHunt.failed.includes(id));
            displayPlayers(message, leftPlayers);
        });
    } else {
        let leftPlayers = guild.foxHunt.hunters.filter((id) => !guild.foxHunt.failed.includes(id));
        displayPlayers(message, leftPlayers);
    }
}

function displayPlayers(message, hunters) {
    let players = message.guild.members
        .filter((member) => hunters.includes(member.id))
        .map((member) => member.displayName);

    let playerList = '**The list of players still in the game:**';

    for (let player of players) {
        playerList += `\n${player}`;
    }

    message.channel.send(playerList);
}

function assignFox(guild, message, players) {
    const fox = players[Math.floor(Math.random() * players.length)];

    let shouldReturn = false;

    message.guild.fetchMember(fox.id).then(user => {
        user.send('You\'re the Fox for this game! Get your best pokerface on and try to trick the hunters!')
            .catch(() => {
                message.channel.send(`It looked like ${user} was going to be the fox but (s)he has DM's turned off so I can't notify them that (s)he is the fox. I'll reset the game so another attempt can be made.`);
                shouldReturn = true;
            });
    }).catch(() => {
        message.channel.send('It looks like who ever was going to be the fox can\'t be found. I\'ll reset the game so another attempt can be made. Sorry for the inconvenience.');
        shouldReturn = true;
    });

    if (shouldReturn) {
        return resetGame(message, false);
    }

    message.channel.send(`The game of Fox Hunt has started! A total of ${players.length} players are playing, happy hunting!`);

    guild.foxHunt.curFox = fox.id;
    guild.foxHunt.hunters = players.map(player => player.id);
    guild.foxHunt.status = "started";
    guild.markModified('foxHunt');
    guild.save();

    getPlayers(message, guild);
}

function resetGame (message, showMsg = true) {
    Guild.resetFoxHunt({guildId: message.guild.id}, function(err) {
        if (err) return message.channel.send("Something went wrong with resetting the Fox Hunt for your guild.");

        if (showMsg) return message.channel.send("The Fox Hunt game has been reset");
    });
}

module.exports = function(prefix) {
    this.prefix = prefix;
    return switchCmd;
};