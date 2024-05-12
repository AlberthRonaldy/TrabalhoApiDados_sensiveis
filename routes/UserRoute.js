const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController.js");

// Gets
router.get("/", UserController.loadHome);
router.get("/signup", UserController.loadSignup);
router.get("/login", UserController.loadLogin);
router.get("/dados", UserController.loadData);
router.get("/loadPK", UserController.loadPublicKey);

// Posts
router.post("/signup", UserController.createUser);
router.post("/login", UserController.userLogin);

module.exports = router;
