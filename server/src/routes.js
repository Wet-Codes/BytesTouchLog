const AuthController = require ('./controllers/AuthController.js')
module.exports = (app) =>{
    app.post('/', AuthController.login)
} 