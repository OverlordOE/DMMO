const Discord = require('discord.js');
const items = require('../data/items');
module.exports = {
	name: 'shop',
	summary: 'Shows all the shop items',
	description: 'Shows all the shop items.',
	category: 'info',
	aliases: ['store'],
	args: false,
	usage: '',

	execute(message, args, msgUser, client, logger) {

		let collectables = '__**Collectables:**__\n';
		let chests = '__**Chests:**__\n';
		let equipment = '__**Equipment:**__\n';

		Object.values(items).sort((a, b) => a.value - b.value).map((i) => {
			if (i.buyable) {
				if (i.ctg == 'collectable') collectables += `${i.emoji} ${i.name}: ${client.util.formatNumber(i.value)}💰\n`;
				else if (i.ctg == 'chest') chests += `${i.emoji} ${i.name}: ${client.util.formatNumber(i.value)}💰\n`;
				else if (i.ctg == 'equipment') equipment += `${i.emoji}${i.name}: ${client.util.formatNumber(i.value)}💰\n`;
			}
		});

		const description = `${chests}\n${equipment}\n${collectables}`;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Shop')
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription(description)
			.setColor(client.characterCommands.getColour(msgUser))

			.setFooter('Use the items command to see the full item list.', client.user.displayAvatarURL());

		return message.channel.send(embed);
	},
};