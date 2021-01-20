const Discord = require('discord.js');
module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'picture'],
	category: 'misc',
	summary: 'Gets avatar of mentioned user or yourself',
	description: 'Will show a preview of the avatar together with a link to download the avatar.\nIf you tag someone it will show their avatar instead.',
	args: false,
	usage: '<target>',

	execute(message, args, msgUser, client, logger) {
		const target = message.mentions.users.first() || message.author;
		const avatar = target.displayAvatarURL();

		const embed = new Discord.MessageEmbed()
			.setTitle(`${target.tag}'s Avatar`)
			.setDescription(avatar)
			.setImage(avatar)
			.setColor(client.characterCommands.getColour(msgUser));

		message.channel.send(embed);
	},
};
