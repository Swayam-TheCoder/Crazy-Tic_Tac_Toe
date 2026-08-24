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

const allowedOrigins = [
  "http://localhost:5173",
  "https://tic-tac-toe-multiplayer-kappa.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
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
    origin: allowedOrigins,
    methods: ["GET", "POST"],
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
      roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (rooms.has(roomId));

    rooms.set(roomId, {
      players: {
        X: socket.id,
        O: null,
      },
      board: Array(9).fill(null),
      turn: "X",
      winner: null,
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

  // MAKE MOVE
  socket.on("make_move", ({ roomId, index }) => {
  const room = rooms.get(roomId);

  // Room doesn't exist
  if (!room) {
    return;
  }

  // Find which player this socket is
  let player = null;

  if (room.players.X === socket.id) {
    player = "X";
  } else if (room.players.O === socket.id) {
    player = "O";
  }

  // Player isn't part of the room
  if (!player) {
    return;
  }

  // Game already finished
  if (room.winner) {
    return;
  }

  // Not this player's turn
  if (room.turn !== player) {
    return;
  }

  // Invalid index
  if (index < 0 || index > 8) {
    return;
  }

  // Square already occupied
  if (room.board[index] !== null) {
    return;
  }

  // Make move
  room.board[index] = player;

  // Check winner
  const result = calculateWinner(room.board);

  if (result) {
    room.winner = result.winner;
  } else if (room.board.every((square) => square !== null)) {
    room.winner = "DRAW";
  } else {
    room.turn = room.turn === "X" ? "O" : "X";
  }

  // Send updated state to both players
  io.to(roomId).emit("game_state", {
    board: room.board,
    turn: room.turn,
    winner: room.winner,
  });
});

socket.on("reset_game", ({ roomId }) => {
  const room = rooms.get(roomId);

  if (!room) {
    return;
  }

  // Check whether the player belongs to this room
  if (
    room.players.X !== socket.id &&
    room.players.O !== socket.id
  ) {
    return;
  }

  // Reset game state
  room.board = Array(9).fill(null);
  room.turn = "X";
  room.winner = null;

  // Send reset state to BOTH players
  io.to(roomId).emit("game_state", {
    board: room.board,
    turn: room.turn,
    winner: room.winner,
  });
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

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 4, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return {
        winner: board[a],
        line,
      };
    }
  }

  return null;
}

// START SERVER

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
