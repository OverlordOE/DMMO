const Discord = require('discord.js');
module.exports = {
	name: 'use',
	summary: 'Use an item from your inventory',
	description: 'Use an item from your inventory.',
	category: 'misc',
	aliases: ['item'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, character, guildProfile, client, logger, cooldowns) {
		const uitems = await character.getInventory(message.author.id);
		const filter = m => m.author.id === message.author.id;

		let iAmount = 0;
		let amount = 0;
		let temp = '';
		let item;


		const embed = new Discord.MessageEmbed()
			.setTitle('DMMO Item Use')
			.setThumbnail(message.author.displayAvatarURL())
			.setDescription('What item do you want to use?')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());


		message.channel.send(embed).then(async sentMessage => {

			for (let i = 0; i < args.length; i++) {
				if (!(isNaN(args[i]))) amount = parseInt(args[i]);

				else if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = await character.getItem(temp);
			if (item) {
				uitems.map(i => {
					if (i.name == item.name) {
						if (i.amount >= amount) use(character, sentMessage, amount, embed, item, msgUser);
						else return sentMessage.edit(embed.setDescription(`You only have **${i.amount}/${amount}** of the __${item.name}(s)__ needed!`));
					}
					else return sentMessage.edit(embed.setDescription(`You don't have any __${item.name}(s)__!`));
				});
			}
			else {

				message.channel.awaitMessages(filter, { max: 1, time: 60000 })
					.then(async collected => {
						item = await character.getItem(collected.first().content);
						collected.first().delete().catch(e => logger.error(e.stack));

						if (item) {
							uitems.map(i => {
								if (i.name == item.name && i.amount >= 1) {
									iAmount = i.amount;
								}
							});

							sentMessage.edit(embed.setDescription(`How much __${item.name}__ do you want to use?`)).then(() => {
								message.channel.awaitMessages(filter, { max: 1, time: 60000 })
									.then(async collected => {

										amount = parseInt(collected.first().content);
										collected.first().delete().catch(e => logger.error(e.stack));
										if (iAmount >= amount) use(character, sentMessage, amount, embed, item, msgUser);
										else return sentMessage.edit(embed.setDescription(`You only have **${iAmount}/${amount}** of the __${item.name}(s)__ needed!`));

									}).catch(e => {
										logger.error(e.stack);
										message.reply('you didn\'t answer in time or something went wrong.');
									});
							});
						}
						else return sentMessage.edit(embed.setDescription(`${collected.first().content} is not an item.`));
					})
					.catch(e => {
						logger.error(e.stack);
						message.reply('you didn\'t answer in time or something went wrong.');
					});
			}
		});
	},
};


async function use(character, sentMessage, amount, embed, item, msgUser) {
	console.log(amount);
	if (!Number.isInteger(amount)) {
		return sentMessage.edit(embed.setDescription(`**${amount}** is not a number`));
	}
	else if (amount < 1 || amount > 10000) {
		amount = 1;
	}

	switch (item.type[0]) {

		case 'consumable':
			if (item.use) {
				const consume = item.use(msgUser);
				if (consume.succes) {
					character.removeItem(msgUser.user_id, item, amount);
					return sentMessage.edit(embed.setDescription(consume.message));
				}
				else return sentMessage.edit(embed.setDescription(consume.message));
			}
			else return sentMessage.edit(embed.setDescription(`There is no use for __${item.name}(s)__ yet, the item was not used.`));

		default: {
			return sentMessage.edit(embed.setDescription(`There is no use for __${item.name}(s)__ yet, the item was not used.`));
		}
	}
}