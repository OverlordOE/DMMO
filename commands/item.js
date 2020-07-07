const Discord = require('discord.js');
module.exports = {
	name: 'item',
	summary: 'Shows information about a specific item',
	description: 'Shows information about a specific item.',
	category: 'info',
	aliases: ['items'],
	args: false,
	usage: '<item>',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		let temp = '';

		for (let i = 0; i < args.length; i++) {
			if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}

		let item = await profile.getItem(temp);
		if (item) {
			const embed = new Discord.MessageEmbed()
				.setTitle(`${item.emoji}__${item.name}(s)__`)
				.setDescription(item.description)
				.addField('Cost', `**${item.cost}💰**`, true)
				.addField('Category', item.ctg, true)
				.addField('Rarity', item.rarity, true)
				.setTimestamp()
				.setFooter('DMMO', client.user.displayAvatarURL())
				.attachFiles(`assets/rarity/${item.rarity}.jpg`)
				.setThumbnail(`attachment://${item.rarity}.jpg`);

			if (item.picture) embed.attachFiles(`assets/items/${item.picture}`)
				.setImage(`attachment://${item.picture}`);
			return message.channel.send(embed);
		}
		else {
			const fs = require('fs');
			const filter = (reaction, user) => {
				return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === message.author.id;
			};
			const itemData = fs.readFileSync('data/items.json');
			const items = JSON.parse(itemData);
			let page = 0;
			if (!isNaN(args[0]) && args[0] > 0 && args[0] < items.length) page = args[0] - 1;
			item = items[page];

			message.channel.send(editEmbed(item, client)).then(sentMessage => {
				sentMessage.react('◀️');
				sentMessage.react('▶️');
				const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

				collector.on('collect', (reaction) => {
					reaction.users.remove(message.author.id);
					if (reaction.emoji.name == '◀️') {
						if (page > 0) {
							page--;
							item = items[page];
							sentMessage.edit(editEmbed(item, client));
						}
					}
					else if (reaction.emoji.name == '▶️') {
						if (page < items.length) {
							page++;
							item = items[page];
							sentMessage.edit(editEmbed(item, client));
						}
					}
				});
			});
		}
	},
};
function editEmbed(item, client) {
	const embed = new Discord.MessageEmbed()
		.setTitle(`${item.emoji}__${item.name}(s)__`)
		.setDescription(item.description)
		.addField('Cost', `**${item.cost}💰**`, true)
		.addField('Category', item.ctg, true)
		.addField('Rarity', item.rarity, true)
		.setTimestamp()
		.setFooter('DMMO', client.user.displayAvatarURL())
	return embed;
}