const Discord = require('discord.js');
const loottable = require('../data/loottables');
module.exports = {
	name: 'Open',
	summary: 'open chests',
	description: 'Open chests to get the contents within.',
	category: 'economy',
	aliases: ['o', 'chest'],
	usage: '<chest>',

	args: true,

	async execute(message, args, msgUser, msgGuild, client) {
		const lootEmbed = new Discord.MessageEmbed()

			.setFooter('You can open multiple chests at the same time.', client.user.displayAvatarURL());

		const chestList = ['common', 'rare', 'epic', 'legendary', 'mystery', 'common chest', 'rare chest', 'epic chest', 'legendary chest', 'mystery chest'];

		let temp = '';
		let amount = 1;

		for (let i = 0; i < args.length; i++) {
			if (!(isNaN(args[i]))) amount = parseInt(args[i]);
			else if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}
		const chest = temp.toLowerCase().replace(' chest', '');

		if (chestList.includes(chest)) {

			if (amount > 1) {

				const item = client.util.getItem(`${chest} chest`);
				if (!await client.characterCommands.hasItem(msgUser, item, amount)) return message.reply(`You don't have ${amount} __${item.name}(s)__!`);
				lootEmbed.setTitle(`${amount} ${chest} chests`);

				let description = `${message.author} has discovered:\n`;
				const lootlist = {};

				for (let i = 0; i < amount; i++) {
					const loot = loottable[chest]();
					const itemAmount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);
					if (!lootlist[loot.name]) lootlist[loot.name] = itemAmount;
					else lootlist[loot.name] += itemAmount;
				}

				for (const loot in lootlist) {
					const lootItem = client.util.getItem(loot);
					description += `\n**${client.util.formatNumber(lootlist[loot])}** ${lootItem.emoji}__${lootItem.name}__`;
					client.characterCommands.addItem(msgUser, lootItem, lootlist[loot]);
				}

				lootEmbed.setDescription(description);
				client.util.addPicture(lootEmbed, chest, true);

				message.channel.send(lootEmbed);
				client.characterCommands.removeItem(msgUser, item, amount);
			}

			else {
				const item = client.util.getItem(`${chest} chest`);
				if (!await client.characterCommands.hasItem(msgUser, item, amount)) return message.reply(`You don't have ${amount} __${item.name}(s)__!`);

				const loot = loottable[chest]();
				const lootItem = client.util.getItem(loot.name);
				const itemAmount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);


				lootEmbed.setTitle(`${chest} Chest`)
					.setDescription(`${message.author} has discovered **${itemAmount}** **__${lootItem.emoji}${lootItem.name}__**.`);
				client.util.addPicture(lootEmbed, lootItem);
				client.util.addPicture(lootEmbed, chest, true);


				if (lootItem.rarity == 'uncommon') lootEmbed.setColor('#1eff00');
				else if (lootItem.rarity == 'rare') lootEmbed.setColor('#0070dd');
				else if (lootItem.rarity == 'epic') lootEmbed.setColor('#a335ee');
				else if (lootItem.rarity == 'legendary') lootEmbed.setColor('#ff8000');
				else lootEmbed.setColor('#eeeeee');

				message.channel.send(lootEmbed);

				client.characterCommands.addItem(msgUser, lootItem, itemAmount);
				client.characterCommands.removeItem(msgUser, item);
			}
		}
		else message.reply('there is no loot associated with that chest.');
	},
};