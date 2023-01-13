const express = require("express");
const userController = require("../controllers/user");
const authCheck = require("../middlewares/isAuth");
const router = express.Router();
const { body } = require("express-validator");

router.get("/landing", userController.getLandingPage);

router.post("/landing", authCheck, userController.postLandingPage);

router.get("/", authCheck, userController.getHomePage);

router.get("/joy", authCheck, userController.getJoyForm);

router.get("/edit-joy/:joyId", authCheck, userController.getEditJoy);

router.post(
  "/edit-joy",
  authCheck,
  [body("title").trim(), body("description").trim()],
  userController.postEditJoy
);

router.get("/pain", authCheck, userController.getPainForm);

router.get("/edit-pain/:painId", authCheck, userController.getEditPain);

router.post(
  "/edit-pain",
  authCheck,
  [body("title").trim(), body("description").trim()],
  userController.postEditPain
);

router.get("/records", authCheck, userController.getRecords);

router.post(
  "/records/joy",
  authCheck,
  [body("title").trim(), body("description").trim()],
  userController.postJoy
);

router.post(
  "/records/pain",
  authCheck,
  [body("title").trim(), body("description").trim()],
  userController.postPain
);

router.post("/delete-record", authCheck, userController.postDeleteProduct);

module.exports = router;
