import { io } from "socket.io-client";

export const socket = io(
  "https://tic-tac-toe-multiplayer-thu2.onrender.com"
);