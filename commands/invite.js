const Discord = require('discord.js');
module.exports = {
	name: 'invite',
	summary: 'Sends a bunch of helpfull links',
	description: 'Sends links to invite the client to your own server, to join the support server and to request a feature or report a bug.',
	category: 'misc',
	args: false,
	usage: '',
	aliases: ['inv', 'bug', 'join', 'support', 'link'],

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const embed = new Discord.MessageEmbed()
			.setTitle('DMMO Invites')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL())
			.setDescription(`[Click here to invite me to your server](https://discord.com/oauth2/authorize?client_id=684458276129079320&scope=client&permissions=372517968)\n
							 [Click here to join the support server](https://discord.gg/hFGxVDT)\n
							 [Click here to submit a bug or request  feature](https://github.com/OverlordOE/DMMO/issues/new/choose)\n
							 For more info contact: OverlordOE#0717
			`);
		message.channel.send(embed);
	},
};
// https://discord.gg/hFGxVDT
// https://discord.com/oauth2/authorize?client_id=684458276129079320&scope=client&permissions=372517968