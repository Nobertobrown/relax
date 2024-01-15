const { Op, where } = require("sequelize");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
// const nodemailer = require("nodemailer");
// const sendGrid = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { nextTick } = require("process"); 
const dotenv = require('dotenv');
dotenv.config();

// const transporter = nodemailer.createTransport(
//   sendGrid({
//     auth: {
//       api_key:
//         process.env.SENDGRID_API_KEY,
//     },
//   })
// );

exports.getLoginPage = (req, res) => {
  let message = req.flash("loginError");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignUpPage = (req, res) => {
  let message = req.flash("signUpError");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/sign-up", {
    pageTitle: "Sign-up",
    errorMessage: message,
    oldInput: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.getResetPasswordPage = (req, res) => {
  let message = req.flash("reset-error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.getNewPasswordPage = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    where: {
      [Op.and]: [
        { resetToken: token },
        { resetTokenExpiration: { [Op.gt]: Date.now() } },
      ],
    },
  })
    .then((user) => {
      let message = req.flash("new-password-error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        pageTitle: "New Password",
        errorMessage: message,
        userId: user.id,
        userToken: user.resetToken,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignUpPage = (req, res, next) => {
  const fullName = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/sign-up", {
      pageTitle: "Sign-up",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: fullName,
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  bcrypt
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
      // return transporter.sendMail({
      //   to: email,
      //   from: "nobertobrown@gmail.com",
      //   subject: "SignedUp Successfully",
      //   html: "<h1> You have been successfully signed up!</h1>",
      // });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLoginPage = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    where: {
      [Op.or]: [{ username: username }, { e_mail: username }],
    },
  })
    .then((user) => {
      if (!user) {
        req.flash("loginError", "Invalid e-mail or password!");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("loginError", "Invalid e-mail or password!");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postResetPasswordPage = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({
      where: {
        e_mail: email,
      },
    })
      .then((user) => {
        if (!user) {
          req.flash("reset-error", "The e-mail provided is unknown!");
          return res.redirect("/reset-password");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 5 * 60 * 1000;
        return user
          .save()
          .then((result) => {
            res.redirect("/login");
            // transporter.sendMail({
            //   to: email,
            //   from: "nobertobrown@gmail.com",
            //   subject: "Resetting Password",
            //   html: `
            //   <h2>Password Reset</h2>
            //   <p>You requested a password reset, follow the instructions below to reset your password</p>
            //   <p>Click this <a href='http://localhost:3000/reset-password/${token}'>link</a> to set a new password.</p>
            //   `,
            // });
          })
          .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.postNewPassword = (req, res, next) => {
  const password = req.body.password;
  const userId = req.body.userId;
  const resetToken = req.body.userToken;
  let resetUser;

  User.findOne({
    where: {
      [Op.and]: [
        { id: userId },
        { resetToken: resetToken },
        { resetTokenExpiration: { [Op.gt]: Date.now() } },
      ],
    },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = null;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
