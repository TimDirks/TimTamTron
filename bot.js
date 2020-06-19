const Discord = require("discord.js");
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

function loadEvents () {
    const eventFiles = fs.readdirSync('./commands/events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const eventCommand = require(`./commands/events/${file}`);

        if (eventCommand.event && eventCommand.execute) {
            client.on(eventCommand.event, eventCommand.execute);
        }
    }
}

function loadCommands () {
    const commandFiles = fs.readdirSync('./commands/user').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/user/${file}`);

        client.commands.set(command.name, command);
    }
}

client.on("ready", () => {
    console.log(`Bot has started with:
     ${client.users.cache.size} users,
     ${client.channels.cache.size} channels,
     ${client.guilds.cache.size} guilds,`);

    client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

loadEvents();
loadCommands();

module.exports = client;
