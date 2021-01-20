const Discord = require('discord.js');
module.exports = {
	name: 'stats',
	summary: 'Shows how much servers and users use Neia',
	description: 'Shows how much servers and users use Neia.',
	category: 'misc',
	aliases: ['stat', 'server', 'members'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, client, logger) {

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Stats')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(client.characterCommands.getColour(msgUser))
			.setFooter('Neia', client.user.displayAvatarURL());

		let guildTotal = 0;
		let memberTotal = 0;
		client.guilds.cache.forEach(guild => {
			guildTotal++;
			if (!isNaN(memberTotal) && guild.id != 264445053596991498) memberTotal += Number(guild.memberCount);
		});
		message.channel.send(embed.setDescription(`Neia is in **${guildTotal}** servers with a total of **${memberTotal}** users.`));
		client.user.setActivity(`with ${memberTotal} users.`);
	},
};