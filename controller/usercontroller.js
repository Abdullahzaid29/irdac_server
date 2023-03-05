var bCrypt = require("bcryptjs");
const model = require("../models");
const startupusers = model.startupusers;
var generateHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};
const addusers_startup = async (req, res) => {
  let repassword = req.body.repassword;
  let info = {
    username: req.body.username,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    organization: req.body.organization,
    password: req.body.password,
  };

  if (
    info.email.length &&
    info.username.length &&
    info.password.length &&
    info.phonenumber
  ) {
    if (info.password == repassword) {
      startupusers
        .findOne({
          where: {
            email: info.email,
          },
        })
        .then(function (user) {
          if (user) {
            res.status(300).json({ Message: "That email is already taken" });
          } else {
            info.password = generateHash(info.password);
            const users = startupusers.create(info);
            res.status(200).json({ Message: "Successfully added user" });
          }
        });
    } else {
      res.status(400).json({ Message: "password not match" });
    }
  } else {
    res.status(300).json({ Message: "empty field" });
  }
};

module.exports = {
  addusers_startup,
};
