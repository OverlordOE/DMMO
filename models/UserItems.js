module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_item', {
		user_id: DataTypes.STRING,
		base: DataTypes.JSON,
		name: DataTypes.STRING,
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
	}, {
		timestamps: false,
	});
};