/* eslint-disable no-underscore-dangle */
const debug = require("debug")("social:database");
const chalk = require("chalk");
const mongoose = require("mongoose");

const connectDB = (connectionString) =>
  new Promise((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
      },
    });

    mongoose.connect(connectionString, (error) => {
      if (error) {
        debug(chalk.red("Error: could not connect to the database"));
        debug(chalk.red(error.message));
        reject(error);
      }
      debug(chalk.green("Conected to database"));
      resolve();
    });

    mongoose.connection.on("close", () => {
      debug(chalk.green("Disconnected of the database"));
    });
  });

module.exports = connectDB;
