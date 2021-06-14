/* eslint-disable no-multiple-empty-lines */
const Discord = require('discord.js');
const winston = require('winston');
const moment = require('moment');
const cron = require('cron');
const fs = require('fs');
// const DBL = require('dblapi.js');
// const dbl = new DBL(process.env.DBL_TOKEN, { webhookPort: 3000, webhookAuth: process.env.WEBHOOK_TOKEN });
const Topgg = require('@top-gg/sdk');
const express = require('express');
const { Users, characterCommands } = require('./util/characterCommands');
const { guildCommands, Guilds } = require('./util/guildCommands');
const { util } = require('./util/util');
const client = new Discord.Client();
const cooldowns = new Discord.Collection();
const active = new Map();
client.music = { active: active };
client.commands = new Discord.Collection();
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
require('dotenv').config();
moment().format();


// Logger
const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.errors({ stack: true }),
		winston.format.timestamp({ format: 'MM-DD HH:mm:ss' }),
		winston.format.printf(log => {
			if (log.stack && log.level == 'error') return `${log.timestamp}) [${log.level}] - ${log.message}\n${log.stack}`;
			return `${log.timestamp}) [${log.level}] - ${log.message}`;
		}),
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.colorize({
				all: true,
				colors: {
					error: 'red',
					info: 'cyan',
					warn: 'yellow',
					debug: 'green',
				},
			}),
		}),
		new winston.transports.File({
			filename: './logs/error.log',
			level: 'warn',
		}),
		new winston.transports.File({ filename: './logs/log.log' }),
	],
});
client.on('warn', e => logger.warn(e));
client.on('error', e => logger.error(e));
process.on('warning', e => logger.warn(e));
process.on('unhandledRejection', e => logger.error(e));
process.on('TypeError', e => logger.error(e));
process.on('uncaughtException', e => logger.error(e));


// Load in Commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name.toLowerCase(), command);
}


// Startup Tasks

client.login(process.env.TOKEN);
client.on('ready', async () => {
	try {
		const storedUsers = await Users.findAll();
		storedUsers.forEach(b => characterCommands.set(b.user_id, b));
		const storedGuilds = await Guilds.findAll();
		storedGuilds.forEach(b => guildCommands.set(b.guild_id, b));
		let memberTotal = 0;
		client.guilds.cache.forEach(g => { if (!isNaN(memberTotal) && g.id != 264445053596991498) memberTotal += Number(g.memberCount); });
		client.user.setActivity(`with ${memberTotal} users.`);

		client.characterCommands = characterCommands;
		client.guildCommands = guildCommands;
		client.util = util;

		logger.info(`Logged in as ${client.user.tag}!`);
	}
	catch (e) {
		logger.error(e.stack);
	}
});







// Command handler
client.on('message', async message => {

	if (message.author.bot || message.channel == 'dm') return;

	const guild = await guildCommands.getGuild(message.guild.id);
	const prefix = guildCommands.getPrefix(guild);
	const id = message.author.id;
	const user = await characterCommands.getUser(id);


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
	if (command.category == 'debug' && (id != 137920111754346496)) return message.channel.send('You are not the owner of this bot!');
	if (command.permissions) if (!message.guild.member(message.author).hasPermission(command.permissions)) return message.reply(`you need the ${command.permissions} permission to use this command!`);


	// if the command is used wrongly correct the user
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		return message.channel.send(reply);
	}


	// cooldowns
	if (id != 137920111754346496) {
		if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = 1500;
		const now = Date.now();

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
	}

	if (user.firstCommand) {
		client.commands.get('changelog').execute(message, args, user, guild, client, logger);
		user.firstCommand = false;
		logger.info(`New user ${message.author.tag}`);
		client.characterCommands.saveUser(user);
	}

	// Chech for manage message permission
	if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) {
		logger.warn(`Project Neia doesnt have MANAGE_MESSAGES permissions on guild ${guild.name}`);
		message.reply('Please make sure Project Neia has the `Manage Messages` permissions, otherwise the commands may not function properly');
	}


	// Execute command
	logger.log('info', `${message.author.tag} Called command: ${commandName} ${args.join(' ')}, in guild: ${message.guild.name}`);
	try {
		command.execute(message, args, user, guild, client, logger);
	}
	catch (e) {
		logger.error(e.stack);
		message.reply('there was an error trying to execute that command!');
	}
});










// Regular tasks executed every hour
const botTasks = new cron.CronJob('0 * * * *', () => {
	let memberTotal = 0;
	client.guilds.cache.forEach(guild => { if (!isNaN(memberTotal) && guild.id != 264445053596991498) memberTotal += Number(guild.memberCount); });
	client.user.setActivity(`with ${memberTotal} users.`);

	logger.info('Finished regular tasks!');
});
botTasks.start();