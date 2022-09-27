const app = require("../src/app");
const sequelize = require("../db");

const supertest = require("supertest");
const bcrypt = require("bcrypt");
const base64 = require("base-64");

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
  test("Signin Route Unauthorized", async () => {
    const username = "John";
    const password = "passwordForJohn";
    const basicAuthEncoded = base64.encode(`${username}:${password}`);
    await request
      .post("/signin")
      .set("Authorization", `Basic: ${basicAuthEncoded}`)
      .send()
      .expect(403);
  });

  test("Signin Route Authorized", async () => {
    const testUserParams = {
      username: "John",
      password: "passwordForJohn",
    };
    const response1 = await request
      .post("/signup")
      .send(testUserParams)
      .expect(200);
    // Basic Auth resends user password each time.
    const { username, password } = testUserParams;
    const basicAuthEncoded = base64.encode(`${username}:${password}`);
    await request
      .post("/signin")
      .set("Authorization", `Basic: ${basicAuthEncoded}`)
      .send()
      .expect(200);
  });
});
