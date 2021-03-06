const debug = require("debug")("social:server");
const chalk = require("chalk");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const usersRoutes = require("./routes/usersRoutes");
const {
  notFoundErrorHandler,
  generalErrorHandler,
} = require("./middlewares/error");

const app = express();
app.use(cors());

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.yellow(`Listening to port ${port}`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.red("Error initialising the server."));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`Port ${port} is already in use.`));
      }
      reject();
    });

    server.on("close", () => {
      debug(chalk.yellow("Server disconnected."));
    });
  });

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRoutes);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

module.exports = { app, initializeServer };
