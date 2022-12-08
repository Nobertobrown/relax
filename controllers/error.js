const path = require("path");
const Directory = require("../util/path");
const rootDir = Directory.rootDir;

exports.get404 = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "404.html"));
};
