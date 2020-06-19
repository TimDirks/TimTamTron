const { prefix } = require("../../config.json");

// let adminCmd = require('./commands/adminCommands.js')(config.prefix);

module.exports = {
    name: 'message',
    event: 'message',
    execute(message) {
        if (message.author.bot) return;

        if (message.content.indexOf(prefix) !== 0) return;

        if (message.channel.type !== 'text') {
            return message.reply('I don\'t execute commands in DMs, sorry.');
        }

        const args = message.content.slice(prefix.length).trim().split(' ');
        const commandName = args.shift().toLowerCase();

        const command = message.client.commands.get(commandName) ||
            message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.args && !args.length) {
            let reply = 'You didn\'t provide any arguments.';

            if (command.usage) {
                reply += `\nHere is how to use the command: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);

            message.reply('there was an error trying to execute that command!');
        }

        // if (cmd === 'admin') {
        //     adminCmd(message);
        // }
    },
};
