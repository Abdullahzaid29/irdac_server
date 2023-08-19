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
// var corOptions = {
//   origin:["https://irdai-dashboard.vercel.app","http://localhost:5000"],
//   credentials: true,
//   optionsSuccessStatus: 200
// }


// app.use(cors(corOptions))
app.use(cors({ origin: true }));
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://localhost:5000"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});
app.use(express.json())

app.use(express.urlencoded({ extended:true }))

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


const router = require('./routes/Router.js')
app.use('/api',router)

app.get("/",(req,res)=>{
res.json({Message:"Server is running on port 6000"})
})

const PORT = process.env.PORT 

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})