const Discord = require('discord.js');
const items = require('../data/items');
module.exports = {
	name: 'item',
	summary: 'Shows information about a specific item',
	description: 'Shows information about a specific item.',
	category: 'info',
	aliases: ['items', 'i'],
	args: false,
	usage: '<item>',

	execute(message, args, msgUser, client, logger) {
		let temp = '';
		let embed;

		for (let i = 0; i < args.length; i++) {
			if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}


		if (temp) {
			const item = client.characterCommands.getItem(temp);
			if (!item) return message.reply(`${item} is not a valid item`);

			embed = new Discord.MessageEmbed()
				.setTitle(`${item.emoji}${item.name}`)
				.setDescription(item.description)
				.addField('Value', `${client.util.formatNumber(item.value)}💰`, true)
				.addField('Buyable', item.buyable, true)
				.addField('Category', item.ctg, true)
				.setFooter('Use the command without arguments to see the item list', client.user.displayAvatarURL())
				.attachFiles(`assets/rarity/${item.rarity}.jpg`)
				.setThumbnail(`attachment://${item.rarity}.jpg`);

			if (item.picture) embed.attachFiles(`assets/items/${item.picture}`)
				.setImage(`attachment://${item.picture}`);

			if (item.rarity == 'uncommon') embed.setColor('#1eff00');
			else if (item.rarity == 'rare') embed.setColor('#0070dd');
			else if (item.rarity == 'epic') embed.setColor('#a335ee');
			else if (item.rarity == 'legendary') embed.setColor('#ff8000');
			else embed.setColor('#eeeeee');

			if (item.ctg == 'equipment')
				for (const stat in item.stats)
					embed.addField(stat, `**${item.stats[stat]}**`, true);
		}

		else {
			let collectables = '__Collectables:__\n';
			let chests = '__Chests:__\n';
			let equipment = '__Equipment:__\n';

			Object.values(items).sort((a, b) => {
				if (a.name < b.name) return -1;
				if (a.name > b.name) return 1;
				return 0;
			}).map((i) => {

				 if (i.ctg == 'collectable') collectables += `${i.emoji}${i.name}\n`;
				else if (i.ctg == 'chest') chests += `${i.emoji}${i.name}\n`;
				else if (i.ctg == 'equipment') equipment += `${i.emoji}${i.name}\n`;
			});

			const description = `${chests}\n${equipment}\n${collectables}`;

			embed = new Discord.MessageEmbed()
				.setTitle('Neia Item List')
				.setThumbnail(client.user.displayAvatarURL())
				.setDescription(description)
				.setColor(client.characterCommands.getColour(msgUser))
		}

		return message.channel.send(embed);
	},
};