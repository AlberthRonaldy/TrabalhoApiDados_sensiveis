const express = require("express");
const db = require("./db/database.js");
const exphbs = require("express-handlebars");
const helper = require("./helpers/helper.js");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static("public"));

// Rotas
const userRoute = require("./routes/UserRoute.js");

app.use(express.static("public"));

// Configurando meu template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use("/", userRoute);

app.listen(3000, async () => {
  await helper.generateRSAKeys();
  console.log("Server and DataBase running");
});
