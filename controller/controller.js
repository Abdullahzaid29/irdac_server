var bCrypt = require("bcryptjs");
const axios = require("axios");
const jwt = require('jsonwebtoken');

const admin = require('firebase-admin');

const db = admin.database();

let sdata = [];
let token = []

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
var generateHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

async function signin(req, res) {

  let info = {
    username: req.body.username,
    password: req.body.password,
  };
  console.log(info.username);
  // const password =  req.body.password
  if (!info.username || !info.password) {
    return res.status(400).json({ message: "Missing username/password" });
  }
  admin.auth().getUserByEmail(info.username,info.password)
  .then((userRecord) => {
    // Authenticate the user using their password
   token.push(jwt.sign({ userId:userRecord.uid }, 'your-secret-key', {  expiresIn: '1h'}))

    return admin.auth().createCustomToken(userRecord.uid);
  })
  .then((customToken) => {
    res.status(200).json({ Message: "success", status: true,token:token.toLocaleString() });
    console.log('Custom token:', customToken);
    // console.log("token",token);
  })
  .catch((error) => {
    console.error('Error fetching user data:', error);
    res.status(400).json({ Message: "That email does not exist" });
  });

}

const forgotpassword = async(req, res)=>{
  if (!req.body.username) {
    return res.status(400).json({ message: "Missing username/password" });
  }
  admin.auth().generatePasswordResetLink(req.body.username)
  .then((link) => {
    res.status(200).json({ Link: link });

    console.log('Password reset link:', link);
    // Send the link to the user's email for password reset
  })
  .catch((error) => {
    res.status(400).json({ Message: "Error generating password reset link:" });

    // console.error('Error generating password reset link:', error);
  });
}

async function fetchppm(req, res) {
  const data = axios.get("https://thingspeak.com/channels/2237374/feed.json");
  function retrieveData(ref) {
    return new Promise((resolve, reject) => {
      ref.once('value')
        .then(snapshot => {
          resolve(snapshot.val());
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  const parentRef = db.ref('irdai');
  const dbdata = async (ppm)=>{
    try {
      
        const data =  await retrieveData(parentRef);
        // console.log(
        //   JSON.stringify(data, null, 2)
        // );
      let result = JSON.stringify(data, null, 2);
       result =JSON.parse(result)
      let response = { user: result, ppm: ppm};
      res.status(200).json([response]);
      

    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }

  }
  try {
      await  axios.get("https://thingspeak.com/channels/2237374/feed.json").then((response) => {
      console.log(response.data.feeds.length);
      let fetchdata = response.data.feeds;
      let length = fetchdata.length;
      let ppm = [];
      let sum = 0;
      let flag = false;
      let i =0;
      // for (let i = 0; i < fetchdata.length; i++) {
      // //  console.log(response.data.feeds[1].field1);
      // //  console.log( parseInt(fetchdata[i].field1));
      //  if (fetchdata[i].field1) {
      //  sum = sum + parseInt(fetchdata[i].field1);
        
      //  }
      // }
      const usersRef = db.ref('sms');
    const newUserRef = usersRef.push();
      console.log("before loop  twilio",flag);

      // if(fetchdata[i].entry_id){
          
  
      //     console.log("twilop sss");
      //     flag = true;
      // }
     for (let i = 0; i < fetchdata.length; i++) {
      if(fetchdata[i].entry_id == i+1 && fetchdata[i].field1 && fetchdata[i].field1 !=0 ){
        console.log("inside twilio",fetchdata[i].entry_id);
        flag = true;
  //       newUserRef.set(1)
  // .then(() => {
  //   console.log('Data appended successfully');
  // })
  // .catch((error) => {
  //   console.error('Error appending data:', error);
  // });
        break
      }
     }
     if(flag){
      client.messages
      // .create({
      //   from: "+16203494005",
      //   body: "Reminder:your vehicle has crossed the threshold",
      //   to: '+919025650110'
      // })
      // .then((message) => console.log(message.sid));
      console.log("twilio works");
     }
     if(fetchdata.length){
      dbdata(fetchdata[length-1].field1)
    }else{
      
      dbdata(0)
      // res.status(200).json("no data");
    }
      // console.log(fetchdata[length-1].field1);
      // console.log(sum);
      // if(flag){
      //   dbdata(fetchdata[length-1].field1)
      // }
      // let apidata = response.data.feeds;
      // sdata.push(apidata);
      // setData(response.data)
    
    });
  } catch (err) {
    console.log("pages auth in error");
    console.log(err,"errot  mmsmosk");
  }
  const { body, headers, method } = req;
  let output = [];
  let flag = 1;

  // Reference to a specific node in the database
 
  
  // Read data from the database
 
 
  // for (let i = 0; i < sdata[0].length; i++) {
  //   console.log("sdata", sdata[0][0].field2);

  //   if (sdata[0][i].field2 == "0") {
  //     const user = await irdac.findOne({
  //       where: { entry_id: sdata[0][i].entry_id },
  //     });

  //     let responsesss = { user: user, ppm: sdata[0][i].field1 };
  //     if (responsesss.user) {
  //       output.push(responsesss);
  //       console.log("responsesss", responsesss);
  //       // if (responsesss.ppm * 3 >= 1500) {

  //       //     flag=0;
  //       //   }
         
  //       // } else {
  //       //   console.log(false);
  //       // }
  //     }
  //   } else {
  //     console.log("false");
  //   }
  // }
}

async function distraction(req, res) {
let response = req.body.count;
res.status(200).json({ message: response });

}
module.exports = {
  signin,
  fetchppm,
  forgotpassword,
  distraction
};
