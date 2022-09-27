const sequelize = require("../db");
const User = require("../src/models/user");
const authenticate = require("../src/middleware/authenticate");

const base64 = require("base-64");

function createAuthorizationHeader(user, password) {
  const userAndPassword64 = base64.encode(`${user}:${password}`);
  return `Basic: ${userAndPassword64}`;
}

const testUserParams = {
  username: "John",
  password: "passwordForJohn",
};
let testUser;
describe("Middleware", () => {
  describe("Authentication Middleware", () => {
    beforeEach(async () => {
      await sequelize.sync({ force: true });
      testUser = await User.create(testUserParams);
    });
    test("Authenticate Valid User", async () => {
      const req = {
        headers: {
          authorization: createAuthorizationHeader(
            testUserParams.username,
            testUserParams.password
          ),
        },
      };
      const res = {};
      const next = jest.fn();
      await authenticate(req, res, next);
      expect(req.user.username).toBe(testUserParams.username);
      expect(next).toBeCalled();
    });
    test("Authenticate Invalid User", async () => {
      const invalidUserParams = {
        username: "Invalid",
        password: "Invalid",
      };
      const req = {
        headers: {
          authorization: createAuthorizationHeader(
            invalidUserParams.username,
            invalidUserParams.password
          ),
        },
      };
      const res = {};
      const next = jest.fn();
      await authenticate(req, res, next);
      expect(next).toBeCalledWith("Invalid User");
    });
    test("Authenticate Invalid Password", async () => {
      const invalidUserParams = {
        username: "John",
        password: "Invalid",
      };
      const req = {
        headers: {
          authorization: createAuthorizationHeader(
            invalidUserParams.username,
            invalidUserParams.password
          ),
        },
      };
      const res = {};
      const next = jest.fn();
      await authenticate(req, res, next);
      expect(next).toBeCalledWith("Invalid Password");
    });
  });
});
