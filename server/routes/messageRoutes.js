const express = require('express');
const protect = require('../middleware/authMiddleware');
const { sendMessage, allMessage, getAllMessage } = require('../controller/messageController');

const router = express.Router();

router.post('/',protect,sendMessage)
router.get('/:chatId',protect,allMessage)
router.get('/get_all_message/data',protect,getAllMessage)

module.exports = router;