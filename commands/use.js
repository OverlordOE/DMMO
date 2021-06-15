const Discord = require('discord.js');
module.exports = {
	name: 'Use',
	summary: 'Use an item from your inventory',
	description: 'Use an item from your inventory.',
	category: 'economy',
	aliases: ['item'],
	args: true,
	usage: '<item> <amount>',
	example: 'chest 2',

	async execute(message, args, msgUser, msgGuild, client) {
		let amount = 1;
		let temp = '';

		const embed = new Discord.MessageEmbed()
			.setTitle('Project Neia Item Use')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor('#f3ab16')
			.setFooter('To see what an item does use the `item` command', client.user.displayAvatarURL());


		const sentMessage = await message.channel.send(embed);

		for (let i = 0; i < args.length; i++) {
			if (!isNaN(parseInt(args[i]))) amount = parseInt(args[i]);

			else if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}
		if (amount < 1) amount = 1;

		const item = client.util.getItem(temp);
		if (item) {
			if (await client.userCommands.hasItem(msgUser, item, amount)) {

				if (item.use) {
					const result = await item.use(client, amount, embed, item, msgUser, msgGuild, message);

					if (result.succes) {
						client.userCommands.removeItem(msgUser, item, amount);
						return sentMessage.edit(embed.setDescription(result.message).setColor('#00fc43'));
					}
					else if (result.message) return sentMessage.edit(embed.setDescription(result.message));
					else return sentMessage.edit(embed.setDescription('An error has occurred, please report this to OverlordOE#0717').setColor('#fc0303'));
				}

				else if (item.ctg == 'chest') return sentMessage.edit(embed.setDescription('Please use the `open` command to use a chest'));
				else if (item.ctg == 'equipment') return sentMessage.edit(embed.setDescription('Please use the `equip` command to use equipment'));
				else if (item.ctg == 'collectable') return sentMessage.edit(embed.setDescription('Collectables are passive items that will award you with extra money with your time based rewards.'));
				else return sentMessage.edit(embed.setDescription(`There is no use for __${item.name}__ yet, the item was not used.`));
			}
			else return sentMessage.edit(embed.setDescription(`You don't have enough __${item.emoji}${item.name}(s)__!`).setColor('#fc0303'));
		}
		else if (temp) return sentMessage.edit(embed.setDescription(`__${temp}__ is not a valid item.`).setColor('#fc0303'));
		else return sentMessage.edit(embed.setDescription('You didn\'t specify the item you want to use.').setColor('#fc0303'));
	},
};