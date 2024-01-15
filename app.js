/******** imports and libraries *******/
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const pg = require("pg");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
/******** importing routes *******/
const userRoutes = require("./routes/routes");
const authRoutes = require("./routes/authRoutes");
const errorRoutes = require("./controllers/error");
/******** importing sequelize instance *******/
const sequelize = require("./util/database");
/******** importing models *******/
const Record = require("./models/records");
const User = require("./models/user");

/********** initialization **********/
const app = express();
const csrfProtection = csrf();

/******** defining middlewares *******/
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const pgPool = new pg.Pool({
  user: "postgres",
  password: "n@k123",
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
    cookie: { maxAge: 5 * 60 * 1000 },
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use(userRoutes);
app.use(authRoutes);
app.get("/500", errorRoutes.get500);
app.use(errorRoutes.get404);
app.use((error, req, res, next) => {
  res.status(500).render("500", { pageTitle: "Internal Server Error" });
});

/******** defining associations *******/
Record.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(Record);

/******** synching data with database *******/
sequelize
  .sync({ force: true })
  // .sync()
  .then((result) => {
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });


  // TODO
  // Add a profile picture setting