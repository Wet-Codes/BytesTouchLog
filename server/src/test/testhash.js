const bcrypt = require('bcrypt-nodejs');

// Use the same salt rounds as the original hash
const saltRounds = 8;
const password = '2024BytesLog!';
const storedHash = '$2a$08$cRWeJSS8JdbLCzvXulOheOM7.NTQ488tMtMHyo46.MMk9WTSx7P9m'; // Example hash from logs

// Manually generate a new hash with consistent salt rounds
bcrypt.genSalt(saltRounds, function(err, salt) {
  if (err) throw err;

  bcrypt.hash(password, salt, null, function(err, newHash) {
    if (err) throw err;
    console.log('Manual hash:', newHash);

    // Compare the manually generated hash with the stored hash
    bcrypt.compare(password, storedHash, function(err, res) {
      if (err) throw err;
      console.log('Manual comparison result with stored hash:', res); // Should log 'true' if the hash matches the password

      // Compare the password with the newly generated hash to ensure hashing works correctly
      bcrypt.compare(password, newHash, function(err, res) {
        if (err) throw err;
        console.log('Manual comparison result with new hash:', res); // Should log 'true' if the hash matches the password
      });
    });
  });
});
