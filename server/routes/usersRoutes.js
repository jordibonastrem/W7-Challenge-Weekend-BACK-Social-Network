const express = require("express");
const { validate } = require("express-validation");
const { loginUser, getUsers } = require("../controller/usersControllers");
const { loginRequestSchema } = require("../schemas/userSchemas");

const router = express.Router();

router.get("/", getUsers);
router.post("/login", validate(loginRequestSchema), loginUser);

module.exports = router;
