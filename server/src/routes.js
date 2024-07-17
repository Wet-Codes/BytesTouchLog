const Authcontroller = require ('./controllers/AuthController.js')
const { ValidateLogin } = require ('./policies/AuthPolicy.js')


module.exports = (app) =>{
     app.post('/',
          ValidateLogin,
          Authcontroller.Login)
}