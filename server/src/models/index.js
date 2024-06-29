const fs = require ('fs') // acrediting file to the system
const path = require ('path') //paths conjuction
const Sequelize = require('sequelize') //Sequilize object connection to the db
const config = require('../config/config') //Config port

const db = {} //db object


//Object the Sequilize to Form the Model
const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options //this option for sequilize
)


//The Js way to acredite the file to the system
fs
    .readdirSync(__dirname)
    .filter((file) =>
    file !== 'index.js'
)

//reading config
.forEach((file) =>{
    //console.log("FILE IS ",file);
    //const model = sequelize.import(path.join(__dirname, file))
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
})

db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db