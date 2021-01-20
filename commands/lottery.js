const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
	name: 'lottery',
	category: 'debug',

	async execute(client, logger) {
		//	crontime: 0 0-23/3 * * *	collectortime: 10796250		channelID: 721743056528867393

		let writeData;
		const ticketAmount = 50;
		const buyin = 50;
		const misc = JSON.parse(fs.readFileSync('data/miscData.json'));
		const channel = client.channels.cache.get('721743056528867393');
		let lottery = misc.lastLottery;
		let duplicate = false;
		let players = 'Current participants:';
		const description = `Press 💰 to participate in the lottery!
							 Press 🔔 to get notified when the lottery ends.\n
							 **${buyin}**💰 buy-in.\n
							 `;
		const participants = [];
		const tickets = [];
		for (let i = 0; i < ticketAmount; i++) tickets[i] = i;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Lottery')
			.setDescription(`${description}\n
			Current jackpot: ${lottery}💰!
			`)
			.setFooter(`There are ${ticketAmount} tickets available`, client.user.displayAvatarURL());

		const filter = (reaction, user) => {
			return ['💰', '🔔'].includes(reaction.emoji.name) && !user.bot;
		};

		channel.send(embed)
			.then(sentMessage => {
				sentMessage.react('💰');
				sentMessage.react('🔔');

				const collector = sentMessage.createReactionCollector(filter, { time: 10796250 });

				collector.on('collect', async (r, user) => {

					if (r.emoji.name == '🔔') {
						const info = participants.findIndex(ticket => ticket.user.id == user.id);
						participants[info].notify = true;
						user.send(`You will be notified when the lottery will end\n\nThis lottery has a jackpot of ${client.util.formatNumber(lottery)}💰 \nYour ticket number is __${parseInt(participants[info].ticketNumber) + 1}__.`);
					}
					else if (r.emoji.name == '💰') {
						for (let i = 0; i < participants.length; i++) {
							if (user.id == participants[i].user.id) {
								duplicate = true;
								break;
							}
						}
						if (!duplicate) {
							const msgUser = await client.characterCommands.getUser(user.id);
							const bCheck = msgUser.balance;
							if (bCheck >= buyin) {
								const ticketNumber = tickets.splice(Math.floor(Math.random() * tickets.length), 1);
								const ticket = {
									user: user,
									ticketNumber: ticketNumber,
									notify: false,
								};
								participants.push(ticket);
								client.characterCommands.addMoney(msgUser, -buyin);
								players += `\n${parseInt(ticketNumber) + 1}: ${user}`;
								lottery = misc.lastLottery + (participants.length * buyin);
								sentMessage.edit(embed.setDescription(`${description}\n
								Current lottery: ${client.util.formatNumber(lottery)}💰
								${players}
								`));
							}
							else user.send(`You only have ${client.util.formatNumber(bCheck)}💰 but the buy-in is **${buyin}💰**.`);
						}
						duplicate = false;
					}
				});


				collector.on('end', async () => {

					const winNumber = Math.floor(Math.random() * ticketAmount);
					const winner = participants.find(ticket => ticket.ticketNumber == winNumber);

					if (winner) {
						client.characterCommands.addMoney(await client.characterCommands.getUser(winner.user.id), lottery);
						channel.send(`Congrats ${winner.user} on winning the jackpot of ${client.util.formatNumber(lottery)}💰!!!`);
						sentMessage.edit(embed.setDescription(`Current lottery: ${client.util.formatNumber(lottery)}💰\n${players}\n\nLottery has ended and the winning number is __${winNumber + 1}__\n*${winner.user}* has won the lottery of ${client.util.formatNumber(lottery)}💰`));
						misc.lastLottery = ticketAmount * 10;
					}

					for (let i = 0; i < participants.length; i++) {
						if (participants[i].notify) {
							if (winner) winner.user.send(`The lottery has ended\nYou have won the lottery with lucky number __**${winNumber + 1}**__ and won ${client.util.formatNumber(lottery)}💰!\n\nThe next jackpot will be ${ticketAmount}💰 and is starting in 1 minute`);
							else participants[i].user.send(`The lottery has ended\nThe winning number is __**${winNumber + 1}**__ but you had the number __${parseInt(participants[i].ticketNumber) + 1}__.\n\nThe next jackpot will be ${client.util.formatNumber(misc.lastLottery)}💰 and is starting in 1 minute`);

						}
					}

					if (!winner) {
						misc.lastLottery = lottery + ticketAmount * 10;
						sentMessage.edit(embed.setDescription(`Current lottery: ${client.util.formatNumber(lottery)}💰\n${players}\n\nLottery has ended and the winning number is __**${winNumber + 1}**__\n\nNoone won the lottery of ${client.util.formatNumber(lottery)}💰!`));
					}
					writeData = JSON.stringify(misc);
					fs.writeFileSync('data/miscData.json', writeData);
				});
			})
			.catch(e => {
				logger.error(e.stack);
				throw Error('something went wrong with the lottery');
			});
	},
};