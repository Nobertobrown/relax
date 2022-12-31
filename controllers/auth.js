const { Op,where } = require("sequelize");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.postSignUpPage = (req, res) => {
  const fullName = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    where: {
      e_mail: email,
    },
  })
    .then((user) => {
      if (user) {
        return res.redirect("/sign-up");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          User.create({
            name: fullName,
            username: username,
            e_mail: email,
            password: hashedPassword,
          });
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLoginPage = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    where: {
      [Op.or]: [{ username: username }, { e_mail: username }],
    },
  })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            return res.redirect("/");
          }
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
