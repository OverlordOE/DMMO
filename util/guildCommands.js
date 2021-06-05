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
const Guilds = require('../models/Guilds')(sequelize, Sequelize);


// GUILDS
Reflect.defineProperty(guildCommands, 'newGuild', {
	value: async function newGuild(id) {
		const guild = await Guilds.create({
			guild_id: id,
		});
		guildCommands.set(id, guild);
		return guild;
	},
});


Reflect.defineProperty(guildCommands, 'getGuild', {
	value: async function getGuild(id) {
		let guild = guildCommands.get(id);
		if (!guild) guild = await guildCommands.newGuild(id);
		return guild;
	},
});


Reflect.defineProperty(guildCommands, 'getPrefix', {
	value: function getPrefix(guild) {
		return guild ? guild.prefix : 0;
	},
});
Reflect.defineProperty(guildCommands, 'setPrefix', {
	value: function setPrefix(guild, newPrefix) {
		guild.prefix = newPrefix;
		return guild.save();
	},
});


module.exports = { Guilds, guildCommands };