import { io } from 'socket.io-client';
import { API_BASE } from '../config';

export const socket = io(API_BASE, {
  path: '/socket.io',
  autoConnect: true,
  reconnection: true,
  transports: ['websocket', 'polling'],
  auth: (cb) => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    cb({ token });
  }
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
