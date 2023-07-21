const catchAsyncError = require("../middleware/catchAsyncError");
const Chat = require('../model/chatModel');
const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorhandler");
const accessChat = catchAsyncError(async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId params not sent with request")
        return res.sendStatus(400);
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    })
        .populate("users", "-password")
        .populate('latestMessage');

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    })
    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData)

            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            )
            res.status(200).send(FullChat);

        } catch (error) {
            res.status(400);
            return next(new ErrorHandler(error.message))
        }
    }
})

const fetchChats = catchAsyncError(async (req, res, next) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ update: -1 })
        .then(async (result) => {
            result = await User.populate(result, {
                path: "latestMessage.sender",
                select: 'name pic email',
            })
            res.send(result)
        })
})

const createGroupChat = catchAsyncError(async (req, res, next) => {
    if (!req.body.users || !req.body.name) {
        return next(new ErrorHandler(`Please Fill all the feilds`, 400))
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return next(new ErrorHandler(`More then 2 users are required to from a group chat`, 400))
    }
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        res.status(200).json(fullGroupChat)
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

const renameGroup = catchAsyncError(async (req, res, next) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findOneAndUpdate(chatId, { chatName },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!updatedChat) {
        return next(new ErrorHandler(`Chat not found`, 404))
    } else {
        res.json(updatedChat);
    }
})

const addToGroup = catchAsyncError(async (req, res, next) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        },
        {
            new: true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!added) {
        return next(new ErrorHandler(`Chat Not Found`, 404))
    } else {
        res.json(added)
    }
})
const removeFromGroup = catchAsyncError(async (req, res, next) => {
    const { chatId, userId } = req.body;
    const remove = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId }
        },
        {
            new: true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!remove) {
        return next(new ErrorHandler(`Chat Not Found`, 404))
    } else {
        res.json(remove)
    }
})
module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup };
