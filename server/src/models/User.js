module.exports = (sequelize, DataTypes) => 
// Defines the user contains, Email and Password
    sequelize.define('User', {
        username: {
         type: DataTypes.STRING,
         unique: true
        },
        password: DataTypes.STRING
    })
