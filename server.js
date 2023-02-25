const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const morgan = require("morgan")
var models = require("./models");
const app = express()
dotenv.config({path:"config/config.env"})
var corOptions = {
    origin:"http://localhost:8001",
    credentials: true,
}
models.sequelize.sync()
    .then(function () {
        console.log('Nice! Database looks fine')
    }).catch(function (err) {
        console.log(err, "Something went wrong with the Database Update!")
});

app.use(morgan('tiny'))

app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({ extended:true }))

const router = require('./routes/userRouter.js')
app.use('/api/users',router)

app.get("/",(req,res)=>{
res.json({Message:"Server is running on port 8000"})
})

const PORT = process.env.PORT 

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})