const { DataTypes } = require("sequelize");

module.exports = (sequelize,Sequelize)=>{
    var clientusers = sequelize.define("clientusers",{
        id:{
            autoIncrement: true,
            primaryKey:true,
            type:Sequelize.INTEGER
        },
        name:{
            type:Sequelize.STRING,
            allowNull: false
        },
        email:{
            type: Sequelize.STRING,
            allowNull:false
        },
        password:{
            type: Sequelize.STRING,
            allowNull:false
        },
        phonenumber:{
            type:Sequelize.STRING,
            allowNull:false
        }
    }    
    );
    return clientusers
}