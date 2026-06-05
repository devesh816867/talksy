import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    newSocket.emit("addUser", user.id);
    setSocket(newSocket);

    return () => newSocket.close();
  }, [user]);

  return (
    <div className="flex h-screen bg-[#0e1621]">
      <Sidebar setSelectedUser={setSelectedUser} />
      <ChatWindow selectedUser={selectedUser} socket={socket} />
    </div>
  );
}

export default Chat;