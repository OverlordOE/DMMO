const Discord = require('discord.js');
const util = new Discord.Collection();


Reflect.defineProperty(util, 'formatNumber', {
/**
* Formats the given number to a compressed version with si symbols
* @param {number} number - The number that needs to be formatted.
*/
	value: function formatNumber(number) {
		const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
		const tier = Math.log10(number) / 3 | 0;

		if (tier == 0) return `**${Math.floor(number)}**`;

		const suffix = SI_SYMBOL[tier];
		const scale = Math.pow(10, tier * 3);

		const scaled = number / scale;
		return `**${scaled.toFixed(2) + suffix}**`;
	},
});


module.exports = { util };