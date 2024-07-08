const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

// for hashing the password 
function hashPassword (user //,options    
) {
    const SALT_FACTOR = 8

    if(!user.changed('password')){
        return;
    }

    return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => bcrypt.hashAsync(user.password, salt, null))
    .then(hash =>{
        user.setDataValue('password', hash)
    })
}

//start of user model
module.exports = (sequelize, DataTypes) => {

// Defines the user contains, username and Password
    const User = sequelize.define('User', {
        username: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true
        },
        password:  DataTypes.STRING,
        allowNull: false
 
    },// const user
        { //hashing the password
            hooks:{
                beforeCreate: hashPassword,
                beforeUpdate: hashPassword,
                beforeSave: hashPassword
            }
    }) 

//Encrypting the password  (hashing the password)
    User.prototype.comparePassword = function (password) {
        return bcrypt.compareAsync(password, this.password)
    }
    return User
}
