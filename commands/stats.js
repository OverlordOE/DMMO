const Discord = require('discord.js');
module.exports = {
	name: 'Stats',
	summary: 'Shows how much servers and users use Project Neia',
	description: 'Shows how much servers and users use Project Neia.',
	category: 'misc',
	aliases: ['stat', 'server', 'members'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, msgGuild, client, logger) {

		const embed = new Discord.MessageEmbed()
			.setTitle('Project Neia Stats')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(client.characterCommands.getColour(msgUser))
			.setFooter('Project Neia', client.user.displayAvatarURL());

		let guildTotal = 0;
		let memberTotal = 0;
		client.guilds.cache.forEach(guild => {
			guildTotal++;
			if (!isNaN(memberTotal) && guild.id != 264445053596991498) memberTotal += Number(guild.memberCount);
		});
		message.channel.send(embed.setDescription(`Project Neia is in **${guildTotal}** servers with a total of **${memberTotal}** users.`));
		client.user.setActivity(`with ${memberTotal} users.`);
	},
};