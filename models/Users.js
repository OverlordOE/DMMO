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