require("dotenv").config();
const bcrypt = require("bcrypt");
const connectDB = require("./database/index");
const User = require("./database/models/user");

const { initializeServer } = require("./server/index");

const port = process.env.PORT ?? process.env.SERVER_PORT ?? 5000;
console.log("PORT", port);
(async () => {
  try {
    await connectDB(process.env.MONGODB_STRING);
    initializeServer(port);
  } catch (error) {
    process.exit(1);
  }
})();

// create a user
// (async () => {
//   User.create({
//     name: "imagin",
//     username: "Jordi",
//     password: await bcrypt.hash("jordi123", 10),
//     photo:
//       "http://pm1.narvii.com/6720/25e80ad037ae1298d4be1d8b0b6a741c8c180347_00.jpg",
//     enemies: [],
//     friends: [],
//     bio: "blablalbllalaalslafla",
//   });
// })();
