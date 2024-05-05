class User {
  constructor(
    username,
    email,
    password,
    cpf,
    rg,
    telefone,
    cep,
    genero,
    data_nascimento,
    cidade_UF_nascimento,
    filiacao
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.cpf = cpf;
    this.rg = rg;
    this.telefone = telefone;
    this.cep = cep;
    this.genero = genero;
    this.data_nascimento = data_nascimento;
    this.cidade_UF_nascimento = cidade_UF_nascimento;
    this.filiacao = filiacao;
  }
}

module.exports = User;
