module.exports = {
	name: 'skip',
	summary: 'Skip a song',
	description: 'Skip a song.',
	category: 'music',
	aliases: ['next'],
	args: false,
	usage: '',

	execute(message, args, msgUser, client, logger) {
		if (!message.member.voice.channel) return message.reply('you are not in a voice channel.');
		if (!client.music.active.get(message.guild.id)) return message.reply('there are no songs to skip.');

		return client.music.active.get(message.guild.id).dispatcher.emit('finish');

	},
};
