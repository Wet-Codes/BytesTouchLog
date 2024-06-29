const {User} = require('../models')
module.exports = {
    async login (req, res) {
        
        try{
            const {username, password} = req.body //searching the db if username, password exists
            const user = await User.findOne({ 
                where: {
                    username: username //if the username is correct
                }
            })
            if(!user) { //if not then error
                res.status(403).send({
                    error:'Unrecognized Username'
                })
            }

            const isPasswordValid = password === user.password
            if (!isPasswordValid) {
                return res.status(403).send({
                    error: 'the username and password does not match'
                })
            }

            const userJson = user.toJSON()
            res.send({
                user: userJson
            })

        } catch (err) {
            console.error('Error occurred while creating user:', err);
            res.status(500).send({
                error: 'An Error has Occurred'
            })
          }


    }
} 