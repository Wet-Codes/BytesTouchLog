const Authcontroller = require ('./controllers/AuthController.js')
const { ValidateLogin } = require ('./policies/AuthPolicy.js')
const express = require('express');
const fileUpload = require('express-fileupload');
const studentController = require('./controllers/AuthUpload');
const FingerprintController = require('./controllers/FingerprintController');
const EventController = require('./controllers/EventController');
const authMiddleware = require('./middlewares/authMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');
const fineController = require('./controllers/FineController')
const HistoryController = require('./controllers/HistoryController');
const NoteController = require('./controllers/NoteController');
const DashboardController = require('./controllers/DashboardController');

const app = express();


// Add these lines before any routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
//Upload handling
app.use(fileUpload());





module.exports = (app) =>{

     //history logs
    app.post('/api/history/record-login', 
  authMiddleware,
  HistoryController.recordLogin
);

app.post('/api/history/record-logout', 
  authMiddleware,
  HistoryController.recordLogout
);

app.get('/api/history/login-logs', 
  authMiddleware,
  HistoryController.getLoginLogs
);

app.get('/api/history/session-logs', 
  authMiddleware,
  HistoryController.getFullSessionLogs
);


//login controller
app.post('/api/history/record-logout', 
  authMiddleware,
  (req, res) => HistoryController.recordLogout(req, res)
);
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
    app.get('/api/users', 
      authMiddleware, 
      adminMiddleware,
      Authcontroller.getAllAccounts
     );
     
//dev verification
     app.post('/api/verify-dev',
          authMiddleware,
  Authcontroller.verifyDevPassword
);

app.put('/api/users/:id/status', 
     authMiddleware, 
     adminMiddleware,
     Authcontroller.toggleAccountStatus
     );

app.put('/api/users/:id', 
     authMiddleware, 
     adminMiddleware,
     Authcontroller.updateAccount
     );
    // Student routes
     app.get('/students', studentController.getAllStudents);
     app.post('/students', studentController.createStudent);
     app.post('/students/upload', authMiddleware ,studentController.upload);
     app.post('/student/enrollexist', studentController.EnrollExist, )
     app.put('/students/:id/api', studentController.updateStudent);
     app.delete('/students/clear', studentController.clearStudents);
// Event routes
app.get('/events', EventController.getAllEvents);
app.post('/events', EventController.createEvent);
app.put('/events/:eventId', EventController.updateEvent);




app.post('/fingerprint/enroll', FingerprintController.enroll);

app.post('/fingerprint/identify', FingerprintController.identify);
app.post('/fingerprint/identify2', FingerprintController.identify2);
app.get('/fines/student/:studentId', fineController.getStudentFines);
app.delete('/fines/:id', fineController.deleteFine);

app.get('/attendance/:eventId', fineController.getAttendanceForEvent);
app.put('/attendance', fineController.updateAttendance);

app.get('/fines/student/:studentId', fineController.getStudentFines);
app.put('/fines/student/:studentId/clear', fineController.clearStudentFines);


//Notes

app.post('/api/notes', 
  authMiddleware,
  NoteController.createNote
);

app.get('/api/notes', 
  authMiddleware,
  NoteController.getAllNotes
);

app.post('/api/notes/mark-read', 
  authMiddleware,
  NoteController.markAsRead
);

//Payment logs

 app.post('/api/history/record-payment', 
    authMiddleware,
    HistoryController.recordPayment
  );

 app.get('/api/history/payment-logs', 
  authMiddleware,
  (req, res) => HistoryController.getPaymentLogs(req, res) // Proper invocation
);



//Graph


  app.get('/api/dashboard/fines-distribution', DashboardController.getFinesDistribution);
  app.get('/api/dashboard/fines-over-time', DashboardController.getFinesOverTime);
  app.get('/api/dashboard/attendance-by-course', DashboardController.getAttendanceByCourse);
  app.get('/api/dashboard/student-distribution', DashboardController.getStudentDistribution);
}