/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
const sellPercentage = 0.6;
module.exports = {
	name: 'Sell',
	summary: `Sell items to get ${sellPercentage * 100}% of your money back`,
	description: `Sell items to get ${sellPercentage * 100}% of your money back.`,
	aliases: ['refund'],
	category: 'economy',
	args: true,
	usage: '<item> <amount>',
	example: 'chest 2',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		let amount = 1;
		let temp = '';

		const embed = new Discord.MessageEmbed()
			.setTitle('Project Neia Refunds')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor('#f3ab16')
			.setFooter('You can type `sell all` to sell your whole inventory.', client.user.displayAvatarURL());

		const sentMessage = await message.channel.send(embed);

		for (let i = 0; i < args.length; i++) {
			if (!isNaN(parseInt(args[i]))) amount = parseInt(args[i]);
			// else if (args[i] == 'all') amount = 'all';
			else if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}
		if (amount < 1) amount = 1;

		const item = client.util.getItem(temp);
		if (item) {
			if (await client.userCommands.hasItem(msgUser, item, amount)) {
				const refundAmount = sellPercentage * item.value * amount;

				if (item.ctg == 'reaction') {
					const reaction = client.userCommands.getReaction(msgUser);
					if (item.emoji == reaction.emoji) {
						msgUser.reaction = JSON.stringify({
							emoji: '✅',
							value: 1,
						});
						msgUser.save();
					}
				}

				client.userCommands.removeItem(msgUser, item, amount);
				const balance = client.userCommands.addBalance(msgUser, refundAmount);

				sentMessage.edit(embed.setDescription(`You've refunded ${amount} ${item.emoji}__${item.name}(s)__ and received ${client.util.formatNumber(refundAmount)}💰 back.
				Your balance is ${client.util.formatNumber(balance)}💰!`)
					.setColor('#00fc43'));
			}
			else return sentMessage.edit(embed.setDescription(`__**ITEM(S) NOT SOLD!**__\nYou don't have enough ${item.emoji}__${item.name}(s)__!`).setColor('#fc0303'));
		}
		else if (temp) return sentMessage.edit(embed.setDescription(`__**ITEM(S) NOT SOLD!**__\n__${temp}__ is not a valid item.`).setColor('#fc0303'));
		else return sentMessage.edit(embed.setDescription('__**ITEM(S) NOT SOLD!**__\nYou didn\'t specify the item you want to use.').setColor('#fc0303'));
	},
};