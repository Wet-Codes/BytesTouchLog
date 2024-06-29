console.log('IT WORKED')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.post('/', (req, res) => {
    res.send({
         message: 'Hi ' + req.body.U + ', This is the 1st week just started!!'
    })

})

app.listen(process.env.PORT || 2002)