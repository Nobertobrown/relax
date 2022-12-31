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
const pg = require("pg");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const app = express(); // initialization

/******** defining middlewares *******/
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const pgPool = new pg.Pool({
  user: "noberto",
  password: "noberto",
  host: "localhost",
  port: 5432,
  database: "relax-app",
});

app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: "hero108&ben10",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10 * 60 * 1000 },
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
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
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
