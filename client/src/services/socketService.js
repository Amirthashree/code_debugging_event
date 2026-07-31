import { io } from 'socket.io-client';

// In production: VITE_API_URL points to Render backend (e.g. https://your-app.onrender.com)
// In development: '/' connects to localhost via Vite proxy
const SOCKET_URL = import.meta.env.VITE_API_URL || '/';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    });
  }
  return socket;
};

export const joinContestRoom = (user) => {
  const s = getSocket();
  if (user) {
    s.emit('user:join', user);
  }
};

export const emitAntiCheatViolation = (data) => {
  const s = getSocket();
  s.emit('anti_cheat:violation', data);
};
