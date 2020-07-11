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

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		let consumable = '__**Consumables:**__\n';
		let collectables = '__**Collectables:**__\n';
		let chests = '__**Chests:**__\n';
		
		let i;
		for (i in items) {
			if (items[i].cost) {
				if (items[i].ctg == 'consumable') { consumable += `${items[i].emoji} ${items[i].name}: **${items[i].cost}💰**\n`; }
				else if (items[i].ctg == 'collectables') { collectables += `${items[i].emoji} ${items[i].name}: **${items[i].cost}💰**\n`; }
				else if (items[i].ctg == 'chests') { chests += `${items[i].emoji} ${items[i].name}: **${items[i].cost}💰**\n`; }
			}
		}

		const description = `${consumable}`;

		const embed = new Discord.MessageEmbed()
			.setTitle('DMMO Shop')
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription(description)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		return message.channel.send(embed);
	},
};