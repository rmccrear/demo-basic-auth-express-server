const app = require("../app");
const sequelize = require("../db");

const supertest = require("supertest");
const bcrypt = require("bcrypt");

const request = supertest(app);

describe("App", () => {
  beforeEach(() => {
    return sequelize.sync({ force: true });
  });
  test("Signup Route", () => {
    const testUserParams = {
      username: "John",
      password: "passwordForJohn",
    };
    return request
      .post("/signup")
      .send(testUserParams)
      .expect(200)
      .expect(function (response) {
        expect(response.body.username).toBe("John");
        return bcrypt
          .compare(testUserParams.password, response.body.password)
          .then((correct) => {
            expect(correct).toBe(true);
          })
          .then(() => {
            return bcrypt
              .compare(testUserParams.password + 123, response.body.password)
              .then((incorrect) => {
                expect(incorrect).toBe(false);
              });
          });
      });
  });
});
