const { io } = require("socket.io-client");

const userId = "681c947806310edb3f307797";
const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected to socket with ID:", socket.id);

  // Join the user room
  socket.emit("join", userId);
  console.log(`Joined room: ${userId}`);
});

// Listen for assigned task notification
socket.on("taskAssigned", (data) => {
  console.log("🔔 New Task Assigned:", data.message);
  console.log("Task Details:", data.task);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
