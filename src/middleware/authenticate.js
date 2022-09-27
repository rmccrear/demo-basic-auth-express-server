const bcrypt = require("bcrypt");
const base64 = require("base-64");

const sequelize = require("../../db.js");
const Users = require("../models/user");

async function authenticate(req, res, next) {
  /*
    req.headers.authorization is : "Basic sdkjdsljd="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */
  if (!req.headers.authorization) {
    next("Invalid User");
    return;
  }
  let basicHeaderParts = req.headers.authorization.split(" "); // ['Basic', 'sdkjdsljd=']
  let encodedString = basicHeaderParts.pop(); // sdkjdsljd= //?
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(":"); // username, password //?

  /*
    Now that we finally have username and password, let's see if it's valid
    1. Find the user in the database by username
    2. Compare the plaintext password we now have against the encrypted password in the db
       - bcrypt does this by re-encrypting the plaintext password and comparing THAT
    3. Either we're valid or we throw an error
  */
  try {
    const user = await Users.findOne({ where: { username: username } });
    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        req.user = user;
        return next();
      } else {
        next("Invalid Password");
      }
    } else {
      next("Invalid User");
    }
  } catch (error) {
    throw new Error("Database Error");
  }
}

module.exports = authenticate;
