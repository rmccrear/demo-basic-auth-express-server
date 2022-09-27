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

Users.authenticateBasic = async (username, password) => {
  try {
    const user = await Users.findOne({ where: { username: username } });
    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
          return user;
      }
    }
  } catch (e) {
      console.log(e);
      return false;
  }
  return false;
}

module.exports = Users;
