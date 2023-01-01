const { where } = require("sequelize");
const Record = require("../models/records");

exports.getLandingPage = (req, res) => {
  res.render("interface/home", { pageTitle: "Relax" });
};

exports.postLandingPage = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/landing");
  });
};

exports.getLoginPage = (req, res) => {
  let message = req.flash("loginError");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignUpPage = (req, res) => {
  res.render("auth/sign-up", { pageTitle: "Sign-up" });
};

exports.getHomePage = (req, res) => {
  res.render("interface/main", { pageTitle: "Home" });
};

exports.getPainForm = (req, res) => {
  res.render("interface/pain", { pageTitle: "Pain", editing: false });
};

exports.postPain = (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const type = req.body.button;
  // const record = new Record(title, description);
  // record.save();
  req.user
    .createRecord({
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

exports.getEditPain = (req, res) => {
  const painId = req.params.painId;
  const editMode = req.query.edit;
  Record.findByPk(painId)
    .then((painRec) => {
      res.render("interface/pain", {
        pageTitle: "Edit:Pain",
        painRec: painRec,
        editing: editMode,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditPain = (req, res) => {
  const painId = req.body.painId;
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;

  Record.findByPk(painId)
    .then((pain) => {
      pain.title = updatedTitle;
      pain.description = updatedDescription;
      return pain.save();
    })
    .then((result) => {
      console.log("Updated Record!");
      res.redirect("/records");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getJoyForm = (req, res) => {
  res.render("interface/joy", { pageTitle: "Joy", editing: false });
};

exports.postJoy = (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const type = req.body.button;
  // const record = new Record(title, description);
  // record.save();
  req.user
    .createRecord({
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

exports.getEditJoy = (req, res) => {
  const joyId = req.params.joyId;
  const editMode = req.query.edit;
  Record.findByPk(joyId)
    .then((joyRec) => {
      res.render("interface/joy", {
        pageTitle: "Edit:Joy",
        joyRec: joyRec,
        editing: editMode,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditJoy = (req, res) => {
  const joyId = req.body.joyId;
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;

  Record.findByPk(joyId)
    .then((joy) => {
      joy.title = updatedTitle;
      joy.description = updatedDescription;
      return joy.save();
    })
    .then((result) => {
      console.log("Updated Record!");
      res.redirect("/records");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getRecords = async (req, res) => {
  const joys = await req.user.getRecords({
    where: {
      recordType: "joy",
    },
  });

  const pains = await req.user.getRecords({
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

exports.postDeleteProduct = (req, res) => {
  const recordId = req.body.recordId;
  Record.findByPk(recordId)
    .then((record) => {
      return record.destroy();
    })
    .then((result) => {
      console.log("Destroyed Record!");
      res.redirect("/records");
    })
    .catch((err) => {
      console.log(err);
    });
};
