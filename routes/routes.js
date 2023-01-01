const express = require("express");
const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const authCheck = require("../middlewares/isAuth");
const router = express.Router();

router.get("/landing", userController.getLandingPage);

router.post("/landing", authCheck, userController.postLandingPage);

router.get("/login", userController.getLoginPage);

router.post("/login", authController.postLoginPage);

router.get("/sign-up", userController.getSignUpPage);

router.post("/sign-up", authController.postSignUpPage);

router.get("/", authCheck, userController.getHomePage);

router.get("/joy", authCheck, userController.getJoyForm);

router.get("/edit-joy/:joyId", authCheck, userController.getEditJoy);

router.post("/edit-joy", authCheck, userController.postEditJoy);

router.get("/pain", authCheck, userController.getPainForm);

router.get("/edit-pain/:painId", authCheck, userController.getEditPain);

router.post("/edit-pain", authCheck, userController.postEditPain);

router.get("/records", authCheck, userController.getRecords);

router.post("/records/joy", authCheck, userController.postJoy);

router.post("/records/pain", authCheck, userController.postPain);

router.post("/delete-record", authCheck, userController.postDeleteProduct);

module.exports = router;
