const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
//All templating logic will come here
const userRoutes = require("./routes/routes");
const errorRoutes = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(userRoutes);
app.use(errorRoutes.get404);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
