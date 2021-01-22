const Discord = require('discord.js');
module.exports = {
	name: 'invite',
	summary: 'Sends a bunch of helpfull links',
	description: 'Sends links to invite the client to your own server, to join the support server and to request a feature or report a bug.',
	category: 'misc',
	args: false,
	usage: '',
	aliases: ['inv', 'bug', 'join', 'support', 'link'],

	execute(message, args, msgUser, client, logger) {

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Invites')
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription(`
							[Click here to invite me to your server](https://discord.com/oauth2/authorize?client_id=684458276129079320&scope=bot&permissions=1178070081)\n
							[Click here to join the support server](https://discord.gg/hFGxVDT)\n
							[Click here to submit a bug or request  feature](https://github.com/OverlordOE/Neia/issues/new/choose)\n
							For more info contact: OverlordOE#0717
			`);
		message.channel.send(embed);
	},
};
// https://discord.gg/hFGxVDT
//https://discord.com/oauth2/authorize?client_id=684458276129079320&scope=bot&permissions=1178070081