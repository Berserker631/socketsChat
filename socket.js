var express = require("express");
var app = express();
const cors = require('cors');
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: true,
        credentials: true,
        methods: ["GET", "POST"]
    }
});

app.use(cors())

app.get('/', (req, res) => { res.send('<h1>Sockets its working</h1>') });


io.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.Session);
        socket.broadcast.to(data.Session).emit('user joined');
    });

    socket.on('message', (data) => {
        io.in(data.SessionID).emit('new message', data)
    })

    //disconnected
    socket.on('disconnect', () => {
    });
});

server.listen(5000, function () {
    console.log('sockets running on port:', 5000);
});