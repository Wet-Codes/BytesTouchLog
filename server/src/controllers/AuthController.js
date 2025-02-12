const { User } = require('../models');

module.exports = {
    async Login(req, res) {
        try {
            const { username, password } = req.body; // Get username and password from request
            const user = await User.findOne({ where: { username } });
            //console.log('User object:', user); // Log the user object

            //console.log('Password valid:', isPasswordValid); /debbug
            
            if (!user) {
                return res.status(403).send({
                    error: 'Unrecognized Username'
                });
            }  

            //console.log('Comparing password:', password); // Log the entered password
            //console.log('Stored hashed password:', user.password);

            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                //console.log('Invalid password for user:', username);
                return res.status(403).send({
                    error: 'The username and password do not match'
                });
            }

            const userJson = user.toJSON();
            res.send({
                user: userJson
            });
        } catch (err) {
            console.error('Error comparing password:', err);
            console.error('Error occurred while logging in', err);
            res.status(500).send({
                error: 'An error has occurred'
            });
        }
    }
};
