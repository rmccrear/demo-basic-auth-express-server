require("dotenv").config();

const { Sequelize } = require("sequelize");
let sequelize;
if (process.env.NODE_ENV === "test") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL);
}

module.exports = sequelize;
