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
  var telefone = document.getElementById("telefone");
  var password = document.getElementById("password");
  var confirmPassword = document.getElementById("confirmPassword");

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
    telefone: telefone.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  };

  // Carrega chave publica
  loadPublicKey();

  if (username.value == "" || cpf.value == "" || email.value == "") {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Enviar os dados via POST para a API usando fetch
  // fetch("http://localhost:3000/signup", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then((data) => {
  //     alert("Registro efetuado com sucesso!");
  //     // Limpar os campos do formulário após o registro bem-sucedido, se necessário
  //     document.getElementById("registrationForm").reset();
  //   })
  //   .catch((error) => {
  //     alert(error.message);
  //   });
}

//Função para verificar a senha
function verifyPass() {
  var senha = document.getElementsByName("password")[0].value;
  var feed = document.getElementsByClassName("feed");

  var maiuscula = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var numeros = "0123456789";
  var especiais = "@$%&!";

  var m = [];
  var n = [];
  var e = [];

  //Define a cor
  function estilo(f, s) {
    var es = ["#2fdc2f", "#ff383b"];
    feed[f].style.color = es[s];
  }

  for (i = 0; i < senha.length; i++) {
    //Para letras maiusculas
    m.push(maiuscula.indexOf(senha.charAt(i)));
    var maxM = Math.max.apply(null, m);
    if (maxM >= 0) {
      estilo(1, 0);
    } else {
      estilo(1, 1);
    }
    //Para números
    n.push(numeros.indexOf(senha.charAt(i)));
    var maxN = Math.max.apply(null, n);
    if (maxN >= 0) {
      estilo(2, 0);
    } else {
      estilo(2, 1);
    }
    //Para caracteres especiais
    e.push(especiais.indexOf(senha.charAt(i)));
    var maxE = Math.max.apply(null, e);
    if (maxE >= 0) {
      estilo(3, 0);
    } else {
      estilo(3, 1);
    }

    if (senha.length >= 8) {
      estilo(0, 0);
    } else {
      estilo(0, 1);
    }
  }
}

function loadPublicKey() {
  console.log("AQUIIIII");
  fetch("http://localhost:3000/loadPk")
    .then((response) => {
      if (!response.ok) {
        console.log("ERRO");
        throw new Error("Erro ao carregar chave pública");
      }
      console.log("Minha resposta =====> ", response);
      return response.text(); // Extrair o texto da resposta
    })
    .then((publicKey) => {
      // Aqui você pode usar a chave pública carregada
      console.log("Chave pública carregada:", publicKey);
      // Por exemplo, você pode armazená-la em uma variável global ou em algum local seguro
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert(error.message);
    });
}

///TODO FAZER A VERIFICAÇÃO DA SENHA COM CONFIRMAÇÃO DE SENHA, O RESTO TA SAFE
