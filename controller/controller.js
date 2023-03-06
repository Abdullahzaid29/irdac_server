var bCrypt = require("bcryptjs");
const model = require("../models");
const userppm = require('./ppmstatus')
const Users = model.users;
const irdac = model.irdac;

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

 async function  fetchppm (req, res) {
  const { body, headers, method } = req;
   let output = []
 
  for (let i = 0; i < userppm.ppm.length; i++) {
                if (userppm.ppm[i].status) {
                    const user = await irdac.findOne({
                        where: {  registration_number: userppm.ppm[i].registration_no, },
                      });
                   let  responsesss = {user:user,ppm:userppm.ppm[i].ppm}
                   output.push(responsesss)
                } else {
                    console.log("false");
                }
               
  }
  res.status(200).json( output );
  };


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
    irdacaddusers
  };