const Discord = require('discord.js');
const winston = require('winston');
const { Users, Guilds, character, guildProfile } = require('./dbObjects');
const clientCommands = require('./commands');
const moment = require('moment');
const client = new Discord.Client();
const cooldowns = new Discord.Collection();
require('dotenv').config();
const token = process.env.TEST_TOKEN;
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

client.commands = new Discord.Collection();
moment().format();


const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'MM-DD HH:mm:ss',
		}),
		winston.format.printf(log => `(${log.timestamp}) [${log.level.toUpperCase()}] - ${log.message}`),
		winston.format.colorize(),
	),

	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'error.log', level: 'warn' }),
		new winston.transports.File({ filename: 'log.log' }),
	],
});

Object.keys(clientCommands).map(key => {
	client.commands.set(clientCommands[key].name, clientCommands[key]);
});

client.login(token);
client.on('ready', async () => {
	try {
		const storedUsers = await Users.findAll();
		storedUsers.forEach(b => character.set(b.user_id, b));
		const storedGuilds = await Guilds.findAll();
		storedGuilds.forEach(b => guildProfile.set(b.guild_id, b));
		logger.log('info', `Logged in as ${client.user.tag}!`);
	}
	catch (e) {
		logger.error(e.stack);
	}
});

// Logger
client.on('warn', m => logger.warn(m.stack));
client.on('error', m => logger.error(m.stack));
process.on('unhandledRejection', m => logger.error(m.stack));
process.on('TypeError', m => logger.error(m.stack));
process.on('uncaughtException', m => logger.error(m.stack));


client.on('message', async message => {
	if (message.author.bot) return;

	let guild = guildProfile.get(message.guild.id);
	if (!guild) guild = await guildProfile.newGuild(message.guild.id);
	const prefix = await guildProfile.getPrefix(message.guild.id);
	const now = Date.now();
	const id = message.author.id;
	let user = character.get(id);
	if (!user) user = await character.newUser(id);


	// split message for further use
	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);
	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();


	// find command
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	if (command.category == 'debug' && (id != 137920111754346496 && id != 139030319784263681)) return message.channel.send('You are not the owner of this client!');
	if (command.category == 'admin' && !message.member.hasPermission('ADMINISTRATOR') && id != 137920111754346496 && id != 139030319784263681) return message.channel.send('You need Admin privileges to use this command!');


	// if the command is used wrongly correct the user
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}


	// cooldowns
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1.5) * 1000;

	if (timestamps.has(id)) {
		const expirationTime = timestamps.get(id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			const hourLeft = timeLeft / 3600;
			const minLeft = (hourLeft - Math.floor(hourLeft)) * 60;
			const secLeft = Math.floor((minLeft - Math.floor(minLeft)) * 60);
			if (hourLeft >= 1) return message.reply(`Please wait **${Math.floor(hourLeft)} hours**, **${Math.floor(minLeft)} minutes** and **${secLeft} seconds** before reusing the \`${command.name}\` command.`);
			else if (minLeft >= 1) return message.reply(`Please wait **${Math.floor(minLeft)} minutes** and **${secLeft} seconds** before reusing the \`${command.name}\` command.`);
			else return message.reply(`Please wait **${timeLeft.toFixed(1)} second(s)** before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(id, now);
	setTimeout(() => timestamps.delete(id), cooldownAmount);


	// execute command
	logger.log('info', `${message.author.tag} Called command: ${command.name}, in guild: ${message.guild.name}`);
	try {
		command.execute(message, args, user, character, guildProfile, client, logger, cooldowns);
	}
	catch (e) {
		logger.error(e.stack);
		message.reply('there was an error trying to execute that command!');
	}
});