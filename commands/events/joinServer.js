const mongoose = require('mongoose');

Guild = mongoose.model('Guild');

module.exports = {
    name: 'join server',
    event: 'guildCreate',
    execute(guild) {
        Guild.findOneOrCreate({ guildId: guild.id }, (err, guild) => {
            if (err) {
                return console.log(err);
            }
        });

        guild.client.user.setActivity(`Serving ${guild.client.guilds.cache.size} servers`);
    },
};
