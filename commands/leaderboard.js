const Discord = require('discord.js');
module.exports = {
	name: 'leaderboard',
	summary: 'Shows global leaderboard',
	description: 'Shows global leaderboard.',
	category: 'info',
	aliases: ['lead', 'top', 'ranking'],
	args: false,
	usage: '<page>',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const filter = (reaction, user) => {
			return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		const list = profile.sort((a, b) => b.balance - a.balance)
			.filter(user => client.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}.**__ *${client.users.cache.get(user.user_id).tag}*: **${Math.floor(user.balance)}💰**`);

		let page = 0;
		if (!isNaN(args[0]) && args[0] > 0 && args[0] < 6) page = args[0] - 1;

		const description = editDescription(list, page);

		const embed = new Discord.MessageEmbed()
			.setTitle('DMMO leaderboard')
			.setDescription(description)
			.setThumbnail(client.user.displayAvatarURL())

			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		message.channel.send(embed).then(sentMessage => {
			sentMessage.react('◀️');
			sentMessage.react('▶️');
			const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

			collector.on('collect', (reaction) => {
				reaction.users.remove(message.author.id);
				if (reaction.emoji.name == '◀️') {
					if (page > 0) {
						page--;
						sentMessage.edit(embed.setDescription(editDescription(list, page)));
					}
				}
				else if (reaction.emoji.name == '▶️') {
					if (page < 4) {
						page++;
						sentMessage.edit(embed.setDescription(editDescription(list, page)));
					}
				}
			});
			collector.on('end', () => sentMessage.reactions.removeAll());
		});
	},
};

function editDescription(list, page) {
	let description = '';
	for (let i = page * 10; i < (10 + page * 10); i++) {
		if (list[i]) description += list[i];
		else description += `\n__**${i + 1}.**__ noone`;
	}
	return description;
}