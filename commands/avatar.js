const Discord = require('discord.js');
module.exports = {
	name: 'Avatar',
	aliases: ['icon', 'pfp', 'picture'],
	category: 'misc',
	summary: 'Gets avatar of mentioned user or yourself',
	description: 'Will show a preview of the avatar together with a link to download the avatar.\nIf you tag someone it will show their avatar instead.',
	args: false,
	usage: '<target>',
	example: '@OverlordOE',

	execute(message, args, msgUser, msgGuild, client) {
		const target = message.mentions.users.first() || message.author;

		const embed = new Discord.MessageEmbed()
			.setTitle(`${target.tag}'s Avatar`)
			.setDescription(target.displayAvatarURL({ dynamic: true }))
			.setImage(target.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16');

		message.channel.send(embed);
	},
};
