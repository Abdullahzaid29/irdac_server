var bCrypt = require("bcryptjs");
const model = require("../models");
const clientusers = require("../models/clientusers");
const clientusers = model.clientusers;
const generateHash = function(password){
    return bCrypt.hashSync(password,bCrypt.genSaltSync(8),null)
}

const add_clientusers = async(req,res) => {
    let repassword = req.body.password;
   
    let client_info ={
        id : req.body.id;
        name :req.body.name;
        email: req.body.email;
        password: req.body.password;
        phonenumber : req.body.phonenumber
    }

    if(
        client_info.name.length &&
        client_info.email.length &&
        client_info.phonenumber.length &&
    ){
        if(client_info.password === repassword)
        {
            clientusers.findOne(
                {where: {
                    email : client_info.email
                }},
            )
            .then(function(user){
                if(user){
                    res.status(300).json({ Message: "That email is already taken" });
                }else{
                    client_info.password= generateHash(client_info.password);
                    const  clientusers = clientusers.create(client_info);
                    res.status(200).json({Message: "New User has been created"});

                }
            });
        }else{
            res.status(400).json({Message: "Password doesn't match"});
        }
    }
    else{
        res.status(300).json({Message:"Empty Field"});
    }
}
module.exports={add_clientusers,
};