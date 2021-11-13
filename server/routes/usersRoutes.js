const express = require("express");
const { validate } = require("express-validation");
const { loginUser } = require("../controller/usersControllers");
const { loginRequestSchema } = require("../schemas/userSchemas");

const router = express.Router();

router.post("/login", validate(loginRequestSchema), loginUser);

module.exports = router;
