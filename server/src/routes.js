const Authcontroller = require ('./controllers/AuthController.js')
const { ValidateLogin } = require ('./policies/AuthPolicy.js')
const express = require('express');
const fileUpload = require('express-fileupload');
const studentController = require('./controllers/AuthUpload');

const app = express();
//Upload handling
app.use(fileUpload());

//login controller
module.exports = (app) =>{
     app.post('/',
          ValidateLogin,
          Authcontroller.Login
          );
//Student Model Upload controller
     app.get('/students', studentController.getAllStudents);
     app.post('/students', studentController.createStudent);
     app.put('/students/:id', studentController.updateStudent);
     app.delete('/students/:id', studentController.deleteStudent);

//Upload Controller
     app.post('/students/upload', studentController.upload);
}