const Promise = require('bluebird');//
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));//

// Function to hash the password 
function hashPassword(user) {
    const SALT_FACTOR = 8;

    if (!user.changed('password')) {
        return;
    }

   console.log('Hashing password:', user.password); // Log password before hashing

    return bcrypt
    .genSaltAsync(SALT_FACTOR)
    .then(salt => {
       // console.log('Generated salt:', salt); // Log the salt
        return bcrypt.hashAsync(user.password, salt, null)
    })
    .then(hash => {
       console.log('Generated hash:', hash); // Log the hash
        user.setDataValue('password', hash);
    });
}

module.exports = (sequelize, DataTypes) => {
    // Update User model with new fields
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    password: DataTypes.STRING,
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
    },
    isEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword
    }
});

    // Correctly comparing the password
   User.prototype.comparePassword = function(password) {
  // Add validation and logging
  if (typeof password !== 'string' || !this.password) {
    console.error('Invalid comparison:', {
      inputType: typeof password,
      hashExists: !!this.password
    });
    return Promise.resolve(false);
  }

  console.log('Comparing:', {
    input: password,
    hash: this.password.substring(0, 10) + '...'
  });

  return bcrypt.compareAsync(password, this.password)
    .catch(err => {
      console.error('BCrypt error:', err);
      return false;
    });
};

    return User;
};
