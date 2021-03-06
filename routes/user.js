const express = require("express"),
  router = express.Router(),
  bcrypt = require("bcryptjs"),
  ProfileModel = require("../models/userModel");

/* GET users signup. */
router.get("/signup", async (req, res, next) => {
  res.render("template", {
    locals: {
      title: "Signup",
      sessionData: req.session
    },
    partials: {
      partial: "partial-signup"
    }
  });
});

/* GET users login. */
router.get("/login", async (req, res, next) => {
  res.render("template", {
    locals: {
      title: "Login",
      sessionData: req.session
    },
    partials: {
      partial: "partial-login"
    }
  });
});

/* POST users login. */
router.post("/login", async function(req, res, next) {
  const { user_name, password } = req.body;
  const profile = new ProfileModel(null, null, null, user_name, password);
  const loginResponse = await profile.loginUser();
 
  if (!!loginResponse.isValid) {
    req.session.is_logged_in = loginResponse.isValid;
    req.session.profile_id = loginResponse.profile_id;
    req.session.user_name = loginResponse.user_name;
    req.session.first_name = loginResponse.first_name;
    req.session.last_name = loginResponse.last_name;
    res.status(200).redirect("/");
  } else {
    res.sendStatus(403);
  }
});

/* POST users signup. */
router.post("/signup", function(req, res, next) {
  const { first_name, last_name, user_name, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const profile = new ProfileModel(
    null,
    first_name,
    last_name,
    user_name,
    hash
  );
  profile.addUser();

  res.status(200).redirect("/user/login");
});

/* GET users logout session. */
router.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
