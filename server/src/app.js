
//Import Object
const express = require('express') // Web Server
//Request
const fileUpload = require('express-fileupload'); // ✅ File upload middleware
const bodyParser = require('body-parser')//JSON BODY REQUEST
const cors = require('cors') //API SECURE REQUEST
const morgan = require('morgan') //HTTP REQUEST DEBUG LOG

//Import folders
const config = require('./config/config')
const {sequelize} = require ('./models')




//use object

const app = express()
app.use(morgan('combined'))
app.use(fileUpload()); // ✅ Enable file uploads
//Increase Because its sucks
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

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
    
    app.listen(process.env.PORT || 2002, () => {
      console.log('SERVER STARTED ON PORT ' + config.port)
      console.log("")
      console.log("--Some Random Prep Info--")
    })
    setTimeout(() => {
      console.log("")
      console.log('             -READY TO START-');
  }, 2000);