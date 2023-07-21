const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const Message = require('../model/messageModel');
const User = require("../model/userModel");
const Chat = require("../model/chatModel");

const sendMessage = catchAsyncError(async (req, res, next) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        return next(new ErrorHandler(`Invalid data passed into request`, 400))
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
        time: new Date().getHours() + ":" + new Date().getMinutes(),
    }
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
        path: "chat,users",
        select: "name pic email"
    })
    await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
    })
    // io.emit('message', req.body);
    res.status(200).json(message)

})

const allMessage = catchAsyncError(async (req, res, next) => {
    const message = await Message.find({ chat: req.params.chatId },)
        .populate("sender", "name pic email")
        .populate("chat");
    res.json(message)
})

const getAllMessage = catchAsyncError(async (req, res, next) => {

    // show All Message Date Wise : ex:  8-05-2023

    const messages = await Message.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            messages: { $push: "$$ROOT" }
          }
        },
        { $sort: { _id: -1 } }
      ]);
      res.status(200).json({
        success:true,
        data: messages
      })

    //show Message  time wise ex: 5:30 ago

    //     const messages = await Message.aggregate([
    //         {
    //           $project: {
    //             hour: { $hour: "$createdAt" },
    //             minute: { $minute: "$createdAt" },
    //             second: { $second: "$createdAt" },
    //             message: "$$ROOT"
    //           }
    //         },
    //         {
    //           $group: {
    //             _id: {
    //               hour: "$hour",
    //               minute: "$minute"
    //             },
    //             messages: { $push: "$message" }
    //           }
    //         },
    //         { $sort: { "_id.hour": 1, "_id.minute": 1, "_id.second": 1 } }
    //       ]);
    //       res.status(200).json({
    //             success:true,
    //             data: messages
    //           })

})

module.exports = { sendMessage, allMessage, getAllMessage }