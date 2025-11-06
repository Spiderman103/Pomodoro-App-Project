import React, { useState, useRef, useEffect } from "react";
import Timer from "./Timer";
import Chat from "./Chat";
import "../css/FocusRoom.css";

function FocusRoom({ roomData, roomId, onLeaveRoom, username }) {
  let initialTimerState;
  if (roomData && roomData.timerState) {
    initialTimerState = roomData.timerState;
  } else {
    initialTimerState = {
      currentSession: "work",
      timeLeft: 25 * 60,
      isRunning: false,
    };
  }

  const [timerState, setTimerState] = useState(initialTimerState);
  const [messages, setMessages] = useState([]);
  const [users] = useState(roomData.users);
  const [currentTheme, setCurrentTheme] = useState("forest");
  const timerInterval = useRef(null);

  function handleTimerAction(action) {
    if (action === "start") {
      if (!timerState.isRunning) {
        setTimerState((prev) => ({
          ...prev,
          isRunning: true,
        }));
        timerInterval.current = setInterval(function () {
          setTimerState(function (prev) {
            if (!prev.isRunning) {
              return prev;
            }
            if (prev.timeLeft > 0) {
              return { ...prev, timeLeft: prev.timeLeft - 1 };
            } else {
              let nextSession, nextTime;
              if (prev.currentSession === "work") {
                nextSession = "break";
                nextTime = 5 * 60;
              } else {
                nextSession = "work";
                nextTime = 25 * 60;
              }
              return {
                ...prev,
                currentSession: nextSession,
                timeLeft: nextTime,
                isRunning: false,
              };
            }
          });
        }, 1000);
      }
    } else if (action === "pause") {
      setTimerState(function (prev) {
        return { prev, isRunning: false };
      });
      clearInterval(timerInterval.current);
    } else if (action === "reset") {
      clearInterval(timerInterval.current);
      setTimerState(function (prev) {
        let resetTime;
        if (prev.currentSession === "work") {
          resetTime = 25 * 60;
        } else {
          resetTime = 5 * 60;
        }
        return {
          prev,
          isRunning: false,
          timeLeft: resetTime,
        };
      });
    }
  }

  useEffect(function () {
    return function () {
      clearInterval(timerInterval.current);
    };
  }, []);

  function handleSendMessage(text) {
    const newMessage = {
      id: Date.now(),
      username: username,
      text: text,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }

  const themes = {
    forest: { name: "Forest", emoji: "🌲", color: "#228B22" },
    ocean: { name: "Ocean", emoji: "🌊", color: "#1E90FF" },
    sunset: { name: "Sunset", emoji: "🌅", color: "#FF4500" },
    space: { name: "Space", emoji: "🌌", color: "#4B0082" },
  };

  const themeClass = "room-container theme-" + currentTheme;

  return (
    <div className={themeClass}>
      <div className="room-header">
        <div className="room-info">
          <h2>
            {themes[currentTheme].emoji} Room:{" "}
            <span className="room-id">{roomId}</span>
          </h2>
          <p>
            Welcome, <span className="username-highlight">{username}</span>!
          </p>
        </div>
        <div className="room-controls">
          <div className="theme-selector">
            <label>Theme: </label>
            <select
              value={currentTheme}
              onChange={function (e) {
                setCurrentTheme(e.target.value);
              }}
            >
              {Object.keys(themes).map(function (themeKey) {
                return (
                  <option key={themeKey} value={themeKey}>
                    {themes[themeKey].emoji} {themes[themeKey].name}
                  </option>
                );
              })}
            </select>
          </div>
          <button onClick={onLeaveRoom} className="leave-btn">
            Leave Room
          </button>
        </div>
      </div>

      <div className="room-content">
        <div className="main-area">
          <div className="users-list">
            <h3>Focus Team ({users.length})</h3>
            <div className="users">
              {users.map(function (user, idx) {
                let userClass = "user-item";
                if (user.username === username) {
                  userClass += " user-me";
                }
                return (
                  <div key={user.username + idx} className={userClass}>
                    <span className="user-icon">👤</span>
                    <span className="user-name">{user.username}</span>
                    {user.username === username && (
                      <span className="you-label">(You)</span>
                    )}
                    <span className="user-status online">● Online</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="timer-section">
            <Timer timerState={timerState} onTimerAction={handleTimerAction} />
          </div>
        </div>
        <div className="chat-section">
          <Chat
            messages={messages}
            onSendMessage={handleSendMessage}
            username={username}
          />
        </div>
      </div>
    </div>
  );
}

export default FocusRoom;
