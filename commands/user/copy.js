module.exports = {
    name: 'copy',
    aliases: ['repeat'],
    description: 'Sends the message from the command as the bot and deleting the original, making it look like the bot said it.',
    args: true,
    usage: 'All of this text will be copied!',
    execute(message, args) {
        const copyMessage = args.join(' ');

        message.delete()
            .catch(function(){
                console.log("Couldn't delete message...");
            });

        if(copyMessage !== "") {
            message.channel.send(copyMessage);
        }
    },
};
