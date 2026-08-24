import { useState } from "react";
import { socket } from "../socket";
import Board from "../components/Board";

function Online() {
  const [roomId, setRoomId] = useState("");
  const [gameRoom, setGameRoom] = useState(null);
  const [player, setPlayer] = useState(null);

  const createRoom = () => {
    socket.emit("create_room", (response) => {
      if (!response.success) {
        alert("Failed to create room");
        return;
      }

      setGameRoom(response.roomId);
      setPlayer(response.player);
    });
  };

  const joinRoom = () => {
    if (!roomId.trim()) {
      alert("Enter room code");
      return;
    }

    socket.emit(
      "join_room",
      {
        roomId: roomId.trim().toUpperCase(),
      },
      (response) => {
        if (!response.success) {
          alert(response.message);
          return;
        }

        setGameRoom(response.roomId);
        setPlayer(response.player);
      },
    );
  };

  // GAME STARTED
  if (gameRoom && player) {
    return (
      <Board
        mode="online"
        roomId={gameRoom}
        player={player}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-4">

      <h1 className="text-5xl font-bold mb-10 text-cyan-400">
        Online Multiplayer
      </h1>

      <button
        onClick={createRoom}
        className="
          bg-cyan-500
          hover:bg-cyan-600
          px-8 py-4
          rounded-xl
          font-semibold
          text-lg
          mb-8
        "
      >
        Create Game
      </button>

      <div className="text-zinc-500 mb-6">
        OR
      </div>

      <div className="flex gap-3">

        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room Code"
          className="
            bg-zinc-800
            border border-zinc-700
            px-5 py-3
            rounded-xl
            outline-none
            uppercase
          "
        />

        <button
          onClick={joinRoom}
          className="
            bg-green-500
            hover:bg-green-600
            px-6 py-3
            rounded-xl
            font-semibold
          "
        >
          Join
        </button>

      </div>

    </div>
  );
}

export default Online;