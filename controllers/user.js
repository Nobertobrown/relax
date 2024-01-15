const { Op, where } = require("sequelize");
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
  /* past code using file-storage */
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditPain = (req, res) => {
  const painId = req.params.painId;
  const editMode = req.query.edit;
  Record.findByPk(painId)
    .then((painRec) => {
      if (painRec.userId !== req.user.id) {
        return res.redirect("/");
      }
      res.render("interface/pain", {
        pageTitle: "Edit:Pain",
        painRec: painRec,
        editing: editMode,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditPain = (req, res) => {
  const painId = req.body.painId;
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;

  Record.findByPk(painId)
    .then((pain) => {
      if (pain.userId !== req.user.id) {
        return res.redirect("/");
      }
      pain.title = updatedTitle;
      pain.description = updatedDescription;
      return pain.save().then((result) => {
        console.log("Updated Record!");
        res.redirect("/records");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditJoy = (req, res) => {
  const joyId = req.params.joyId;
  const editMode = req.query.edit;
  Record.findByPk(joyId)
    .then((joyRec) => {
      if (joyRec.userId !== req.user.id) {
        return res.redirect("/");
      }
      res.render("interface/joy", {
        pageTitle: "Edit:Joy",
        joyRec: joyRec,
        editing: editMode,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditJoy = (req, res) => {
  const joyId = req.body.joyId;
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;

  Record.findByPk(joyId)
    .then((joy) => {
      if (joy.userId !== req.user.id) {
        return res.redirect("/");
      }
      joy.title = updatedTitle;
      joy.description = updatedDescription;
      return joy.save().then((result) => {
        console.log("Updated Record!");
        res.redirect("/records");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
  Record.findOne({
    where: {
      [Op.and]: [{ id: recordId }, { userId: req.user.id }],
    },
  })
    .then((record) => {
      return record.destroy();
    })
    .then((result) => {
      console.log("Destroyed Record!");
      res.redirect("/records");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
