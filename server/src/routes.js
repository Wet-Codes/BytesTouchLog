const Authcontroller = require ('./controllers/AuthController.js')
const { ValidateLogin } = require ('./policies/AuthPolicy.js')
const express = require('express');
const fileUpload = require('express-fileupload');
const studentController = require('./controllers/AuthUpload');
const FingerprintController = require('./controllers/FingerprintController');
const authMiddleware = require('./middlewares/authMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');


const app = express();
//Upload handling
app.use(fileUpload());

//login controller
module.exports = (app) =>{
     
     app.post('/',
          ValidateLogin,
          Authcontroller.Login
          );
// validation token          
     app.post('/api/users', 
          authMiddleware, 
          adminMiddleware, 
          Authcontroller.createAccount);     
     app.get('/api/me', 
          authMiddleware,
          Authcontroller.validateToken
          );
//AccountManagement
 app.post('/api/users', 
        authMiddleware, 
        adminMiddleware,
        Authcontroller.createAccount
    );
//Student Model Upload controller
     app.get('/students', studentController.getAllStudents);
     app.post('/students', studentController.createStudent);
     app.put('/students/:id', studentController.updateStudent);
     app.delete('/students/:id', studentController.deleteStudent);

//Upload Controller
     app.post('/students/upload', studentController.upload);

//FingerPrint Controller
     app.post("/fingerprint/upload", FingerprintController.uploadFingerprint);
     app.post("/fingerprint/authorize", FingerprintController.authorizeFingerprint);
     app.post("/fingerprint/scan", FingerprintController.scanFingerprint);
}