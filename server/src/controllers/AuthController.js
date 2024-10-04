const { User } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

function jwtSignUser(user) {
    const I_week = 60 * 60 * 24 * 7;
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: I_week
    });
}

module.exports = {
    async Login(req, res) {
        try {
            const { username, password } = req.body; // Get username and password from request
            const user = await User.findOne({ where: { username } });

            if (!user) {
                //console.log('User not found:', username); // Log if user is not found
                return res.status(403).send({
                    error: 'Unrecognized Username'
                });
            }

            const isPasswordValid = await user.comparePassword(password);
            //console.log(`Password valid: ${isPasswordValid}`); // Log if password is valid

            if (!isPasswordValid) {
                return res.status(403).send({
                    error: 'The username and password do not match'
                });
            }

            const userJson = user.toJSON();
            res.send({
                user: userJson,
                token: jwtSignUser(userJson)
            });
        } catch (err) {
            console.error('Error occurred while logging in', err);
            res.status(500).send({
                error: 'An error has occurred'
            });
        }
    }
};
