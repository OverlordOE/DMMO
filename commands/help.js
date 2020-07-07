const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'List all the commands or get info about a specific command.',
	category: 'help',
	aliases: ['commands'],
	usage: '<command name>',
	args: false,

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const { commands } = message.client;
		let adminCommands = '';
		let musicCommands = '';
		let miscCommands = '';
		let infoCommands = '';

		const help = new Discord.MessageEmbed()

			.setTimestamp();

		if (!args.length) {
			help.setTitle('DMMO command list');
			commands.map(command => {
				switch (command.category) {
					case 'admin':
						adminCommands += `**${command.name}** - ${command.summary}\n`;
						break;
					case 'music':
						musicCommands += `**${command.name}** - ${command.summary}\n`;
						break;
					case 'misc':
						miscCommands += `**${command.name}** - ${command.summary}\n`;
						break;
					case 'info':
						infoCommands += `**${command.name}** - ${command.summary}\n`;
						break;
					default:
						break;
				}
			});


			help.setDescription(`__**Info Commands**__\n${infoCommands}\n
								__**Miscellaneous Commands**__\n${miscCommands}\n
								__**Music Commands**__\n${musicCommands}\n
								__**Admin Commands**__\n${adminCommands}\n
								`)
				.addField('__**Help**__', '**You can send `help [command name]` to get info on a specific command!**')
				.addField('Helpfull Links', `[Click here to invite me to your server](https://discord.com/oauth2/authorize?client_id=684458276129079320&scope=client&permissions=372517968)\n
							 [Click here to join the support server](https://discord.gg/hFGxVDT)\n
							 [Click here to submit a bug or request  feature](https://github.com/OverlordOE/DMMO/issues/new/choose)\n
							 For more info contact: OverlordOE#0717
			`);
		}
		else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) {
				return message.reply('that\'s not a valid command!');
			}

			if (command.owner) { return message.channel.send('This command is for debug purposes'); }
			help.setTitle(command.name);

			if (command.description) help.addField('**Description:**', command.description);
			if (command.usage) help.addField('**Usage:**', `${command.name} ${command.usage}`);
			if (command.aliases) help.addField('**Aliases:**', command.aliases.join(', '));
			if (command.cooldown) {
				if (command.cooldown > 60) help.addField('**Cooldown:**', `${command.cooldown / 60} minutes`);
				else help.addField('**Cooldown:**', `${command.cooldown} seconds`);
			}

		}


		message.channel.send(help);
	},
};