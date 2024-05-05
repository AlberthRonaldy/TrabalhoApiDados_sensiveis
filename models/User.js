class User {
  constructor(username, email, password, cpf, rg, address) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.cpf = cpf;
    this.rg = rg;
    this.address = address;
  }
}

module.exports = User;
