import React, { useState, useEffect, useRef } from "react";

function Chat(props) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(
    function () {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    },
    [props.messages]
  );

  function handleSendMessage(text) {
    if (!text || text.trim() === "") {
      return;
    }
    props.onSendMessage(text);
    setNewMessage("");

    setTimeout(function () {
      var aliceReplies = [
        "That's interesting!",
        "Keep it up!",
        "I'm focusing too!",
        "Great message!",
        "Let's stay productive!",
      ];
      var randomAlice =
        aliceReplies[Math.floor(Math.random() * aliceReplies.length)];
      props.onSendMessage(randomAlice);
    }, 1200);

    setTimeout(function () {
      var bobReplies = [
        "Nice one!",
        "I'm here with you.",
        "Let's crush this session!",
        "Good luck!",
        "Break soon?",
      ];
      var randomBob = bobReplies[Math.floor(Math.random() * bobReplies.length)];
      props.onSendMessage(randomBob);
    }, 2000);
  }

  function handleSubmit(e) {
    e.preventDefault(); //Informal Citation: Used a tutorial and found out this line of code from there.
    handleSendMessage(newMessage);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(newMessage);
    }
  }

  var quickMessages = [
    "Let's focus! 💪",
    "Great job everyone! 🎉",
    "Break time! ☕",
    "Back to work! 📚",
    "Almost there! ⏰",
  ];

  var messagesContent;
  if (!props.messages || props.messages.length === 0) {
    messagesContent = (
      <div className="empty-chat">
        <p>No messages yet. Say hello to your team! 👋</p>
      </div>
    );
  } else {
    messagesContent = props.messages.map(function (message, idx) {
      var messageClass = "message";
      if (message.username === props.username) {
        messageClass = messageClass + " own-message";
      } else {
        messageClass = messageClass + " other-message";
      }
      var key;
      if (message.id) {
        key = message.id;
      } else {
        key = idx;
      }
      return (
        <div key={key} className={messageClass}>
          <div className="message-header">
            <span className="message-author">{message.username}</span>
            <span className="message-time">{message.timestamp}</span>
          </div>
          <div className="message-text">{message.text}</div>
        </div>
      );
    });
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>💬 Team Chat</h3>
        <span className="message-count">{props.messages.length} messages</span>
      </div>

      <div className="messages-area">
        {messagesContent}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-messages">
        <div className="quick-messages-label">Quick:</div>
        <div className="quick-buttons">
          {quickMessages.map(function (msg, index) {
            return (
              <button
                key={index}
                className="quick-msg-btn"
                onClick={function () {
                  props.onSendMessage(msg);
                }}
              >
                {msg}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-area">
          <input
            type="text"
            value={newMessage}
            onChange={function (e) {
              setNewMessage(e.target.value);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            maxLength="200"
            className="message-input"
          />
          <button
            type="submit"
            disabled={newMessage.trim() === ""}
            className="send-btn"
          >
            Send
          </button>
        </div>
        <div className="input-hint">
          Press Enter to send • Shift + Enter for new line
        </div>
      </form>
    </div>
  );
}

export default Chat;
