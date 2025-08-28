import { io } from "socket.io-client";

// Replace with your backend server URL
const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Socket.IO client configuration options
const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
  socket.on("receiveNotification", (data) => {
    console.log("New notification received:", data);
    // You can dispatch a Redux action or update state here to show the notification in the UI
  });
});

export default socket;