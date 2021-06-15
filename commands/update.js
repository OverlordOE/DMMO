module.exports = {
	name: 'Update',
	description: '',
	category: 'debug',
	aliases: [],
	args: false,
	usage: '',

	async execute(message, args, msgUser, msgGuild, client) {
		try {
			client.characterCommands.map(async (u) => {
				const user = await client.characterCommands.getUser(u.user_id);
				user.firstCommand = true;
				client.characterCommands.saveUser(user);
			});
		} catch (error) {
			return client.logger.error(error.stack);
		}
	},
};

