const Discord = require('discord.js');
module.exports = {
	name: 'leaderboard',
	summary: 'Shows global leaderboard',
	description: 'Shows global leaderboard.',
	category: 'info',
	aliases: ['lead', 'top', 'ranking'],
	args: false,
	usage: '<page>',

	execute(message, args, msgUser, client, logger) {

		const filter = (reaction, user) => { return ['◀️', '▶️', '🔀'].includes(reaction.emoji.name) && user.id === message.author.id; };

		const networthList = client.characterCommands.sort((a, b) => b.networth - a.networth)
			.filter(user => client.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}**.__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(user.networth)}💰`);

		const totalList = client.characterCommands.sort((a, b) => b.totalEarned - a.totalEarned)
			.filter(user => client.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}**.__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(user.totalEarned)}💰`);

		const balanceList = client.characterCommands.sort((a, b) => b.balance - a.balance)
			.filter(user => client.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}.**__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(user.balance)}💰`);


		let currentList = networthList;
		let description = 'Total Earned\n';
		let page = 0;
		if (!isNaN(args[0]) && args[0] > 0 && args[0] < 6) page = args[0] - 1;


		const embed = new Discord.MessageEmbed()
			.setTitle('Neia leaderboard')
			.setDescription(editDescription(currentList, page, ' Net Worth \n'))
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter('Use the emojis to scroll through the list or switch the list.', client.user.displayAvatarURL());


		message.channel.send(embed).then(sentMessage => {
			sentMessage.react('◀️');
			sentMessage.react('▶️');
			sentMessage.react('🔀');

			const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

			collector.on('collect', (reaction) => {
				reaction.users.remove(message.author.id);
				if (reaction.emoji.name == '◀️' && page > 0) {
					page--;
					sentMessage.edit(embed.setDescription(editDescription(currentList, page, description)));
				}
				else if (reaction.emoji.name == '▶️' && page < 4) {
					page++;
					sentMessage.edit(embed.setDescription(editDescription(currentList, page, description)));
				}
				else if (reaction.emoji.name == '🔀') {
					if (currentList == networthList) {
						currentList = balanceList;
						description = 'Current Balance\n';
					}
					else if (currentList == balanceList) {
						currentList = totalList;
						description = 'Total Earned\n';
					}
					else {
						currentList = networthList;
						description = 'Net Worth\n';
					}
					sentMessage.edit(embed.setDescription(editDescription(currentList, page, description)));
				}
			});
			collector.on('end', () => sentMessage.reactions.removeAll());
		});
	},
};

function editDescription(currentList, page, description) {
	for (let i = page * 10; i < (10 + page * 10); i++) {
		if (currentList[i]) description += currentList[i];
		else description += `\n__${i + 1}.__ noone`;
	}
	return description;
}