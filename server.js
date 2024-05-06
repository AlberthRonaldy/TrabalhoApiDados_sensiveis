const express = require("express");
const db = require("./db/database.js");
const exphbs = require("express-handlebars");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
// Rotas
const userRoute = require("./routes/UserRoute.js");

app.use(express.static("public"));

// Configurando meu template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use("/", userRoute);

app.listen(3000, () => {
  console.log("Server and DataBase running");
});
