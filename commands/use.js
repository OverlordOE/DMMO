const Discord = require('discord.js');
module.exports = {
	name: 'use',
	summary: 'Use an item from your inventory',
	description: 'Use an item from your inventory.',
	category: 'economy',
	aliases: ['item'],
	args: false,
	usage: '',

	execute(message, args, msgUser, client, logger) {
		const filter = m => m.author.id === msgUser;

		let amount = 1;
		let temp = '';
		let item;


		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Item Use')
			.setThumbnail(message.author.displayAvatarURL())
			.setDescription('What item do you want to use?')
			.setThumbnail(client.user.displayAvatarURL())
			.setColor(client.characterCommands.getColour(msgUser))
			.setFooter('Neia', client.user.displayAvatarURL());


		message.channel.send(embed).then(async sentMessage => {

			for (let i = 0; i < args.length; i++) {
				if (!(isNaN(args[i]))) amount = parseInt(args[i]);

				else if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = client.characterCommands.getItem(temp);
			if (item) {
				if (await client.characterCommands.hasItem(msgUser, item, amount)) use(client, sentMessage, amount, embed, item, msgUser);
				else return sentMessage.edit(embed.setDescription(`You don't have enough __${item.emoji}${item.name}(s)__!`));
			}
			else {

				message.channel.awaitMessages(filter, { max: 1, time: 60000 })
					.then(async collected => {
						item = client.characterCommands.getItem(collected.first().content);
						collected.first().delete();

						if (item) {

							sentMessage.edit(embed.setDescription(`How much __${item.name}__ do you want to use?`)).then(() => {
								message.channel.awaitMessages(filter, { max: 1, time: 60000 })
									.then(async collected => {

										amount = parseInt(collected.first().content);
										collected.first().delete();
										if (await client.characterCommands.hasItem(msgUser, item, amount)) use(client, sentMessage, amount, embed, item, msgUser);
										else return sentMessage.edit(embed.setDescription(`You don't have enough __${item.name}(s)__!`));

									}).catch(e => {
										logger.error(e.stack);
										throw Error('Something went wrong');
									});
							});
						}
						else { return sentMessage.edit(embed.setDescription(`${collected.first().content} is not an item.`)); }
					})
					.catch(e => {
						logger.error(e.stack);
						throw Error('Something went wrong');
					});
			}
		});
	},
};


async function use(client, sentMessage, amount, embed, item, msgUser) {

	if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`**${amount}** is not a number`));
	else if (amount < 1 || amount > 10000 || !amount) amount = 1;

	if (item.use) {
		const result = await item.use(client, amount, embed, item, msgUser);

		if (result.succes) {
			client.characterCommands.removeItem(msgUser, item, amount);
			return sentMessage.edit(embed.setDescription(result.message));
		}
		else if (result.message) return sentMessage.edit(embed.setDescription(result.message));
		else return sentMessage.edit(embed.setDescription('An error has occurred, please report this to OverlordOE#0717'));
	}

	else if (item.ctg == 'chest') return sentMessage.edit(embed.setDescription('Please use the `open` command to use a chest'));
	else if (item.ctg == 'equipment') return sentMessage.edit(embed.setDescription('Please use the `equip` command to use equipment'));
	else if (item.ctg == 'collectable') return sentMessage.edit(embed.setDescription('Collectables are passive items that will award you with extra money with your time based rewards.'));
	else return sentMessage.edit(embed.setDescription(`There is no use for __${item.name}__ yet, the item was not used.`));
}
