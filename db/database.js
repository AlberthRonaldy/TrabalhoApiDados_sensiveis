const sqlite3 = require("sqlite3");
const dbName = "Teste.db";

let db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Conectado ao banco");
    db.run(
      "CREATE TABLE IF NOT EXISTS users (cpf TEXT PRIMARY KEY, username TEXT, email TEXT, password TEXT, rg TEXT, telefone TEXT, cep TEXT, genero TEXT, data_nascimento TEXT, cidade_UF_nascimento TEXT, filiacao TEXT)",
      (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Table created or existed");
        }
      }
    );
  }
});

module.exports = db;
