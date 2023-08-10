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

app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Sockets its working</h1>");
});

io.on("connection", (socket) => {
  console.log('a user connected');

  //send Message to all users
  socket.on('new message', (data)=>{
    socket.emit('get message', data)
  })

  socket.on('disconnect', ()=>{
    console.log('a user disconnected');
  })
})

server.listen(5000, function () {
  console.log("sockets running on port:", 5000);
});
