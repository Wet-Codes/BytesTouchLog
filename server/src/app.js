
//Import Object
const express = require('express') // Web Server
//Request
const bodyParser = require('body-parser')//JSON BODY REQUEST
const cors = require('cors') //API SECURE REQUEST
const morgan = require('morgan') //HTTP REQUEST DEBUG LOG

//Import folders
const config = require('./config/config')
const {sequelize, User} = require ('./models')




//use object
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)

//Test connection
sequelize.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});



//sequelize.drop().then(() => {
//  console.log('Dropped all tables');
//  return sequelize.sync();
//})
console.log('Back End Start (SYNCING)')

//SYNCING
sequelize.sync()
   .then(
    async () => {

      try {
        // Logging to verify model import
        //console.log('User model:', User);
        //console.log('User methods:', Object.getOwnPropertyNames(User));
        //console.log('Sequelize models:', sequelize.models);
        //console.log(User === sequelize.models.User); // Should log `true`
        
        
        const existingUser = await User.findOne({ where: { username: 'admin'} });
        if (existingUser) {
          await existingUser.destroy();
          console.log('Existing user destroyed');
        }
         await User.create({ username: 'admin', password: '2024BytesLog!' });
        //console.log('New user created with hashed password:', newUser.password);
       //console.log('Database synced and default user created');
      } catch (error) {
        console.error('Error checking or creating default user:', error);
      }
    });
    
    app.listen(process.env.PORT || 2002, () => {
      console.log('SERVER STARTED ON PORT ' + config.port)
    })
