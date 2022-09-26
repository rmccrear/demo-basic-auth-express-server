require("dotenv").config();

const sequelize = require("./db");

const PORT = process.env.PORT;

const sequelize = require("sequelize");
const app = require("./app");

// make sure our tables are created, start up the HTTP server.
sequelize
  .sync()
  .then(() => {
    app.listen(PORT || 3000, () => console.log("server up"));
  })
  .catch((e) => {
    console.error("Could not start server", e.message);
  });
