var bCrypt = require("bcryptjs");
const model = require("../models");
const nodemailer = require("nodemailer");
const users = model.users;
var generateHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};
const addusers = async (req, res) => {
  let repassword = req.body.repassword;
  let info = {
    username: req.body.username,
    email: req.body.email,
    gender: req.body.gender,
    phonenumber: req.body.phonenumber,
    password: req.body.password,
  };

  if (info.email.length && info.username.length && info.password.length) {
    users
      .findOne({
        where: {
          email: info.email,
        },
      })
      .then(function (user) {
        if (user) {
          res.status(400).json({ Message: "That email is already taken" });
        } else {
          if (info.password == repassword) {
            info.password = generateHash(info.password);
            const user = users.create(info);
            res.status(200).json({ Message: "Successfully added user" });
            const output = `
  <h3>Hi ${req.body.username}</h3>
  <p>Thanks for registering to our account</p>
`;
            var smtpTransport = require("nodemailer-smtp-transport");

            const transporter = nodemailer.createTransport(
              smtpTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                auth: {
                  user: "abdullahr@ifelsetech.com", // generated ethereal user
                  pass: "Today@20221116#", // generated ethereal password
                },
              })
            );
            let infor = transporter.sendMail({
              from: '"Abdullah,Web Developer" <abdullahr@ifelsetech.com>', // sender address
              to: info.email, // list of receivers
              subject: "Node mail ✔", // Subject line
              text: "Hello world?", // plain text body
              html: output, // html body
            });
            console.log("Message sent: %s", infor.messageId);
          } else {
            res.status(400).json({ Message: "password not match" });
          }
        }
      });
  } else {
    res.status(300).json({ Message: "empty field" });
  }
};

//     if (info.password == repassword) {

//     }
//    else {
//    res.status(400).json({ Message: "password not match" });
// }

const getoneuser = async (req, res) => {
  let id = req.params.id;
  let user = await users.findOne({ where: { id: id } });
  res.status(200).json(user);
};
const getalluser = async (req, res) => {
  let user = await users.findAll({});
  res.status(200).json(user);
};
const updateuser = async (req, res) => {
  let info = {
    username: req.body.username,
    email: req.body.email,
    gender: req.body.gender,
    phonenumber: req.body.phonenumber,
  };
  let id = req.params.id;
  let user = await users.update(info, { where: { id: id } });
  res.status(200).json(user);
};

const deleteuser = async (req, res) => {
  let id = req.params.id;
  await users.destroy({ where: { id: id } });
  res.status(200).json("User Deleted");
};

module.exports = {
  addusers,
  getalluser,
  getoneuser,
  updateuser,
  deleteuser,
};
