const User = require("../models/User.js");
const fs = require("fs/promises");
const crypto = require("crypto");
const util = require("util");
const helper = require("../helpers/helper.js");
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

  static loadLogin(req, res) {
    res.render("login");
  }

  static loadData(req, res) {
    res.render("dados");
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

    // Criar um objeto para armazenar os dados
    const data = {
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
    };

    console.log(data);

    // Codificar e Decodificar restrito

    // Confidencial apenas a Hash

    // Verificando se as senha sao iguais
    if (password != confirmPassword)
      return res.status(422).json({ msg: "As senhas nao conferem!" });

    const hashedPassword = helper.hashPassword(password);

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
