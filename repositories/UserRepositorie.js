const db = require("../db/database.js");

module.exports = class UserRepository {
  static async createUser(user) {
    db.run(
      `
        INSERT INTO users (cpf, username, email, password, rg, telefone, cep, genero, data_nascimento, cidade_UF_nascimento, filiacao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user.cpf,
        user.username,
        user.email,
        user.password,
        user.rg,
        user.telefone,
        user.cep,
        user.genero,
        user.data_nascimento,
        user.cidade_UF_nascimento,
        user.filiacao,
      ]
    );
  }

  static async checkIfUserExists(cpf) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE cpf = ?", [cpf], (err, result) => {
        if (err) {
          console.error(err.message);
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
};
