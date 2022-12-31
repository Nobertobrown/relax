/******** imports and libraries *******/
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const userRoutes = require("./routes/routes");
const errorRoutes = require("./controllers/error");
const sequelize = require("./util/database");
const Record = require("./models/records");
const User = require("./models/user");
const { DataTypes, Sequelize } = require("sequelize");

const app = express(); // initialization

/******** defining middlewares *******/
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use(userRoutes);
app.use(errorRoutes.get404);

/******** defining associations *******/
Record.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(Record);

/******** synching data with database *******/
sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Norberth Kibona",
        username: "noberto",
        e_mail: "kibonanorberth@gmail.com",
        password: "noberto123",
      });
    }
    return user;
  })
  .then((user) => {
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
