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
    // Gerando minhas chaves
    await helper.generateRSAKeys();

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

    // Deecriptografando a senha para aplicar a hash
    password = await helper.decryptAssData(password);
    confirmPassword = await helper.decryptAssData(confirmPassword);

    // Verificando se as senha sao iguais
    if (password != confirmPassword)
      return res.status(422).send("As senhas nao conferem!");

    // Passando a hash na minha senha para salvar no banco
    const hashedPassword = helper.hashPassword(password);

    // Verificando se o usuario existe
    cpf = await helper.decryptAssData(cpf);
    const hashedCpf = helper.hashPassword(cpf);
    if (await checkIfUserExists(hashedCpf)) {
      console.log("Cpf ja existe");
      return res.status(422).send("Usuario ja existe!");
    }

    // Criando meu Objeto Usuario
    const user = new User(
      username,
      email,
      hashedPassword,
      hashedCpf,
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
      res.render("login");
    } catch (error) {
      console.log("Erro ao criar Usuario", error);
    }
  }

  static async userLogin(req, res) {
    let { cpf, password } = req.body;

    // Verificar se o usuario existe
    password = helper.hashPassword(password);
    cpf = helper.hashPassword(cpf);
    let user = await checkIfUserExists(cpf);
    if (user) {
      // Verificar se as senhas estao corretas
      if (password == user.password) {
        for (let key in user) {
          if (user.hasOwnProperty(key)) {
            if (!["cpf", "password"].includes(key))
              user[key] = await helper.decryptAssData(user[key]);
          }
        }
        res.render("dados", { user });
      } else res.render("login");
    }
  }

  static async loadPublicKey(req, res) {
    const publicKey = await helper.loadPublicKey();
    if (publicKey) res.status(200).send(publicKey);
    else res.status(500).send("Erro ao carregar chave publica");
  }
};
