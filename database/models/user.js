const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: false,
  },
  friends: {
    type: [Types.ObjectId],
    ref: "Users",
    required: true,
  },
  enemies: {
    type: [Types.ObjectId],
    ref: "Users",
    required: true,
  },
});

const User = model("User", userSchema, "Users");
module.exports = User;
