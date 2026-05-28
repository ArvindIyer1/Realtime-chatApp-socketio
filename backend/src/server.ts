import { createServer } from 'node:http';
import { Server } from 'socket.io';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

app.use(express.static(path.join(__dirname, '../../frontend-chatApp/dist')));

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('joinRoom', async (data: { userName: string; room: string }) => {
        if (socket.rooms.has(data.room)) return;
        await socket.join(data.room);
        socket.to(data.room).emit('roomNotice', data.userName);
    });

    socket.on('chatMessage', (data: { msg: any; room: string }) => {
        socket.to(data.room).emit('chatMessage', data.msg);
    });

    socket.on('typing', (data: { userName: string; room: string }) => {
        socket.to(data.room).emit('typing', data.userName);
    });

    socket.on('stopTyping', (data: { userName: string; room: string }) => {
        socket.to(data.room).emit('stopTyping', data.userName);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend-chatApp/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});