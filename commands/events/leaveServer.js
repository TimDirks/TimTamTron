module.exports = {
    name: 'leave server',
    event: 'guildDelete',
    execute(guild) {
        guild.client.user.setActivity(`Serving ${guild.client.guilds.cache.size} servers`);
    },
};
