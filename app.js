const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const userRoutes = require("./routes/routes");
const errorRoutes = require("./controllers/error");
const sequelize = require("./util/database");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(userRoutes);
app.use(errorRoutes.get404);

sequelize
  .sync()
  .then((result) => {
    // console.log(result);
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
