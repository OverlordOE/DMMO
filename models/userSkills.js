module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_skill', {
		user_id: DataTypes.STRING,
		name: DataTypes.STRING,
	}, {
		timestamps: false,
	});
};