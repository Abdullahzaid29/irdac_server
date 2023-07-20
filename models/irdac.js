module.exports = function (sequelize, Sequelize) {

    var irdac = sequelize.define('irdac', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        entry_id: {
            type: Sequelize.STRING,
            allowNull: false

        },
        registration_number: {
            type: Sequelize.STRING,
            allowNull: false

        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        bank: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        aadhar_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        }
        
    });

    return irdac;

}
