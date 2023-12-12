require("dotenv").config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;

db.on('err',console.error.bind(console, 'err'));

db.once('open',function(error){
    if(error){
        console.log(`Error in connecting to MongoDb : ${error}`);
        return;
    }
    console.log(`Connection to MongoDb successfull!!`);
})

module.exports = db;
