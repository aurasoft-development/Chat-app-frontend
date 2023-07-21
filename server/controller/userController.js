const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const User = require('../model/userModel')
const generateToken = require('../dbconnection/generateToken')
const bcrypt = require('bcrypt')

const registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler(`Please Enter all the Feilds`, 400))
    }
    else {
        const userExists = await User.findOne({ email })
        if (userExists) {
            return next(new ErrorHandler(`User already exits`, 400))
        } else {
            const user = await User.create({
                name,
                email,
                password,
                pic
            })
            if (user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    pic: user.pic,
                    token: generateToken(user._id),
                })
            }
            else {
                return next(new ErrorHandler(`user not found`, 404))
            }
        }

    }
});

const authUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    } else {
        return next(new ErrorHandler(`Invalid Email or Password`, 404))
    }
})


const getAllUser = catchAsyncError(async (req, res, next) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    }
        : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
})

module.exports = { registerUser, authUser, getAllUser };