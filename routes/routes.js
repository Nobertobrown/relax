const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

router.get("/", userController.getHomePage);

router.get("/joy", userController.getJoyForm);

router.get("/pain", userController.getPainForm);

router.get("/records", userController.getRecords);

router.post("/records/joy", userController.postJoy);

router.post("/records/pain", userController.postPain);

module.exports = router;
