const Promise = require('bluebird');//
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));//

// Function to hash the password 
function hashPassword(user) {
    const SALT_FACTOR = 8;

    if (!user.changed('password')) {
        return;
    }

   // console.log('Hashing password:', user.password); // Log password before hashing

    return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => {
       // console.log('Generated salt:', salt); // Log the salt
        return bcrypt.hashAsync(user.password, salt, null)
    })
    .then(hash => {
       // console.log('Generated hash:', hash); // Log the hash
        user.setDataValue('password', hash);
    });
}

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING,
    }, {
        hooks: {
            beforeCreate: hashPassword,
            beforeUpdate: hashPassword
        }
    });

    // Correctly comparing the password
    User.prototype.comparePassword = function(password) {
       // console.log('Comparing entered password:', password); // Log entered password
       // console.log('With stored hashed password:', this.password); // Log stored hash
        return bcrypt.compareAsync(password, this.password);
    };

    return User;
};
