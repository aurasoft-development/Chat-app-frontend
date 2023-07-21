const  ErrorHandler = require("../utils/errorhandler.js");

const Error = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "internal Server Error";
    
    res.status(error.statusCode).json({
        resCode: error.statusCode,
        message: error.message,
    })

}
module.exports = Error;