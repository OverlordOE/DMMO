const Discord = require('discord.js');
module.exports = {
	name: 'changelog',
	summary: 'Shows the latest major update that the bot has received',
	description: 'Shows the latest major update that the bot has received.',
	category: 'info',
	aliases: ['update'],
	args: false,
	usage: '',

	execute(message, args, msgUser, client, logger) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Neia V2.4: Shields and music fix')
			.setFooter('To see earlier updates join the support server.', client.user.displayAvatarURL())
			.addField('Starting Off', `After some prep work i finally got shields to work again, for now they just protect you from some damage but more stats coming soone. I also fixed the music player and added some QoL features too it.
			\n`)


			.addField('**New Features**', `- You can finally get shields for your offhand slot. Shields protect you from damage by reducing it by their armor stat.
- Added 4 shields to buy/loot.
- The music player now shows the thumbnail of the video found
- The music player will now send a temporary message while it is searching youtube for videos.\n`)


			.addField('**Small Changes and Bug Fixes**', `- The music player is finally working again.
- \`equip\` no longer shows bot pfp.
- Fixed bug where unarmed attacks dont work.
- Changed invite link.
-Removed castle and stadium from epic chest.`);

		return message.channel.send(embed);
	},
};