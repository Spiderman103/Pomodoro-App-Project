import React from "react";

function Timer(props) {
  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var secondsLeft = seconds % 60;
    return (
      minutes.toString().padStart(2, "0") + //Informal Citation: Used Tutorial to learn about padStart
      ":" +
      secondsLeft.toString().padStart(2, "0") //Informal Citation: Used Tutorial to learn about padStart
    );
  }

  function getProgressPercentage() {
    var totalTime = 0;
    if (props.timerState.currentSession === "work") {
      totalTime = 25 * 60;
    } else {
      totalTime = 5 * 60;
    }
    return ((totalTime - props.timerState.timeLeft) / totalTime) * 100;
  }

  function getSessionInfo() {
    if (props.timerState.currentSession === "work") {
      return {
        title: "Work Session",
        description: "Focus on your tasks without distractions.",
        color: "#e74c3c",
        emoji: "💼",
      };
    } else {
      return {
        title: "Break Session",
        description: "Take a short break to recharge.",
        color: "#2ecc71",
        emoji: "☕",
      };
    }
  }

  var sessionInfo = getSessionInfo();
  var progress = getProgressPercentage();

  var mainControlButton;
  if (props.timerState.isRunning) {
    mainControlButton = (
      <button
        onClick={function () {
          props.onTimerAction("pause");
        }}
        className="control-btn pause-btn"
      >
        ⏸️ Pause
      </button>
    );
  } else {
    mainControlButton = (
      <button
        onClick={function () {
          props.onTimerAction("start");
        }}
        className="control-btn start-btn"
      >
        ▶️ Start
      </button>
    );
  }

  var statusDotClass;
  var statusText;
  if (props.timerState.isRunning) {
    statusDotClass = "status-dot running";
    statusText = "Timer Running";
  } else {
    statusDotClass = "status-dot paused";
    statusText = "Timer Paused";
  }

  return (
    <div className="timer-container">
      <div className="session-header">
        <h2 style={{ color: sessionInfo.color }}>
          {sessionInfo.emoji} {sessionInfo.title}
        </h2>
        <p>{sessionInfo.description}</p>
      </div>

      <div className="timer-display">
        <div className="timer-circle">
          <svg width="200" height="200" className="progress-ring">
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="#e0e0e0"
              strokeWidth="20"
              fill="none"
            />

            <circle
              cx="100"
              cy="100"
              r="90"
              stroke={sessionInfo.color}
              strokeWidth="20"
              fill="none"
              strokeDasharray={565.48} //Informal Citation: Used AI to create the circle stylings
              strokeDashoffset={(565.48 * (100 - progress)) / 100} //Informal Citation: Used AI to create the circle stylings
              style={{
                transition: "stroke-dashoffset 0.5s ease-in-out", //Informal Citation: Used AI to create the circle stylings
                transform: "rotate(-90deg)", //Informal Citation: Used AI to create the circle stylings
                transformOrigin: "50% 50%", //Informal Citation: Used AI to create the circle stylings
              }}
            />
          </svg>
          <div className="timer-text">
            <span className="time">
              {formatTime(props.timerState.timeLeft)}
            </span>
            <span className="session-type">
              {props.timerState.currentSession}
            </span>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        <div className="main-controls">
          {mainControlButton}
          <button
            onClick={function () {
              props.onTimerAction("reset");
            }}
            className="control-btn reset-btn"
          >
            🔄 Reset
          </button>
        </div>

        <div className="timer-status">
          <div className="status-indicator">
            <span className={statusDotClass}></span>
            <span className="status-text">{statusText.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="session-info">
        <div className="session-stats">
          <div className="stat">
            <span className="stat-label">Current: </span>
          </div>
          <div className="stat">
            <span className="stat-label">Time Left: </span>
            <span className="stat-value">
              {formatTime(props.timerState.timeLeft)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timer;
