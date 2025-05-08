let io;

const setSocketIO = (ioInstance) => {
  io = ioInstance;
};

const getSocketIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { setSocketIO, getSocketIO };
