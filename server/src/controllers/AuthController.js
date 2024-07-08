const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config.js')

function jwtSignUser(user) {
    const I_week = 60* 60 * 24 * 7
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: I_week
    }) 
}



module.exports = {


    //REGISTER
    //async register(res, req){
    //   try{
    //        const user = await User.create(req.body)
    //        res.send(user.toJSON())
    //    } catch (error){
    //        console.error('an error has occurred', error);
    //        res.status(400).send({
    //            error: 'The Username is already used' 
    //        })
    //    }
    //},

    //LOGIN
    async Login (req, res) {

        try{
            const {username, password} = req.body //searching the db if username, password exists
            const user = await User.findOne({ 
                where: {
                    username: username //if the username is correct
                }
            })
            if(!user) { //if not then error
               return res.status(403).send({
                    error:'Unrecognized Username'
                })
            }

            const isPasswordValid = await user.comparePassword(password)
            if (!isPasswordValid) { 
                return res.status(403).send({
                    error: 'the username and password does not match'
                })
            }

            const userJson = user.toJSON()
            res.send({
                user: userJson,
                token: jwtSignUser(userJson)
            })

        } catch (err) {
            console.error('Error occurred while logging in', err);
            res.status(500).send({
                error: 'An Error has Occurred'
            })
          }


    }
} 