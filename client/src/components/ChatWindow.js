import React, { useEffect, useState, useRef } from "react";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";

function ChatWindow({ selectedUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user, token } = useAuth();
  const scrollRef = useRef();

  // Fetch old messages
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/messages/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data); // ← THIS WAS MISSING!
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [selectedUser, token]);

  // Receive real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleReceive = ({ sender, message }) => {
      if (sender === selectedUser?._id) {
        setMessages((prev) => [
          ...prev,
          { sender, message, createdAt: new Date() },
        ]);
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [socket, selectedUser]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isMine = (msg) => {
    return msg.sender === user.id || msg.sender?._id === user.id;
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !socket) return;
    try {
      await axios.post(
        "/messages/send",
        { receiver: selectedUser._id, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.emit("sendMessage", {
        sender: user.id,
        receiver: selectedUser._id,
        message: newMessage,
      });
      setMessages((prev) => [
        ...prev,
        { sender: user.id, message: newMessage, createdAt: new Date() },
      ]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 bg-[#0e1621] flex items-center justify-center">
        <p className="text-gray-500">Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0e1621]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-[#17212b] border-b border-[#242f3d]">
        <div className="w-10 h-10 rounded-full bg-[#2aabee] flex items-center justify-center text-white font-bold text-lg">
          {selectedUser.username[0].toUpperCase()}
        </div>
        <p className="text-white font-semibold">{selectedUser.username}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${isMine(msg) ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm text-white ${
                isMine(msg) ? "bg-[#2aabee]" : "bg-[#17212b]"
              }`}
            >
              <p>{msg.message}</p>
              <p className="text-xs text-right mt-1 opacity-60">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 bg-[#17212b] border-t border-[#242f3d] flex gap-3">
        <input
          type="text"
          placeholder="Write a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-[#242f3d] text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2aabee] text-sm"
        />
        <button
          onClick={handleSend}
          className="bg-[#2aabee] hover:bg-[#1d96d4] text-white px-6 py-3 rounded-xl transition duration-200 font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;