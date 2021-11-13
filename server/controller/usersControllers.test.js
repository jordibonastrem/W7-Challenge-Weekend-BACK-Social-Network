const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../database/models/user");
const { loginUser } = require("./usersControllers");

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Given a loginUser function", () => {
  describe("When it recieves a request with a body that contains a correct username and a password", () => {
    test("Then it should invoke res.json with an object that contains a token", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        username: "Jordi",
        password: "1234",
      });
      const expectedtoken = "e";
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedtoken);
      const req = {
        body: {
          username: "Jordi",
          password: "1234",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const expectedResponse = {
        token: expectedtoken,
      };

      await loginUser(req, res);

      expect(User.findOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it receives a request with an incorrect username", () => {
    test("Then it should invoke next with an error with code 401 and message Wrong credentials", async () => {
      const req = {
        body: {
          username: "Jordi",
        },
      };
      const res = {};
      User.findOne = jest.fn().mockResolvedValue(false);
      const error = new Error("Wrong credentials");
      error.code = 401;
      const next = jest.fn();

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When it receives a request with an incorrect password", () => {
    test("Then it should invoke next with an error with code 401 and message Wrong credentials", async () => {
      const req = {
        body: {
          password: "Jordi",
        },
      };
      const res = {};
      User.findOne = jest.fn().mockResolvedValue(false);
      const error = new Error("Wrong credentials");
      error.code = 401;
      const next = jest.fn();

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
});
