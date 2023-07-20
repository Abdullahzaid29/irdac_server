var bCrypt = require("bcryptjs");
const model = require("../models");
const axios = require("axios");
// const getdata = axios.get("http://localhost:7000/api/fetchppm");
const data = axios.get("https://thingspeak.com/channels/2125069/feed.json");
let sdata = [];
try {
  data.then((response) => {
    // console.log(response.data.feeds);
    let apidata = response.data.feeds;
    sdata.push(apidata);
    // setData(response.data)
  });
} catch (err) {
  console.log("pages auth in error");
  console.log(err);
}
const userppm = require("./ppmstatus");
const Users = model.users;
const irdac = model.irdac;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
var generateHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

async function signin(req, res) {
  // const { body, headers, method } = req;

  let info = {
    username: req.body.username,
    password: req.body.password,
  };
  console.log(Users);
  var isValidPassword = function (userpass, password) {
    return bCrypt.compareSync(password, userpass);
  };

  await Users.findOne({
    where: {
      username: info.username,
    },
  })
    .then(function (user) {
      if (!user) {
        res.status(401).json({ Message: "That email does not exist" });
        console.log("Email does not exist");
      } else if (!isValidPassword(user.password, info.password)) {
        console.log("incorrect password");
        res.status(400).json({ Message: "incorrect password" });
      } else {
        res.status(200).json({ Message: "success", status: true });
      }
    })
    .catch(function (err) {
      console.log("Error:", err);
    });
}

async function fetchppm(req, res) {
  const { body, headers, method } = req;
  let output = [];
  let flag = 1;

  for (let i = 0; i < sdata[0].length; i++) {
    console.log("sdata", sdata[0][0].field2);

    if (sdata[0][i].field2 == "0") {
      const user = await irdac.findOne({
        where: { entry_id: sdata[0][i].entry_id },
      });

      let responsesss = { user: user, ppm: sdata[0][i].field1 };
      if (responsesss.user) {
        output.push(responsesss);
        console.log("responsesss", responsesss);
        if (responsesss.ppm * 3 >= 1500) {
          if(flag==1){
            client.messages
            .create({
              from: "+16203494005",
              body: "Reminder:your vehicle has crossed the threshold",
              to: "+916380535543",
            })
            .then((message) => console.log(message.sid));
            flag=0;
          }
         
        } else {
          console.log(false);
        }
      }
    } else {
      console.log("false");
    }
  }
  res.status(200).json(output);
}

async function addusers(req, res) {
  const { body, headers, method } = req;
  const { username, password } = body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username/password" });
  }

  let params = {
    username: username,
    password: password,
  };
  if (params.username.length && params.password.length) {
    Users.findOne({
      where: {
        username: params.username,
      },
    }).then(function (user) {
      if (user) {
        res.status(400).json({ Message: "That email is already taken" });
      } else {
        params.password = generateHash(params.password);
        const user = Users.create(params);
        res.status(200).json({ Message: "Successfully added user" });
      }
    });
  } else {
    res.status(300).json({ Message: "empty field" });
  }
}
const irdacaddusers = async (req, res) => {
  const { body, headers, method } = req;

  let info = {
    entry_id: req.body.entry_id,
    registration_number: req.body.registration_number,
    name: req.body.name,
    bank: req.body.bank,
    phone_number: req.body.phone_number,
    aadhar_number: req.body.aadhar_number,
  };

  const user = irdac.create(info);
  res.status(200).json({ Message: "Successfully added user" });
};

module.exports = {
  signin,
  fetchppm,
  addusers,
  irdacaddusers,
};
