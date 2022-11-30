const express = require("express");
const handlebars = require("express-handlebars").engine;
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// own modules
const routes = require("./routes/routes");

let app = express();

app.engine("hbs", handlebars({
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
  defaultLayout: "main",
  extname: "hbs"
}))

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use( express.static(path.join(__dirname, "public")) );

routes(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("App is listening on port " + PORT);
})