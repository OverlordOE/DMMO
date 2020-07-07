module.exports = {
	name: 'reload',
	description: '"Admin debug tool" Reloads a command.',
	usage: '<command>',
	aliases: ['r', 're'],
	category: 'debug',
	args: true,
	cooldown: 0,


	execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
		}
		catch (e) {
			logger.error(e.stack);
			return message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${e.message}\``);
		}
		message.channel.send(`Command \`${command.name}\` was reloaded!`);
	},
};