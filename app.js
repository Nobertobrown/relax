/******** imports and libraries *******/
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { DataTypes, Sequelize } = require("sequelize");
const pg = require("pg");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
/******** importing routes *******/
const userRoutes = require("./routes/routes");
const errorRoutes = require("./controllers/error");
/******** importing sequelize instance *******/
const sequelize = require("./util/database");
/******** importing models *******/
const Record = require("./models/records");
const User = require("./models/user");

const app = express(); // initialization
const csrfProtection = csrf();

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

app.use(csrfProtection);
app.use(flash());

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

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
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
