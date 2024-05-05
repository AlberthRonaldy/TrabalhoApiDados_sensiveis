const db = require("../db/database.js");

module.exports = class UserRepository {
  static async createUser(user) {
    await db.run(
      `
        INSERT INTO users (username, password, email, cpf, rg, address)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        user.username,
        user.password,
        user.email,
        user.cpf,
        user.rg,
        user.address,
      ]
    );
  }
};
