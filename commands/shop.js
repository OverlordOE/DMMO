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

	async execute(message, args, msgUser, character, guildProfile, client, logger, cooldowns) {

		let consumable = '__**Consumables:**__\n';
		let equipment = '__**equipment:**__\n';
		// let chests = '__**Chests:**__\n';

		let i;
		for (i in items) {
			if (items[i].cost) {
				if (items[i].type.includes('consumable')) { consumable += `${items[i].emoji} ${items[i].name}: **${items[i].cost}💰**\n`; }
			if (items[i].buyable) {
				if (items[i].type.includes('consumable')) { consumable += `${items[i].emoji} ${items[i].name}:		**${items[i].value}💰**\n`; }
				else if (items[i].type.includes('equipment')) { equipment += `${items[i].emoji} ${items[i].name}:		**${items[i].value}💰**\n`; }
				// else if (items[i].type == 'chests') { chests += `${items[i].emoji} ${items[i].name}: **${items[i].value}💰**\n`; }
			}
		}

		const description = `${consumable}\n${equipment}`;

		const embed = new Discord.MessageEmbed()
			.setTitle('DMMO Shop')
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription(description)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		return message.channel.send(embed);
	},
};