const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require('../middleware/multermiddleware.js');
const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorhandler");
const generateToken = require("../dbconnection/generateToken");

const router = express.Router();


router.post("/upload", upload.single("pic"), async (req, res,next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ErrorHandler(`Please Enter all the Feilds`, 400))
    }
    const userExists = await User.findOne({ email })
    if (userExists) {
        return next(new ErrorHandler(`User already exits`, 400))
    }
    const imageData = {
        name,
        email,
        password,
        pic:req.file.filename
    }
    const user = await User.create(imageData)
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    }
    return next(new ErrorHandler(`user not found`, 404))
});

module.exports = router;