import { io } from 'socket.io-client';

export function connectWS() {
    const URL = import.meta.env.PROD ? window.location.origin : 'http://localhost:3000';
    return io(URL);
}