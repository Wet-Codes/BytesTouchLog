import { io } from 'socket.io-client';

// Connect to your backend (adjust the port if needed)
const socket = io('http://192.168.1.6:2002'); // <-- match your Node server port

export default {
  install: (app) => {
    app.config.globalProperties.$socket = socket;
  }
};

export { socket };
