module.exports = {
	name: 'delete',
	summary: 'Delete messages in bulk',
	description: 'Delete up too 100 messages in bulk.',
	category: 'admin',
	aliases: ['remove'],
	args: false,
	usage: '<message amount>',
	execute(message, args, msgUser, client, logger) {

		const amount = args[0];
		if (isNaN(amount)) return message.channel.send(`**${amount}** is not a valid number`);
		if (amount < 1 || amount > 100) return message.channel.send('Input a number between 1 and 100');

		try {
			message.delete();
			message.channel.bulkDelete(amount);
			logger.log('info', `*${message.author.tag}* deleted **${amount}** messages in channel ${message.channel.name}`);
		}
		catch (error) {
			logger.error(error.stack);
			throw Error('Something went wrong');
		}
	},
};
