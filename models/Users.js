module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},

		// MONEY
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		totalEarned: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		networth: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},

		// CHARACTER
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		exp: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		class: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true,
		},
		equipment: {
			type: DataTypes.JSON,
			defaultValue: null,
			allowNull: true,
		},
		baseStats: {
			type: DataTypes.JSON,
			defaultValue: null,
			allowNull: true,
		},
		stats: {
			type: DataTypes.JSON,
			defaultValue: null,
			allowNull: true,
		},


		// COOLDOWNS
		lastDaily: {
			type: DataTypes.STRING,
			defaultValue: '',
			allowNull: false,
		},
		lastHourly: {
			type: DataTypes.STRING,
			defaultValue: '',
			allowNull: false,
		},
		lastVote: {
			type: DataTypes.STRING,
			defaultValue: '',
			allowNull: false,
		},


		// MISC
		firstCommand: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
		{
			timestamps: false,
		});
};