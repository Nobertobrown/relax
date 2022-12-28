const Sequelize = require("sequelize");
const sequelize = new Sequelize("relax-app", "noberto", "noberto", {
  dialect: "postgres",
  host: "localhost",
  logging:false
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
