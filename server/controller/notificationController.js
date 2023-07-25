const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const Notification = require("../model/notificationModel");

const sendNotification = catchAsyncError(async (req, res, next) => {
    const { _id, name } = req.user;
    const { messageData, receiver_id } = req.body;

    const newMessage = {
        sender_id: _id,
        receiver_id: receiver_id,
        names: name,
        messageData: messageData,
        time: new Date().getHours() + ":" + new Date().getMinutes(),
    }
    const data = await Notification.findOne({ sender_id: _id, receiver_id: receiver_id, status: true })
    if (data) {
        await Notification.findByIdAndUpdate({ _id: data._id },
            { $push: { "messageData": messageData } })
        res.status(200).json({
            success: true,
            message: "update success",
        })
    } else {
        const message = await Notification.create(newMessage);
        res.status(200).json(message)
    }

})


const allNotification = catchAsyncError(async (req, res, next) => {
    const message = await Notification.find({ receiver_id: req.user._id, status: true })
    res.status(200).json({
        success: true,
        data: message
    })
})

const getNotificationById = catchAsyncError(async (req, res, next) => {
    const id = req.params._id;
    const message = await Notification.findById({ _id: id })
    res.status(200).json({
        success: true,
        data: message
    })
})

const deleteNotification = catchAsyncError(async (req, res, next) => {
    const { _id } = req.params;
    const info = {
        status: false
    }
    const notification = await Notification.findById(_id)
     if(notification && !null){
        await Notification.findByIdAndUpdate({_id}, info)
        res.status(200).json({
            success: true,
            message: "delete success",
        })
     }
     else{
        return next(new ErrorHandler('notifacation not found ',404))
     }
       
})

module.exports = { sendNotification, allNotification, deleteNotification, getNotificationById }