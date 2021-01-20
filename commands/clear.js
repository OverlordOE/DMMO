module.exports = {
	name: 'clear',
	summary: 'Clears the song queue',
	description: 'Clears the song queue and makes the bot leave the voice channel.',
	category: 'music',
	aliases: ['stop'],
	args: false,
	usage: '',


	execute(message, args, msgUser, client, logger) {
		if (!message.member.voice.channel) return message.reply('you are not in a voice channel.');

		const guildIDData = client.music.active.get(message.guild.id);
		if (guildIDData) {
			guildIDData.queue = [];
			guildIDData.dispatcher.emit('finish');
			message.reply('cleared the queue.');
		}
		else message.reply('there is no queue to clear.');
	},
};
