const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    aliases: ['commands'],
    description: 'List all the commands or get all info of a specific command.',
    usage: '[command name]',
    execute(message, args) {
        const { commands } = message.client;

        if (!args.length) {
            let reply = '**Here is a list of all the commands:**\n';

            reply += commands.map(cmd => cmd.name).join(', ');

            reply += `\n\nFor more info of a specific command, use \`${prefix}help [command name]\`.`;

            return message.channel.send(reply, { split: true });
        }

        const name = args[0].toLowerCase();

        const command = commands.get(name) ||
            commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

        if (!command) {
            return message.channel.send('A command with that name could not be found. Have you made a typo?');
        }

        let reply = `**Info about the ${command.name} command.**`;

        if (command.aliases) reply += `\n**Aliases:** ${command.aliases.join(', ')}`;
        if (command.description) reply += `\n**Description:** ${command.description}`;
        if (command.usage) reply += `\n**Usage:** ${prefix}${command.name} ${command.usage}`;

        message.channel.send(reply, { split: true });
    },
};
