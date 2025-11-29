const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.get("/activate/:token", userController.activateAccount);
router.post("/login", userController.login);

module.exports = router;
