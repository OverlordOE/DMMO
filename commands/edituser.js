module.exports = {
	name: 'Edituser',
	description: 'Edits target user.',
	category: 'debug',
	args: true,
	aliases: ['eu', 'edit'],
	usage: '<user> <field> <value>',


	async execute(message, args, msgUser, msgGuild, client, logger) {
		const id = message.mentions.users.first().id;
		const target = await client.characterCommands.getUser(id);
	
		try {
			if (args[1] == 'reset') {
			
				const succes = await client.characterCommands.deleteUser(id);
				if (succes) return message.reply('Reset succesfull.');
				else return message.reply('Reset not succesfull!');
			}
			target[args[1]] = Number(args[2]);
			await client.characterCommands.saveUser(target);
		}
		catch (e) {
			message.reply('something went wrong');
			return logger.error(e.stack);
		}
		message.reply('Edit succesfull');
	},
};