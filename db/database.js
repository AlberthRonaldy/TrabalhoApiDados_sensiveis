const sqlite3 = require("sqlite3");
const dbName = "Teste.db";

let db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Conectado ao banco");
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT, rg TEXT, cpf TEXT, address TEXT)",
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
