var express = require("express");
var app = express();
const cors = require("cors");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

app.use(cors());
 
app.get("/", (req, res) => {
  res.send("<h1>Sockets its working</h1>");
});

io.on("connection", (socket) => {
  socket.on('new user', (newUser) =>{
    //Online user status
    if (!onlineUsers.some((user) => user.idUser === newUser)) { //if user is already in the array
      onlineUsers.push({
        idUser: newUser,
        socketID: socket.id
      });
    }
    //send all online users to new user
    io.emit('get users', onlineUsers)
  })

  socket.on('disconnect', () =>{
    onlineUsers = onlineUsers.filter((user) => user.socketID !== socket.id)
    //send all online users to all users
    io.emit('get users', onlineUsers)
  });
  // socket.on("offline", () =>{
  //   //remove user from active users
  //   onlineUsers = onlineUsers.filter((user) => user.socketID !== socket.id);
  //   console.log("User is offline", onlineUsers);
  //   //send all online users to all users
  //   io.emit('get users', onlineUsers)
  // })

  //Join a private chat room
  socket.on("join", (data) => {
    socket.join(data.idSession);
    socket.broadcast.to(data.idSession).emit("user joined");
  });

  //Message Sockets
  socket.on('new message', (data)=>{
   socket.to(data.idSession).emit('get message',data)
  })

})

server.listen(5000, function () {
  console.log("sockets running on port:", 5000);
});
