require("dotenv").config();
const debug = require("debug")("social:routes:tests");
const chalk = require("chalk");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const initializeDB = require("../../database");
const User = require("../../database/models/user");
const { initializeServer } = require("../index");
const { app } = require("../index");

jest.setTimeout(20000);

const request = supertest(app);

let server;

beforeAll(async () => {
  debug(chalk.yellow("___Before all tests___"));
  await initializeDB(process.env.MONGODB_STRING_TEST);
  server = await initializeServer(process.env.SERVER_PORT_TEST);
});
beforeEach(async () => {
  debug(chalk.yellow("___Before each test___"));
  await User.deleteMany();
  await User.create({
    name: "testuser",
    password: await bcrypt.hash("testpassword", 10),
    username: "testuser",
    photo: "fake.jpg",
    bio: "fake bio",
  });
});

afterAll(async () => {
  debug(chalk.yellow("___After all tests___"));
  await mongoose.connection.on("close", () => {
    debug(chalk.red("Connexion to database ended"));
  });
  await mongoose.connection.close();
  await server.on("close", () => {
    debug(chalk.red("Connexion to server ended"));
  });
  await server.close();
});

describe("Given a /users endopoint", () => {
  describe("When a POST request arrives for /users/login with a username and a password that are in the DB", () => {
    test("Then it should send a response with a status code of 200 and a token", async () => {
      const credentials = {
        username: "testuser",
        password: "testpassword",
      };

      const { body } = await request
        .post("/users/login")
        .send(credentials)
        .expect(200);

      expect(body.token).toBeDefined();
    });
  });
  describe("When a POST request arrives for /users/login with a username that is not in the DB", () => {
    test("Then it should send a response with a status code of 401 and a error message saying 'Wrong Credentials'.", async () => {
      const credentials = {
        username: "testwronguser",
        password: "testpassword",
      };
      const { body } = await request
        .post("/users/login")
        .send(credentials)
        .expect(401);
      const expectedError = {
        error: "Wrong credentials",
      };

      expect(body.error).toBeDefined();
      expect(body).toEqual(expectedError);
    });
  });
  describe("When a POST request arrives for /users/login with a password that is not in the DB", () => {
    test("Then it should send a response with a status code of 401 and a error message saying 'Wrong Credentials'.", async () => {
      const credentials = {
        username: "testuser",
        password: "testwrongpassword",
      };
      const { body } = await request
        .post("/users/login")
        .send(credentials)
        .expect(401);
      const expectedError = {
        error: "Wrong credentials",
      };

      expect(body.error).toBeDefined();
      expect(body).toEqual(expectedError);
    });
  });
});
