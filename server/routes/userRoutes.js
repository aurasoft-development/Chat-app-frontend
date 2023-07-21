const express = require("express");
const {registerUser, authUser, getAllUser, checkLogin} = require("../controller/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register",registerUser);
router.post('/login',authUser);
router.get('/getalluser',protect,getAllUser);
module.exports = router;