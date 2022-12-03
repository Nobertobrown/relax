const path = require("path");
const Directory = require("../util/path");
const rootDir = Directory.rootDir;
const Record = require("../models/records");

exports.getHomePage = (req, res) => {
  res.sendFile(path.join(rootDir, "views", "main.html"));
};

exports.getPainForm = (req, res) => {
  res.sendFile(path.join(rootDir, "views", "pain.html"));
};

exports.postPain = (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const record = new Record(title, description);
  record.save();
  res.redirect("/records");
};

exports.getJoyForm = (req, res) => {
  res.sendFile(path.join(rootDir, "views", "joy.html"));
};

exports.postJoy = (req, res) => {
  const title = req.body.title;
  const description = req.body.body;
  const record = new Record(title, description);
  record.save();
  res.redirect("/records");
};

exports.getRecords = (req, res) => {
  res.sendFile(path.join(rootDir, "views", "records.html"));
};
