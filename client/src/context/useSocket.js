import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Backend URL

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
