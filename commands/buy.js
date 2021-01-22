const Discord = require('discord.js');
module.exports = {
	name: 'buy',
	summary: 'Buy an item from the shop',
	description: 'With this you can buy an item from the shop.\nYou can either use `buy <item> <amount> to instantly buy the items or just use `buy`.\nIf you use the latter you will get prompted to enter the name and amount of the item that you want into the chat.',
	category: 'economy',
	aliases: ['get'],
	usage: '<item> <amount>',

	args: false,

	execute(message, args, msgUser, client, logger) {

		const filter = m => m.author.id === message.author.id;
		let amount = 0;
		let temp = '';
		let item;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Shop')
			.setThumbnail(message.author.displayAvatarURL());

		message.channel.send(embed).then(sentMessage => {

			for (let i = 0; i < args.length; i++) {
				if (!(isNaN(args[i]))) amount = parseInt(args[i]);

				else if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = client.characterCommands.getItem(temp);
			if (item.buyable) buy(client, sentMessage, amount, embed, item, msgUser);
			else if (item) sentMessage.edit(embed.setDescription('You can\'t buy this item?'));

			else {
				sentMessage.edit(embed.setDescription('What item do you want to buy?'));
				message.channel.awaitMessages(filter, { max: 1, time: 60000 })

					.then(collected => {
						item = client.characterCommands.getItem(collected.first().content);

						if (item && !item.buyable) return sentMessage.edit(embed.setDescription('You can\'t buy this item?'));
						else if (!item) return sentMessage.edit(embed.setDescription(`${collected.first().content} is not a valid item.`));
						collected.first().delete();

						sentMessage.edit(embed.setDescription(`How many __${item.name}(s)__ do you want to buy?`)).then(() => {
							message.channel.awaitMessages(filter, { max: 1, time: 60000 })

								.then(collected => {
									amount = parseInt(collected.first().content);
									collected.first().delete();
									buy(client, sentMessage, amount, embed, item, msgUser);
								})
								.catch(e => {
									logger.error(e.stack);
									throw Error('Something went wrong');
								});
						});
					});
			}
		})
			.catch(e => {
				logger.error(e.stack);
				throw Error('Something went wrong');
			});
	},
};

function buy(client, sentMessage, amount, embed, item, msgUser) {

	if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`${amount} is not a number`));
	else if (amount < 1) amount = 1;

	let balance = msgUser.balance;
	const cost = amount * item.value;
	if (cost > balance) return sentMessage.edit(embed.setDescription(`
	You currently have ${client.util.formatNumber(balance)}💰 but __${client.util.formatNumber(amount)}__ ${item.emoji}${item.name}(s) costs ${client.util.formatNumber(cost)}💰!
	You need ${client.util.formatNumber(cost - balance)}💰 more
	`));

	client.characterCommands.addItem(msgUser, item, amount);
	balance = client.characterCommands.addMoney(msgUser, -cost);

	sentMessage.edit(embed.setDescription(`You've bought: __${client.util.formatNumber(amount)}__ ${item.emoji}__${item.name}(s)__.\n\nCurrent balance is ${client.util.formatNumber(balance)}💰.`));
}