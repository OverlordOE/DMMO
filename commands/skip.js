module.exports = {
	name: 'Skip',
	summary: 'Skip the current song',
	description: 'Skip the current song.',
	category: 'music',
	aliases: ['next'],
	args: false,
	usage: '',
	example: '',

	execute(message, args, msgUser, msgGuild, client, logger) {
		if (!message.member.voice.channel) return message.reply('you are not in a voice channel.');
		if (!client.music.active.get(message.guild.id)) return message.reply('there are no songs to skip.');

		return client.music.active.get(message.guild.id).dispatcher.emit('finish');

	},
};
