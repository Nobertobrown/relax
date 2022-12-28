const { where } = require("sequelize");
const Record = require("../models/records");

exports.getLandingPage = (req, res) => {
  res.render("interface/home", { pageTitle: "Relax" });
};

exports.getLoginPage = (req, res) => {
  res.render("interface/login", { pageTitle: "Login" });
};

exports.getSignUpPage = (req, res) => {
  res.render("interface/sign-up", { pageTitle: "Sign-up" });
};

exports.getHomePage = (req, res) => {
  res.render("interface/main", { pageTitle: "Home" });
};

exports.getPainForm = (req, res) => {
  res.render("interface/pain", { pageTitle: "Pain" });
};

exports.postPain = (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const type = req.body.button;
  // const record = new Record(title, description);
  // record.save();
  Record.create({
    title: title,
    description: description,
    recordType: type,
  })
    .then((result) => {
      console.log("Pain Record Created!");
      res.redirect("/records");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getJoyForm = (req, res) => {
  res.render("interface/joy", { pageTitle: "Joy" });
};

exports.postJoy = (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const type = req.body.button;
  // const record = new Record(title, description);
  // record.save();
  Record.create({
    title: title,
    description: description,
    recordType: type,
  })
    .then((result) => {
      console.log("Joy Record Created!");
      res.redirect("/records");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getRecords = async (req, res) => {
  const joys = await Record.findAll({
    where: {
      recordType: "joy",
    },
  });

  const pains = await Record.findAll({
    where: {
      recordType: "pain",
    },
  });

  res.render("interface/records", {
    pageTitle: "Records",
    painList: pains,
    joyList: joys,
  });
};
