const crypto = require("crypto");

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

  static async generateRSAKeys(req, res) {
    try {
      // Verificar se os arquivos das chaves já existem
      const publicKeyExists = await fs
        .access("public_key.pem")
        .then(() => true)
        .catch(() => false);
      const privateKeyExists = await fs
        .access("private_key.pem")
        .then(() => true)
        .catch(() => false);

      // Se as chaves já existirem, não é necessário gerá-las novamente
      if (publicKeyExists && privateKeyExists) {
        // Você pode renderizar a página aqui, se necessário
        console.log("Chave ja Existem");
        return false;
      }

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

      // Escrever as chaves nos arquivos apenas se não existirem
      await Promise.all([
        !publicKeyExists && fs.writeFile("public_key.pem", publicKey),
        !privateKeyExists && fs.writeFile("private_key.pem", privateKey),
      ]);
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
};
