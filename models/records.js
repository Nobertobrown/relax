const fs = require("fs");
const path = require("path");
const Directory = require("../util/path");
const rootDir = Directory.rootDir;

const p = path.join(rootDir, "data", "records.json");

const getRequirementsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Record {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  save() {
    this.id = Math.random().toString();
    getRequirementsFromFile((requirements) => {
      requirements.push(this);
      fs.writeFile(p, JSON.stringify(requirements), (err) => {
        console.log(err);
      });
    });
  }

  static findById(id, cb) {
    getRequirementsFromFile((requirements) => {
      const requirement = requirements.find((r) => r.id === id);
      cb(requirement);
    });
  }
};
