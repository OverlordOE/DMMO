module.exports = {
	name: 'update',
	description: '',
	category: 'debug',
	aliases: [],
	args: false,
	usage: '',

	async execute(message, args, msgUser, client, logger) {
		try {
			client.characterCommands.map(async (u) => {
				const user = await client.characterCommands.getUser(u.user_id);
				user.firstCommand = true;
				user.save();
			});
		} catch (error) {
			return logger.error(error.stack);
		}
	},
};

