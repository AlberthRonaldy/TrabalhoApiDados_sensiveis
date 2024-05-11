const crypto = require("crypto");
const fs = require("fs");
const { CLIENT_RENEG_WINDOW } = require("tls");
const util = require("util");
const generateKeyPair = util.promisify(crypto.generateKeyPair);

module.exports = class Helper {
  static hashPassword(password) {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    const hashedPassword = hash.digest("hex");
    return hashedPassword;
  }

  static authenticatePassword(password, hashedPassword) {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    const hashedInputPassword = hash.digest("hex");
    return hashedInputPassword === hashedPassword;
  }

  static async generateRSAKeys() {
    try {
      // Verificar se os arquivos das chaves já existem
      const publicKeyExists = await fs.promises
        .access("public_key.pem")
        .then(() => true)
        .catch(() => false);
      const privateKeyExists = await fs.promises
        .access("private_key.pem")
        .then(() => true)
        .catch(() => false);

      // Se as chaves já existirem, não é necessário gerá-las novamente
      if (publicKeyExists && privateKeyExists) {
        console.log("As chaves já existem.");
        return;
      }

      // Se uma ou ambas as chaves não existirem, gerar um novo par de chaves
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

      // Escrever as chaves nos arquivos
      await Promise.all([
        fs.promises.writeFile("public_key.pem", publicKey),
        fs.promises.writeFile("private_key.pem", privateKey),
      ]);

      console.log("Par de chaves RSA gerado com sucesso.");
    } catch (error) {
      console.error("Erro ao gerar o par de chaves RSA:", error);
    }
  }

  // Função para carregar a chave pública
  static async loadPublicKey() {
    try {
      const publicKey = await fs.promises.readFile("public_key.pem", "utf8");
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
      const publicKey = await this.loadPublicKey();
      if (!publicKey) {
        res.status(500).json({ msg: "Erro ao carregar a chave pública." });
        return;
      }

      const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(texto));
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
      res.status(200);
    } catch (error) {
      console.error("Erro ao descriptografar dados:", error);
      res.status(500).json({ msg: "Erro ao descriptografar dados." });
    }
  }

  static accessFile = (fileName) => {
    return new Promise((resolve, reject) => {
      fs.access(fileName, (err) => {
        if (err) {
          reject(err); // Se houver um erro, rejeitar a promessa
        } else {
          resolve(true); // Se não houver erro, resolver com true (indicando que o arquivo existe)
        }
      });
    });
  };
};
