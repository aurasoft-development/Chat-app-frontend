const express = require("express");
const protect = require("../middleware/authMiddleware");
const { sendNotification, allNotification, deleteNotification,getNotificationById } = require("../controller/notificationController");

const router = express.Router();

router.post("/send_notification",protect,sendNotification);
router.get('/get_notification',protect,allNotification);
router.get('/get_notification_by_id/:_id',protect,getNotificationById)
router.delete('/delete_notification/:_id',protect,deleteNotification);

module.exports = router;