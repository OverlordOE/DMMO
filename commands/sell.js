/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
const itemInfo = require('../data/items');
module.exports = {
	name: 'sell',
	summary: 'Sell items to get 80% of your money back',
	description: 'Sell items to get 80% of your money back.',
	aliases: ['refund'],
	category: 'money',
	args: false,
	usage: '',

	async execute(message, args, msgUser, character, guildProfile, client, logger, cooldowns) {

		const uitems = await character.getInventory(message.author.id);
		const filter = m => m.author.id === message.author.id;
		let amount = 0;
		let temp = '';
		let item;

		const embed = new Discord.MessageEmbed()
			.setTitle('DMMO Refunds')
			.setThumbnail(message.author.displayAvatarURL())
			.setDescription('What do you want to refund? `80% refund`')

			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		message.channel.send(embed).then(async sentMessage => {

			for (let i = 0; i < args.length; i++) {
				if (!(isNaN(args[i]))) amount = parseInt(args[i]);
				else if (args[i] == 'all') amount = 'all';
				else if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = await character.getItem(temp);
			if (item) {
				uitems.map(i => {
					if (i.name == item.name) {
						if (amount == 'all') {
							amount = i.amount;
							sell(character, sentMessage, amount, embed, item, message);
						}
						else if (i.amount >= amount) sell(character, sentMessage, amount, embed, item, message);
						else return sentMessage.edit(embed.setDescription(`You only have **${i.amount}/${amount}** of the __${item.name}(s)__ needed!`));
					}
				});
			}
			else {
				message.channel.awaitMessages(filter, { max: 1, time: 60000 })

					.then(async collected => {
						const item = await character.getItem(collected.first().content);
						if (!item) return sentMessage.edit(embed.setDescription(`\`${item}\` is not a valid item.`));

						let hasItem = false;
						collected.first().delete().catch(e => logger.error(e.stack));

						sentMessage.edit(embed.setDescription(`How much __${item.name}(s)__ do you want to sell?`)).then(() => {
							message.channel.awaitMessages(filter, { max: 1, time: 60000 })

								.then(async collected => {
									const amount = parseInt(collected.first().content);
									if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`${amount} is not a number!`));
									else if (amount < 1 || amount > 10000) return sentMessage.edit(embed.setDescription('Enter a number between 1 and 10000'));

									uitems.map(i => {
										if (i.name == item.name && i.amount >= amount) {
											hasItem = true;
										}
									});

									if (!hasItem) {
										return sentMessage.edit(embed.setDescription(`You don't have enough __${item.name}(s)__!`));
									}

									sell(character, sentMessage, amount, embed, item, message);

								})
								.catch(e => {
									logger.error(e.stack);
									message.reply('you didn\'t answer in time.');
								});
						});
					})
					.catch(e => {
						logger.error(e.stack);
						message.reply('you didn\'t answer in time.');
					});
			}
		});
	},
};


async function sell(character, sentMessage, amount, embed, item, message) {

	if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`**${amount}** is not a number`));
	else if (amount < 1) amount = 1;

	const refundAmount = 0.8 * item.cost * amount;
	await character.removeItem(message.author.id, item, amount);
	await character.addMoney(message.author.id, refundAmount);

	const balance = await character.getBalance(message.author.id);
	sentMessage.edit(embed.setDescription(`You've refunded ${amount} __${item.name}(s)__ and received **${Math.floor(refundAmount)}💰** back.\nYour balance is **${balance}💰**!`));
}