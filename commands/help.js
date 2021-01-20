const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'List all the commands or get info about a specific command.',
	category: 'help',
	aliases: ['commands'],
	usage: '<command name>',
	args: false,

	execute(message, args, msgUser, client, logger) {
		const { commands } = message.client;
		let adminCommands = '';
		let musicCommands = '';
		let miscCommands = '';
		let pvpCommands = '';
		let economyCommands = '';
		let infoCommands = '';

		const help = new Discord.MessageEmbed()
			.setColor(client.characterCommands.getColour(msgUser))
			;

		if (!args.length) {
			help.setTitle('Neia command list');
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
					case 'pvp':
						pvpCommands += `**${command.name}** - ${command.summary}\n`;
						break;
					case 'economy':
						economyCommands += `**${command.name}** - ${command.summary}\n`;
						break;
					case 'info':
						infoCommands += `**${command.name}** - ${command.summary}\n`;
						break;
					default:
						break;
				}
			});


			help.setDescription(`__**Info Commands**__\n${infoCommands}\n
								__**PvP Commands**__\n${pvpCommands}\n
								__**Economy Commands**__\n${economyCommands}\n
								__**Miscellaneous Commands**__\n${miscCommands}\n
								__**Music Commands**__\n${musicCommands}\n
								__**Admin Commands**__\n${adminCommands}\n
								`)
				.addField('__**Help**__', '**You can send `help [command name]` to get info on a specific command!**')
				.addField('Helpfull Links', `[Click here to invite me to your server](https://discord.com/oauth2/authorize?client_id=684458276129079320&scope=bot&permissions=1178070081)\n
							 [Click here to join the support server](https://discord.gg/hFGxVDT)\n
							 [Click here to submit a bug or request  feature](https://github.com/OverlordOE/Neia/issues/new/choose)\n
							 For more info contact: OverlordOE#0717
			`);
		}
		else if (args[0] == 'viggo' || args[0] == 'virgil') message.reply('Vliegosaurus');
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
		}

		message.channel.send(help);
	},
};