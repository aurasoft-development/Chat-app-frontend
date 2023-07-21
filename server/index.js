const express = require("express");
const getConnection = require("./dbconnection/index");
const userRoutes = require('./routes/userRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js')
const multerRoutes = require('./routes/multerRouters.js')
const Error = require("./middleware/error.js");
const cors = require('cors');
const bodyParser = require("body-parser");
getConnection()
const app = express();

// cros middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('uploads'));
app.use('/images', express.static('uploads'));

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/notification' , notificationRoutes)
app.use('/api/multer',multerRoutes)

//middleware for error
app.use(Error);


const server = app.listen(5000, () => {
  console.log(`server is started Localhost:`, 5000)
})

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("Connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user == newMessageReceived.sender._id) return;

      socket.in(user).emit("message received", newMessageReceived );
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});