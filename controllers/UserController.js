const User = require("../models/User.js");
const { createUser } = require("../repositories/UserRepositorie.js");

module.exports = class UserController {
  static loadHome(req, res) {
    res.render("home");
  }

  static loadSignup(req, res) {
    res.render("signup");
  }

  static loadLogin(req, res) {
    res.render("login")
  }

  static async createUser(req, res) {
    const { username, email, password, confirmPassword, cpf, rg, address } =
      req.body;

    const user = new User(username, email, password, cpf, rg, address);

    try {
      createUser(user);
    } catch (error) {
      console.log("Erro ao criar Usuario", error);
    }

    res.render("home");
  }
};
