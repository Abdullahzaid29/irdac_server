const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const morgan = require("morgan")

// var models = require("./models");
const app = express()
dotenv.config({path:"config/config.env"})
// var corOptions = {
//     origin:"http://localhost:5000",
//     credentials: true,
//     methods: 'GET,PUT,POST,DELETE',   // List of allowed HTTP methods
//     optionsSuccessStatus: 200
// }
const corOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

// models.sequelize.sync()
//     .then(function () {
//         console.log('Connected to Database!!')
//     }).catch(function (err) {
//         console.log(err, "Something went wrong with the Database Update!")
// });

const admin = require('firebase-admin');

const serviceAccount = require('./service_key/irdai-server-firebase-adminsdk-gtnv6-b5e0cebc8f.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://irdai-server.firebaseio.com'
});

app.use(morgan('tiny'))

app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({ extended:true }))

const router = require('./routes/Router.js')
app.use('/api',router)

app.get("/",(req,res)=>{
res.json({Message:"Server is running on port 6000"})
})

const PORT = process.env.PORT 

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})