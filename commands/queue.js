const Discord = require('discord.js');
module.exports = {
	name: 'Queue',
	description: 'Shows the song queue',
	summary: 'Shows the song queue and information about the songs in the queue.',
	category: 'music',
	aliases: ['list'],
	args: false,
	usage: '',
	example: '',


	execute(message, args, msgUser, msgGuild, client, logger) {
		const data = client.music.active.get(message.guild.id);
		if (!data) return message.reply('no client.music queued at the moment.');

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Queue')
			.setColor('#f3ab16');

		const queue = data.queue;

		for (let i = 0; i < queue.length; i++) {
			if (data.paused) embed.addField('PAUSED', 'Use the `resume` command to unpause');
			if (i == 0) embed.addField(`Now playing: **${queue[i].title}**`, `Channel: **${queue[i].channel}**\nDuration: **${queue[i].duration}**\nRequested by: ${queue[i].requester}`);
			else embed.addField(`${i}: **${queue[i].title}**`, `Channel: **${queue[i].channel}**\nDuration: **${queue[i].duration}**\nRequested by: ${queue[i].requester}`);
		}
		message.channel.send(embed.setThumbnail(queue[0].thumbnail));
	},
};