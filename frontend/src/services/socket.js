import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const socket = io(SOCKET_URL, {
  path: '/socket.io',
  autoConnect: true,
  reconnection: true,
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('[Socket.IO] Connected to backend server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('[Socket.IO] Disconnected from backend server');
});

socket.on('connect_error', (err) => {
  console.warn('[Socket.IO] Connection error (falling back to polling):', err.message);
});

export default socket;
