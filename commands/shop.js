const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
	name: 'shop',
	summary: 'Shows all the shop items',
	description: 'Shows all the shop items.',
	category: 'info',
	aliases: ['store'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const itemData = fs.readFileSync('data/items.json');
		const items = JSON.parse(itemData);
		let consumable = '__**Consumables:**__\n';
		let collectables = '__**Collectables:**__\n';
		let chests = '__**Chests:**__\n';

		items.map(item => {
			if (item.cost) {
				if (item.ctg == 'consumable') { consumable += `${item.emoji} ${item.name}: **${item.cost}💰**\n`; }
				else if (item.ctg == 'collectables') { collectables += `${item.emoji} ${item.name}: **${item.cost}💰**\n`; }
				else if (item.ctg == 'chests') { chests += `${item.emoji} ${item.name}: **${item.cost}💰**\n`; }
			}
		});

		const description = `${chests}\n${consumable}\n${collectables}`;

		const embed = new Discord.MessageEmbed()
			.setTitle('DMMO Shop')
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription(description)

			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		return message.channel.send(embed);
	},
};