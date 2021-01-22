/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
module.exports = {
	name: 'trade',
	summary: 'Trade money or items to other people',
	description: 'Trade money and items to other people.',
	aliases: ['give', 'donate', 'transfer'],
	category: 'economy',
	args: false,
	usage: '',

	execute(message, args, msgUser, client, logger) {

		const filter = m => m.author.id === msgUser;
		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Trading Center')
			.setColor(client.characterCommands.getColour(msgUser))
			.setFooter('You can only trade to people on the same server.', client.user.displayAvatarURL());


		message.channel.send(embed)
			.then(async sentMessage => {
				let target;
				let amount = 0;
				let temp = '';

				for (let i = 0; i < args.length; i++) {
					if (!(isNaN(args[i]))) amount = parseInt(args[i]);

					else if (args[i].startsWith('<@') && args[i].endsWith('>')) {
						let mention = args[i].slice(2, -1);
						if (mention.startsWith('!')) mention = mention.slice(1);
						target = client.users.cache.get(mention);
						embed.setThumbnail(target.displayAvatarURL());
					}

					else if (temp.length > 2) { temp += ` ${args[i]}`; }
					else { temp += `${args[i]}`; }
				}

				const item = client.characterCommands.getItem(temp);
				if (target && item) { itemTrade(client, target, amount, item, sentMessage, embed, msgUser); }
				else if (target && amount > 1) { moneyTrade(client, target, amount, sentMessage, embed, msgUser); }
				else {
					sentMessage.edit(embed.setDescription('Who do you want to trade with? __mention the user__\n'));
					message.channel.awaitMessages(filter, { max: 1, time: 60000 })

						.then(async collected => {
							let mention = collected.first().content;
							collected.first().delete();

							if (mention.startsWith('<@') && mention.endsWith('>')) {
								mention = mention.slice(2, -1);
								if (mention.startsWith('!')) mention = mention.slice(1);
								target = client.users.cache.get(mention);
								embed.setThumbnail(target.displayAvatarURL());
							}
							else { return sentMessage.edit(embed.setDescription(`${mention} is not a valid response`)); }


							sentMessage.edit(embed.setDescription(`Trading with *${target}*\n\nWhat do you want to send (answer with a number to send money)?`))
								.then(() => {
									message.channel.awaitMessages(filter, { max: 1, time: 60000 })

										.then(collected => {
											const goods = collected.first().content.toLowerCase();
											collected.first().delete();

											// item trade
											if (isNaN(goods)) {

												const item = client.characterCommands.getItem(goods);
												if (!item) return sentMessage.edit(embed.setDescription(`${item} doesn't exist.`));

												// item trade
												sentMessage.edit(embed.setDescription(`Trading with *${target}*\n\nHow much __${item.name}(s)__ do you want to send?`)).then(() => {
													message.channel.awaitMessages(filter, { max: 1, time: 60000 })

														.then(async collected => {
															const amount = collected.first().content;
															collected.first().delete();

															if (await client.characterCommands.hasItem(msgUser, item, amount)) itemTrade(client, target, amount, item, sentMessage, embed, msgUser);
															else return sentMessage.edit(embed.setDescription(`You don't have enough __${item.name}(s)__!`));
														})
														.catch(e => {
															logger.error(e.stack);
															message.reply('you didn\'t answer in time.');
														});
												});
											}
											else { moneyTrade(client, target, amount, sentMessage, embed, msgUser); }
										})
										.catch(e => {
											logger.error(e.stack);
											message.reply('you didn\'t answer in time.');
										});
								})
								.catch(e => {
									logger.error(e.stack);
									message.reply('you didn\'t answer in time.');
								});
						});
				}
			});
	},
};

async function itemTrade(client, target, amount, item, sentMessage, embed, msgUser) {
	if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`${amount} is not a number`));
	else if (amount < 1) amount = 1;

	client.characterCommands.addItem(await client.characterCommands.getUser(target.id), item, amount);
	client.characterCommands.removeItem(msgUser, item, amount);
	sentMessage.edit(embed.setDescription(`Trade with *${target}* succesfull!\n\nTraded ${amount} ${item.emoji}__${item.name}__ to *${target}*.`));
}

async function moneyTrade(client, target, amount, sentMessage, embed, msgUser) {
	if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`${amount} is not a number`));
	else if (amount < 1) amount = 1;

	let balance = msgUser.balance;

	if (!amount || isNaN(amount)) return sentMessage.edit(embed.setDescription(`${amount} is an invalid amount.`));
	if (amount > balance) return sentMessage.edit(embed.setDescription(`You only have ${client.util.formatNumber(balance)}💰 but need ${client.util.formatNumber(amount)}.`));
	if (amount <= 0) return sentMessage.edit(embed.setDescription('Please enter an amount greater than zero.'));

	client.characterCommands.addMoney(msgUser, -amount);
	balance = client.characterCommands.addMoney(await client.characterCommands.getUser(target.id), amount);
	return sentMessage.edit(embed.setDescription(`Trade with *${target}* succesfull!\n\nTransferred ${client.util.formatNumber(amount)}💰 to *${target}*.\nYour current balance is ${client.util.formatNumber(balance)}💰`));

}