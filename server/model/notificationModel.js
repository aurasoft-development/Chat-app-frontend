const mongoose = require('mongoose')

const notificationModel = mongoose.Schema(
    {
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
        sender_id: { type: String },
        receiver_id: { type: String },
        names: { type: String },
        messageData: { type: Array, "default": [] },
        status:{type:Boolean,
        default : true
        },
        time: {
            type: String,
            default: new Date().getHours() + ":" + new Date().getMinutes(),
        },
    },

    {
        timestamps: true
    }
)

const Notification = mongoose.model("Notification", notificationModel);
module.exports = Notification;