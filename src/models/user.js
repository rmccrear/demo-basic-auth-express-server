const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
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

Users.addHook("beforeCreate", async (user, options) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  user.password = passwordHash;
});

module.exports = Users;
