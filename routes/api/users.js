const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

//Load user model so that during registration mongoose  can check if a user email pre exists
const User = require("../../models/User");

// @route GET api/users/test
// @desc TESTS post route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route GET api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  //We're trying to find a record in the schema which has an email equal to the one user just entered
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email  already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        avatar,
        password: req.body.password
      });

      //Salt are extra bits added to the password before encryption for added security. We want to add 10
      //The callback method(err, salt) is called once the salt iis generated ie asynchronously
      bcrypt.genSalt(10, (err, salt) => {
        //Similarly the cb function below is saving the hashed password in the DB, this function is called once the hash is generated
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user)) //the user is the response we see in postman
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
