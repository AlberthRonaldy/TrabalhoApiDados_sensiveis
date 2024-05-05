const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const {
  createUser,
  checkIfUserExists,
} = require("../repositories/UserRepositorie.js");

module.exports = class UserController {
  static loadHome(req, res) {
    res.render("home");
  }

  static loadSignup(req, res) {
    res.render("signup");
  }

  static async createUser(req, res) {
    let {
      username,
      email,
      password,
      confirmPassword,
      cpf,
      rg,
      telefone,
      cep,
      genero,
      data_nascimento,
      cidade_UF_nascimento,
      filiacao,
    } = req.body;

    // Tratamento dos meus dados
    cpf = cpf.replace(/\D/g, ""); // Tratando meu cpf

    // Verificando se as senha sao iguais
    if (password != confirmPassword)
      return res.status(422).json({ msg: "As senhas nao conferem!" });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    console.log(hashedPassword);

    if (await checkIfUserExists(cpf))
      return res.status(422).json({ msg: "Usuario ja existe!" });

    const user = new User(
      username,
      email,
      hashedPassword,
      cpf,
      rg,
      telefone,
      cep,
      genero,
      data_nascimento,
      cidade_UF_nascimento,
      filiacao
    );
    try {
      await createUser(user);
      res.render("home");
    } catch (error) {
      console.log("Erro ao criar Usuario", error);
    }
  }
};
