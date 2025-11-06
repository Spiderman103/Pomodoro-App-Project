require("dotenv").config();
const getAIReply = require("./aiBot");

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://172.20.10.11:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const activeRooms = new Map();

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("join-room", (roomData) => {
    const roomId = roomData.roomId;
    const username = roomData.username;

    socket.join(roomId);
    socket.username = username;
    socket.currentRoom = roomId;

    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, {
        users: [],
        timerState: {
          timeLeft: 25 * 60,
          isRunning: false,
          currentSession: "work",
        },
        messages: [],
      });
    }

    const room = activeRooms.get(roomId);

    const aliceExists = room.users.some((user) => user.username === "AliceBot");
    if (!aliceExists) {
      room.users.push({ id: "alice-bot", username: "AliceBot" });
    }

    const bobExists = room.users.some((user) => user.username === "BobBot");
    if (!bobExists) {
      room.users.push({ id: "bob-bot", username: "BobBot" });
    }
    room.users.push({
      id: socket.id,
      username: username,
    });

    socket.emit("room-state", {
      users: room.users,
      roomId: roomId,
      timerState: room.timerState,
      messages: room.messages,
    });

    socket.to(roomId).emit("user-joined", username);
    io.to(roomId).emit("update-users", room.users);
    console.log("User " + username + " joined room " + roomId);
  });

  socket.on("timer-action", (action) => {
    const roomId = socket.currentRoom;
    if (!roomId || !activeRooms.has(roomId)) {
      return;
    }

    const room = activeRooms.get(roomId);

    if (action.type === "start") {
      room.timerState.isRunning = true;
    } else if (action.type === "pause") {
      room.timerState.isRunning = false;
    } else if (action.type === "reset") {
      room.timerState.timeLeft = 25 * 60;
      room.timerState.isRunning = false;
      room.timerState.currentSession = "work";
    }

    io.to(roomId).emit("timer-state", room.timerState);
  });

  socket.on("send-message", async (messageData) => {
    const roomId = socket.currentRoom;
    if (!roomId || !activeRooms.has(roomId)) {
      return;
    }

    const room = activeRooms.get(roomId);
    const message = {
      id: Date.now(),
      username: socket.username,
      text: messageData.text,
      timestamp: new Date().toLocaleTimeString(),
    };

    room.messages.push(message);
    io.to(roomId).emit("new-message", message);

    const alicePrompt =
      "You are AliceBot, a friendly study group member. Reply to: " +
      messageData.text;
    const aliceReply = await getAIReply(alicePrompt); //Informal Citation: Used AI to create this initialization of the OpenAI API using my API Key
    const aliceMessage = {
      id: Date.now() + 1,
      username: "AliceBot",
      text: aliceReply,
      timestamp: new Date().toLocaleTimeString(),
    };
    room.messages.push(aliceMessage);
    io.to(roomId).emit("new-message", aliceMessage);

    const bobPrompt =
      "You are BobBot, a motivational study group member. Reply to: " +
      messageData.text;
    const bobReply = await getAIReply(bobPrompt);
    const bobMessage = {
      id: Date.now() + 2,
      username: "BobBot",
      text: bobReply,
      timestamp: new Date().toLocaleTimeString(),
    };
    room.messages.push(bobMessage);
    io.to(roomId).emit("new-message", bobMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    const roomId = socket.currentRoom;

    if (roomId && activeRooms.has(roomId)) {
      const room = activeRooms.get(roomId);
      room.users = room.users.filter((user) => user.id !== socket.id);

      if (socket.username) {
        socket.to(roomId).emit("user-left", socket.username);
        console.log("User " + socket.username + " left room " + roomId);
      }

      io.to(roomId).emit("update-users", room.users);

      if (room.users.length === 0) {
        activeRooms.delete(roomId);
        console.log("Room " + roomId + " deleted as it is empty.");
      }
    }
  });
});

setInterval(() => {
  activeRooms.forEach((room, roomId) => {
    if (room.timerState.isRunning && room.timerState.timeLeft > 0) {
      room.timerState.timeLeft = room.timerState.timeLeft - 1;

      if (room.timerState.timeLeft === 0) {
        room.timerState.isRunning = false;

        if (room.timerState.currentSession === "work") {
          room.timerState.currentSession = "break";
          room.timerState.timeLeft = 5 * 60;
        } else {
          room.timerState.currentSession = "work";
          room.timerState.timeLeft = 25 * 60;
        }
      }

      io.to(roomId).emit("timer-state", room.timerState);
    }
  });
}, 1000);

const port = 3000;
server.listen(port, () => {
  console.log("Server is running on port " + port);
});
