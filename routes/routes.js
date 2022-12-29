const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

router.get("/landing", userController.getLandingPage);

router.get("/login", userController.getLoginPage);

router.get("/sign-up", userController.getSignUpPage);

router.get("/", userController.getHomePage);

router.get("/joy", userController.getJoyForm);

router.get("/edit-joy/:joyId", userController.getEditJoy);

router.post("/edit-joy", userController.postEditJoy);

router.get("/pain", userController.getPainForm);

router.get("/edit-pain/:painId", userController.getEditPain);

router.post("/edit-pain", userController.postEditPain);

router.get("/records", userController.getRecords);

router.post("/records/joy", userController.postJoy);

router.post("/records/pain", userController.postPain);

router.post("/delete-record", userController.postDeleteProduct);

module.exports = router;
