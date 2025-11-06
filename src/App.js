import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import FocusRoom from "./projectComponents/FocusRoom";
import "./css/App.css";

const socket = io("http://172.20.10.11:3000");

function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [showJoinForm, setShowJoinForm] = useState(true);

  useEffect(() => {
    socket.on("room-state", (data) => {
      console.log("Room joined successfully: ", data);
      setRoomData(data);
      setIsJoined(true);
      setShowJoinForm(false);
    });

    return () => {
      socket.off("room-state");
    };
  }, []);

  function joinRoom(e) {
    e.preventDefault();
    console.log("Joining room with ID:", roomId, "and username:", username);

    if (!username.trim() || !roomId.trim()) {
      alert("Username and Room ID cannot be empty.");
      return;
    }

    socket.emit("join-room", {
      roomId: roomId.trim(),
      username: username.trim(),
    });
  }

  function generateRoomId() {
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setRoomId(randomId);
  }

  function leaveRoom() {
    socket.disconnect();
    socket.connect();
    setIsJoined(false);
    setShowJoinForm(true);
    setUsername("");
    setRoomId("");
    setRoomData(null);
  }

  let mainContent;
  if (showJoinForm && !isJoined) {
    mainContent = (
      <div className="join-form-container">
        <div className="join-form">
          <h2>Join a Focus Room</h2>

          <form onSubmit={joinRoom}>
            <div className="form-group">
              <label htmlFor="username">Your Name:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={function (e) {
                  setUsername(e.target.value);
                }}
                placeholder="Enter your name"
                maxLength="20"
              />
            </div>

            <div className="form-group">
              <label htmlFor="roomId">Room ID:</label>
              <div className="room-id-input">
                <input
                  type="text"
                  id="roomId"
                  value={roomId}
                  onChange={function (e) {
                    setRoomId(e.target.value.toUpperCase());
                  }}
                  placeholder="Enter room ID"
                  maxLength="8"
                />
                <button
                  type="button"
                  onClick={generateRoomId}
                  className="generate-btn"
                >
                  Generate
                </button>
              </div>
            </div>

            <button type="submit" className="join-btn">
              Join Room
            </button>
          </form>

          <div className="tips">
            <h3>How it works:</h3>
            <ul>
              <li>Enter your name and a room ID</li>
              <li>Share the room ID with your team</li>
              <li>Focus together with synchronized timers</li>
              <li>Chat and motivate each other</li>
            </ul>
          </div>
        </div>
      </div>
    );
  } else if (isJoined && roomData) {
    mainContent = (
      <FocusRoom
        roomData={roomData}
        username={username}
        roomId={roomId}
        socket={socket}
        onLeaveRoom={leaveRoom}
      />
    );
  } else {
    mainContent = null;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Remote Team Pomodoro</h1>
        <p>An alternative for study groups</p>
      </header>

      <main className="App-main">{mainContent}</main>
    </div>
  );
}

export default App;
