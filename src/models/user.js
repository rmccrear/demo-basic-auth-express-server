const { DataTypes } = require("sequelize");
const sequelize = require("../../db");
// Create a Sequelize model
const Users = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Users;
