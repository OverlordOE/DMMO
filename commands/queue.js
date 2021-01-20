const Discord = require('discord.js');
module.exports = {
	name: 'queue',
	description: 'Shows the song queue',
	summary: 'Shows the song queue.',
	category: 'music',
	aliases: ['list'],
	args: false,
	usage: '',


	execute(message, args, msgUser, client, logger) {
		const guildIDData = client.music.active.get(message.guild.id);
		if (!guildIDData) return message.reply('no client.music queued at the moment.');

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Queue')
			.setColor(client.characterCommands.getColour(msgUser));

		const queue = guildIDData.queue;

		if (guildIDData.loop) embed.setDescription(`Now looping: **${queue[0].songTitle}**\nDuration: ${queue[0].duration}\nRequested by ${queue[0].requester.tag}\n\nType -loop to stop the looping \n`);
		else for (let i = 0; i < queue.length; i++) {
			if (i == 0) embed.addField(`Now playing: **${queue[i].songTitle}**`, `Duration: ${queue[i].duration}\nRequested by: ${queue[i].requester}`);
			else embed.addField(`${i}: **${queue[i].songTitle}**`, `Duration: ${queue[i].duration}\nRequested by: ${queue[i].requester}`);
		}
		message.channel.send(embed.setThumbnail(queue[0].thumbnail));
	},
};