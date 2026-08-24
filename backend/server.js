import express from "express";

import cors from "cors";

import mongoose from "mongoose";

import dotenv from "dotenv";

import { createServer } from "http";

import { Server } from "socket.io";

import matchRoutes from "./routes/matchRoutes.js";

dotenv.config();

const app = express();

// MIDDLEWARE

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// ROUTES

app.use("/api/matches", matchRoutes);

// DATABASE

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {
    console.log("MongoDB Connected");
  })

  .catch((error) => {
    console.log(error);
  });

// HTTP SERVER

const httpServer = createServer(app);

// SOCKET.IO

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

// SOCKET CONNECTION
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // CREATE ROOM
  socket.on("create_room", (callback) => {
    let roomId;

    do {
      roomId = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
    } while (rooms.has(roomId));

    rooms.set(roomId, {
      players: {
        X: socket.id,
        O: null,
      },
    });

    socket.join(roomId);

    callback({
      success: true,
      roomId,
      player: "X",
    });

    console.log(`${socket.id} created room ${roomId}`);
  });

  // JOIN ROOM
  socket.on("join_room", ({ roomId }, callback) => {
    const room = rooms.get(roomId);

    if (!room) {
      callback({
        success: false,
        message: "Room does not exist",
      });

      return;
    }

    if (room.players.O) {
      callback({
        success: false,
        message: "Room is full",
      });

      return;
    }

    room.players.O = socket.id;

    socket.join(roomId);

    callback({
      success: true,
      roomId,
      player: "O",
    });

    io.to(roomId).emit("game_ready");

    console.log(`${socket.id} joined room ${roomId}`);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    for (const [roomId, room] of rooms) {
      if (room.players.X === socket.id || room.players.O === socket.id) {
        io.to(roomId).emit("opponent_disconnected");

        rooms.delete(roomId);

        break;
      }
    }
  });
});

// START SERVER

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
