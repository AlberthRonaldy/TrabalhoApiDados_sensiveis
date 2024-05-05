const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController.js");

// Gets
router.get("/", UserController.loadHome);
router.get("/signup", UserController.loadSignup);
router.get("/login", UserController.loadLogin);

// Posts
router.post("/signup", UserController.createUser);

module.exports = router;