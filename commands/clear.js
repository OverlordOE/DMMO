module.exports = {
	name: 'Clear',
	summary: 'Clears the song queue',
	description: 'Clears the song queue and makes the bot leave the voice channel.',
	category: 'music',
	aliases: ['stop'],
	args: false,
	usage: '',
	example: '',


	execute(message, args, msgUser, msgGuild, client, logger) {
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
