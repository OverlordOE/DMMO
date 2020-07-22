module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},

		// character info
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
			type: DataTypes.JSON, 
			defaultValue: null,
			allowNull: true,
		},

		// equipment and skills
		equipment: {
			type: DataTypes.JSON,
			defaultValue: null,
			allowNull: true,
		},
		skills: {
			type: DataTypes.JSON,
			defaultValue: null,
			allowNull: true,
		},
		
		// stats
		baseStats: DataTypes.JSON,
		stats: DataTypes.JSON,
		curHP: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		curMP: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},

		// cooldowns
		lastDaily: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		lastHourly: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		lastWeekly: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		hasVoted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},

	},
		{
			timestamps: false,
		});
};