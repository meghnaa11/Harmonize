import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function Chat({ groupName, username }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentSong, setCurrentSong] = useState("");

  useEffect(() => {
    socket.emit("joinGroup", groupName);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("currentSong", (data) => {
      setCurrentSong(data.songTitle);
    });

    return () => {
      socket.disconnect();
    };
  }, [groupName]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      socket.emit("sendMessage", { groupName, message: inputMessage, username });
      setInputMessage("");
    }
  };

  const updateSong = () => {
    const songTitle = prompt("Enter song title:");
    if (songTitle) {
      socket.emit("updateSong", { groupName, songTitle });
    }
  };

  return (
    <div className="chat-container">
      <h2>Group Chat: {groupName}</h2>
      <p><strong>Currently Playing:</strong> {currentSong || "No song added yet"}</p>
      <button onClick={updateSong} className="update-song-button">+ Add Song</button>
      
      <div className="messages">
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.username}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
