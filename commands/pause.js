module.exports = {
	name: 'Pause',
	summary: 'Pauses the current song',
	description: 'Pauses the current song. Use again to unpause',
	category: 'music',
	aliases: ['resume', 'unpause'],
	args: false,
	usage: '',
	example: '',

	execute(message, args, msgUser, msgGuild, client, logger) {
		if (!message.member.voice.channel) return message.reply('you are not in a voice channel.');
		const data = client.music.active.get(message.guild.id);
		if (!data) return message.reply('there are no songs to pause.');

		if (data.paused) {
			data.dispatcher.resume();
			message.reply('unpaused music.');
			data.paused = false;
		}
		else {
			data.dispatcher.pause();
			message.reply('paused music.');
			data.paused = true;
		}
	},
};