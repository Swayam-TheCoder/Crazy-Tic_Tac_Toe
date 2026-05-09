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
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);

    console.log(`User joined ${room}`);
  });

  // RECEIVE MOVE
  socket.on("move", (data) => {
    socket.to(data.room).emit("receive_move", data.board);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

// START SERVER

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
