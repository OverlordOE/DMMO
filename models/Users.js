const moment = require('moment');
const now = moment();
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},

		info: {
			type: DataTypes.JSON,
			defaultValue: JSON.stringify({
				balance: 0,
				totalEarned: 0,
				networth: 0,
				level: 1,
				exp: 0,
				class: null,
				equipment: { weapon: null, offhand: null },
				baseStats: null,
				stats: null,
				lastDaily: now.subtract(2, 'd').toString(),
				lastHourly: now.subtract(1, 'd').toString(),
				lastVote: now.subtract(1, 'd').toString(),
				firstCommand: true,
			}),
			allowNull: false,
		},
	},
		{
			timestamps: false,
		});
};