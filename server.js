const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    console.log('One User Connected.');
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg); 
    });
    socket.on('disconnect', () => {
        console.log('Connection is Gone');
    });
});
http.listen(3000, () => {
    console.log('=====================================');
    console.log('--Started--');
    console.log('Go to Browser: http://localhost:3000');
    console.log('=====================================');
});
