const mongoose = require("mongoose")

const getConnection = () =>{
    mongoose.connect('mongodb://0.0.0.0:27017/chat')
    console.log("db connect ...")
}

module.exports = getConnection;