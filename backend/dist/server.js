import { createServer } from 'node:http';
import { Server } from 'socket.io';
import express from 'express';
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});
io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('joinRoom', async (data) => {
        if (socket.rooms.has(data.room))
            return;
        await socket.join(data.room);
        socket.to(data.room).emit('roomNotice', data.userName);
    });
    socket.on('chatMessage', (data) => {
        socket.to(data.room).emit('chatMessage', data.msg);
    });
    socket.on('typing', (data) => {
        socket.to(data.room).emit('typing', data.userName);
    });
    socket.on('stopTyping', (data) => {
        socket.to(data.room).emit('stopTyping', data.userName);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
app.get('/', (req, res) => { res.send('ok'); });
server.listen(3000, () => {
    console.log('server running on port 3000');
});
//# sourceMappingURL=server.js.map