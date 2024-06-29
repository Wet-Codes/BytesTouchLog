console.log('IT WORKED')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

//OBTAINING 
const config = require('./config/config')
const {sequelize} = require ('./models')




const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)


//SYNCING
sequelize.sync()
    .then (() => {
        app.listen(process.env.PORT || 2002)
        console.log('SERVER STARTED ON PORT '+ config.port)

    })

//Test connection
    sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });