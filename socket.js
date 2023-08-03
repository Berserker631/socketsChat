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

    //Message Sockets
    socket.on('typing', (UserName) => {
        socket.emit('response', UserName)
    })

    socket.on('newMessage', (newMessage) => {
        io.emit('newMessage', newMessage)
    })


    //Disconnected User
    socket.on('disconnect', () => {
        console.log("a user its disconnected");
    });
});



server.listen(5050, function () {
    console.log('sockets running on port:', 5050);
});