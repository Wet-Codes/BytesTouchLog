const { User } = require('./models'); // Ensure this is after sequelize is initialized
const express = require('express'); // Web Server
const fileUpload = require('express-fileupload'); // ✅ File upload middleware
const bodyParser = require('body-parser'); // JSON BODY REQUEST
const cors = require('cors'); // API SECURE REQUEST
const morgan = require('morgan'); // HTTP REQUEST DEBUG LOG
const path = require('path');
const http = require('http'); // ✅ HTTP server for Socket.IO
const socketIo = require('socket.io'); // ✅ Socket.IO
// Import folders
const config = require('./config/config');
const { sequelize } = require('./models');

// ✅ Initialize app first
const app = express();

// ✅ Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ✅ Attach io to app for access in routes/controllers if needed
app.set('io', io);

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

sequelize.sync().then(async () => {
  try {
    const userCount = await User.count();

     const adminExists = await User.findOne({ where: { role: 'admin' } });

    if (userCount === 0 && !adminExists) {
      await Promise.all([
        User.create({
          username: 'admin',
          password: '140670BT@!',
          role: 'admin'
        }),
        User.create({
          username: 'user',
          password: 'userpass123',
          role: 'user'
        }),
         User.create({
          username: 'dev',
          password: '140670D3v0nly',
          role: 'user'
        })
      ]);

      console.log('[✔] Admin user created: username = admin, password = (Contact Aiman for this part) BT@!');
    }

    const finalUserCount = await User.count();
    console.log(`[✔] Total users in database: ${finalUserCount}`);
  } catch (err) {
    console.error('[✖] Error while initializing admin user:', err);
  }
});

console.log('Back End Start (SYNCING)');

server.listen(2002, '0.0.0.0', () => {
  console.log('SERVER STARTED ON PORT ' + config.port);
  console.log('');
  console.log('--Some Random Prep Info--');
});


setTimeout(() => {
  console.log('');
  console.log('             -READY TO START-');
}, 2000);
