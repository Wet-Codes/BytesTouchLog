const express = require('express'); // Web Server
const fileUpload = require('express-fileupload'); // ✅ File upload middleware
const bodyParser = require('body-parser'); // JSON BODY REQUEST
const cors = require('cors'); // API SECURE REQUEST
const morgan = require('morgan'); // HTTP REQUEST DEBUG LOG
const path = require('path');

// Import folders
const config = require('./config/config');
const { sequelize } = require('./models');

// ✅ Initialize app first
const app = express();

// ✅ Middleware setup
app.use(morgan('combined'));
app.use(fileUpload());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());

// ✅ Your API routes
require('./routes')(app);

// ✅ Serve Vue frontend (after app is defined!)
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ✅ Database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// ✅ Sync DB
sequelize.sync();

console.log('Back End Start (SYNCING)');

app.listen(2002, '0.0.0.0', () => {
  console.log('SERVER STARTED ON PORT ' + config.port);
  console.log('');
  console.log('--Some Random Prep Info--');
});

setTimeout(() => {
  console.log('');
  console.log('             -READY TO START-');
}, 2000);
