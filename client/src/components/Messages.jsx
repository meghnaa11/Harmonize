import React, { useState } from "react";
import Chat from "./Chat";

function Messages({ username }) {
  const [groupChats, setGroupChats] = useState(["MusicLovers", "RockFans", "JazzVibes"]);
  const [currentGroup, setCurrentGroup] = useState(null);

  return (
    <div className="messages-page">
      <h1>Messages</h1>
      {currentGroup ? (
        <>
          {/* Render Chat component for the selected group */}
          <button onClick={() => setCurrentGroup(null)}>Back to Chats</button>
          <Chat groupName={currentGroup} username={username} />
        </>
      ) : (
        <>
          {/* Show available group chats */}
          <ul>
            {groupChats.map((group, idx) => (
              <li key={idx} className="group-item">
                <button onClick={() => setCurrentGroup(group)}>
                  Join {group} Chat
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              const newGroup = prompt("Enter group chat name:");
              if (newGroup) setGroupChats((prev) => [...prev, newGroup]);
            }}
          >
            + Create New Group
          </button>
        </>
      )}
    </div>
  );
}

export default Messages;
