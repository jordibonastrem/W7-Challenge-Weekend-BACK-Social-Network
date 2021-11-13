const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../database/models/user");
const { loginUser } = require("./usersControllers");

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Given a loginUser function", () => {
  describe("When it recieves a request with a body that contains a username and a password that exist in the DB", () => {
    test("Then it should invoke res.json with an object that contains a token", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        username: "Luis",
        password: "Marta",
      });
      const expectedtoken = "e";
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedtoken);
      const req = {
        body: {
          username: "Luis",
          password: "Marta",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const expectedResponse = {
        token: expectedtoken,
      };

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
