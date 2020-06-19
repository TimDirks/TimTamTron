const mongoose = require('mongoose');

User = mongoose.model('User');

module.exports = {
    name: 'statistics',
    aliases: ['stats'],
    description: 'Get some statistics of yourself or someone else.',
    usage: '[optional: user]',
    execute(message) {
        let member = message.mentions.members.first() || message.author;

        User.findOneOrCreate({ userId: member.id }, function (err, user) {
            if (err) return console.log(err);

            let stats = `**Statistics for** ${member}` +
            `\nGot a compliment ${user.complimented} times.` +
            `\nGave a compliment ${user.complimenting} times.` +
            `\nCracked a joke ${user.jokes} times.` +
            `\nRock Paper Scissors wins/ties/loses: ${user.rpsWin}/${user.rpsTie}/${user.rpsLose}.` +
            `\nShook the magic 8 ball ${user.magicBall} times.` +
            `\nWon Fox Hunt as a fox ${user.foxWon} times.` +
            `\nShot the fox in Fox Hunt ${user.foxHunted} times.`;

            message.channel.send(stats, { split: true });
        });
    },
};
