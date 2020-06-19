module.exports = {
    name: 'latency',
    aliases: ['ping'],
    description: 'Get the latency of the bot.',
    execute(message) {
        message.channel.send('Checking ping...')
            .then(sendMessage => {
               sendMessage.edit(`Ping checked! The latency is ${sendMessage.createdTimestamp - message.createdTimestamp}ms.` +
               `\nThe API latency is ${Math.round(message.client.ws.ping)}ms.`);
            });
    },
};
