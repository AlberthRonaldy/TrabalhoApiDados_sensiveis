const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const crypto = require("crypto");
const util = require("util");
const {
  createUser,
  checkIfUserExists,
} = require("../repositories/UserRepositorie.js");

// Gerar um par de chaves RSA
const generateKeyPair = util.promisify(crypto.generateKeyPair);

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

    // Codificar e Decodificar restrito

    // Confidencial apenas a Hash

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

  static async generateRSAKeys(req, res) {
    try {
      const { publicKey, privateKey } = await generateKeyPair("rsa", {
        modulusLength: 2048, // Tamanho da chave em bits
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });
      await Promise.all([
        fs.writeFile("public_key.pem", publicKey),
        fs.writeFile("private_key.pem", privateKey),
      ]);
      res.render("assimetric", { public: publicKey });
    } catch (error) {
      console.error("Erro ao gerar o par de chaves RSA:", error);
    }
  }

  // Função para carregar a chave pública
  static async loadPublicKey() {
    try {
      const publicKey = await fs.readFile("public_key.pem", "utf8");
      return publicKey;
    } catch (error) {
      console.error("Erro ao carregar a chave pública:", error);
      return null;
    }
  }

  // Função para carregar a chave privada
  static async loadPrivateKey() {
    try {
      const privateKey = await fs.readFile("private_key.pem", "utf8");
      return privateKey;
    } catch (error) {
      console.error("Erro ao carregar a chave privada:", error);
      return null;
    }
  }

  // Encrypt data using public key
  static async encryptAssData(req, res) {
    const { texto } = req.body;
    if (!texto) {
      res.status(400).json({ msg: "Texto inválido." });
      return;
    }

    try {
      const publicKey = await loadPublicKey();
      if (!publicKey) {
        res.status(500).json({ msg: "Erro ao carregar a chave pública." });
        return;
      }

      const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(texto));
      res.status(200).render("assimetric", {
        public: publicKey,
        texto: encryptedData.toString("base64"),
      });
    } catch (error) {
      console.error("Erro ao criptografar dados:", error);
      res.status(500).json({ msg: "Erro ao criptografar dados." });
    }
  }

  // Decrypt data using private key
  static async decryptAssData(req, res) {
    const { texto } = req.body;
    if (!texto) {
      res.status(400).json({ msg: "Texto inválido." });
      return;
    }

    try {
      const privateKey = await loadPrivateKey();
      if (!privateKey) {
        res.status(500).json({ msg: "Erro ao carregar a chave privada." });
        return;
      }

      const decryptedData = crypto.privateDecrypt(
        {
          key: privateKey,
          passphrase: "",
        },
        Buffer.from(texto, "base64")
      );
      res
        .status(200)
        .render("assimetric", { texto: decryptedData.toString("utf8") });
    } catch (error) {
      console.error("Erro ao descriptografar dados:", error);
      res.status(500).json({ msg: "Erro ao descriptografar dados." });
    }
  }
};
