function enviarFormulario() {
  var username = document.getElementById("username");
  var email = document.getElementById("email");
  var cpf = document.getElementById("cpf");
  var rg = document.getElementById("rg");
  var cep = document.getElementById("cep");
  var genero = document.getElementById("genero");
  var dataNascimento = document.getElementById("data_nascimento");
  var cidade_UF_nascimento = document.getElementById("cidade_UF_nascimento");
  var filiacao = document.getElementById("filiacao");
  var password = document.getElementById("password");
  var confirmPassword = document.getElementById("confirmPassword");

  if (!username || !cpf || !email) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  var data = {
    username: username.value,
    email: email.value,
    cpf: cpf.value,
    rg: rg.value,
    cep: cep.value,
    genero: genero.value,
    data_nascimento: dataNascimento.value,
    cidade_UF_nascimento: cidade_UF_nascimento.value,
    filiacao: filiacao.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  };

  console.log(data);

  // Enviar os dados via POST para a API usando fetch
  fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((data) => {
      alert("Registro efetuado com sucesso!");
      // Limpar os campos do formulário após o registro bem-sucedido, se necessário
      document.getElementById("registrationForm").reset();
    })
    .catch((error) => {
      alert(error.message);
    });
}


function encode(value){
    
}   
