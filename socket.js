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
socket.on("new-user-add", (newUserId) => {
  if (!onlineUsers.some((user) => user.userId === newUserId)) {
    onlineUsers.push({userId: newUserId, socketId: socket.id});
  }
  //send all active users to new user
  io.emit("get-users", onlineUsers)
});
  //This socket capture when a user close the aplication
  socket.on("disconnect", ()=>{
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    //send all online user to all users
    io.emit("get-users",)
  });

  //When a user has been diconnected this socket emit alert to all the clients connected, and refresh the connected users array
  socket.on("offline", ()=>{
    //remove users from active users
    onlineUsers = onlineUsers.filter((user)=> user.socketId !== socket.id);
    //send all online
    io.emit("get-users", onlineUsers)
  });

  socket.on("join", (data) => {
    socket.join(data.Session);
    socket.broadcast.to(data.Session).emit("user joined");
  });

  socket.on("message", (data) => {
    io.in(data.SessionID).emit("new message", data);
  });

  socket.on("file", (data) => {
    socket.broadcast.emit("file", data);
  });
});

server.listen(5000, function () {
  console.log("sockets running on port:", 5000);
});
