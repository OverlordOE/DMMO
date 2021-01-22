const Sequelize = require('sequelize');
const Discord = require('discord.js');
const guildCommands = new Discord.Collection();
require('dotenv').config();

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const Guilds = sequelize.import('../models/Guilds');


// GUILDS
Reflect.defineProperty(guildCommands, 'newGuild', {
	value: async function newGuild(id) {
		const guild = await Guilds.create({
			guild_id: id,
			prefix: process.env.PREFIX,
		});
		guildCommands.set(id, guild);
		return guild;
	},
});

Reflect.defineProperty(guildCommands, 'getPrefix', {
	value: async function getPrefix(id) {
		let guild = guildCommands.get(id);
		if (!guild) guild = await guildCommands.newGuild(id);
		return guild ? guild.prefix : 0;
	},
});
Reflect.defineProperty(guildCommands, 'setPrefix', {
	value: async function setPrefix(id, newPrefix) {
		let guild = guildCommands.get(id);
		if (!guild) guild = await guildCommands.newGuild(id);

		guild.prefix = newPrefix;
		return guild.save();
	},
});

module.exports = { Guilds, guildCommands };