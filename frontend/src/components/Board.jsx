import { useEffect, useState } from "react";
import { socket } from "../socket";

import Square from "./Square";

function Board({ mode }) {
  const [board, setBoard] = useState(Array(9).fill(null));

  const [isXTurn, setIsXTurn] = useState(true);

  const [xScore, setXScore] = useState(0);

  const [oScore, setOScore] = useState(0);

  const [drawScore, setDrawScore] = useState(0);

  const winnerData = calculateWinner(board);

  const winner = winnerData?.winner;

  const winningLine = winnerData?.line;

  const isDraw = !winner && board.every((square) => square !== null);

  const roomId = "room1";

  useEffect(() => {
    // JOIN ROOM
    socket.emit("join_room", roomId);

    // RECEIVE MOVE
    socket.on("receive_move", (newBoard) => {
      setBoard(newBoard);

      setIsXTurn((prev) => !prev);
    });

    return () => {
      socket.off("receive_move");
    };
  }, []);

  // HANDLE CLICK

  const handleClick = (index) => {
    // STOP OVERWRITE
    if (board[index] || winner) {
      return;
    }

    const newBoard = [...board];

    // 1 VS 1 MODE
    if (mode === "1v1") {
      newBoard[index] = isXTurn ? "X" : "O";

      setBoard(newBoard);

      setIsXTurn(!isXTurn);
    }

    // BOT MODE
    if (mode === "bot") {
      // PLAYER MOVE
      newBoard[index] = "X";

      // CHECK PLAYER WIN
      const playerWin = calculateWinner(newBoard);

      if (!playerWin) {
        // FIND EMPTY CELLS
        const emptySquares = newBoard
          .map((value, index) => (value === null ? index : null))
          .filter((value) => value !== null);

        // AI MOVE
        if (emptySquares.length > 0) {
          const randomIndex =
            emptySquares[Math.floor(Math.random() * emptySquares.length)];

          newBoard[randomIndex] = "O";
        }
      }

      setBoard(newBoard);
    }

    // ONLINE MODE
    if (mode === "online") {
      newBoard[index] = isXTurn ? "X" : "O";

      setBoard(newBoard);

      setIsXTurn(!isXTurn);

      socket.emit("move", {
        room: roomId,

        board: newBoard,
      });
    }

    // SCORE UPDATE
    const result = calculateWinner(newBoard);

    if (result?.winner === "X") {
      setXScore((prev) => prev + 1);
    } else if (result?.winner === "O") {
      setOScore((prev) => prev + 1);
    } else if (!result && newBoard.every((square) => square !== null)) {
      setDrawScore((prev) => prev + 1);
    }
  };

  // RESET GAME
  const resetGame = () => {
    setBoard(Array(9).fill(null));

    setIsXTurn(true);
  };

  // RESET SCOREBOARD

  const resetScoreboard = () => {
    setXScore(0);

    setOScore(0);

    setDrawScore(0);

    resetGame();
  };

  return (
    <div
      className="
      min-h-screen
      bg-zinc-900
      text-white
      flex flex-col
      items-center
      justify-center
      px-4
    "
    >
      {/* TITLE */}
      <h1
        className="
        text-5xl
        font-bold
        mb-4
        text-cyan-400
      "
      >
        Tic Tac Toe
      </h1>

      {/* MODE */}
      <p
        className="
        text-zinc-400
        mb-8
        text-lg
      "
      >
        Mode:
        <span
          className="
          ml-2
          text-cyan-400
          uppercase
        "
        >
          {mode}
        </span>
      </p>

      {/* SCOREBOARD */}
      <div
        className="
        flex gap-6
        mb-8
        flex-wrap
        justify-center
      "
      >
        <div
          className="
          bg-zinc-800
          px-5 py-3
          rounded-xl
          text-xl
        "
        >
          X : {xScore}
        </div>

        <div
          className="
          bg-zinc-800
          px-5 py-3
          rounded-xl
          text-xl
        "
        >
          O : {oScore}
        </div>

        <div
          className="
          bg-zinc-800
          px-5 py-3
          rounded-xl
          text-xl
        "
        >
          Draws : {drawScore}
        </div>
      </div>

      {/* BOARD */}
      <div
        className="
        grid
        grid-cols-3
        gap-2
      "
      >
        {board.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => handleClick(index)}
            isWinningSquare={winningLine?.includes(index)}
          />
        ))}
      </div>

      {/* STATUS */}
      <h2
        className="
        mt-8
        text-3xl
        font-bold
      "
      >
        {winner
          ? `Winner: ${winner} 🎉`
          : isDraw
            ? "It's a Draw 🤝"
            : mode === "bot"
              ? "Your Turn"
              : `Turn: ${isXTurn ? "X" : "O"}`}
      </h2>

      {/* BUTTONS */}
      <div
        className="
        flex gap-4
        mt-8
        flex-wrap
        justify-center
      "
      >
        <button
          onClick={resetGame}
          className="
            bg-red-500
            hover:bg-red-600
            px-6 py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          Reset Game
        </button>

        <button
          onClick={resetScoreboard}
          className="
            bg-cyan-500
            hover:bg-cyan-600
            px-6 py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          Reset Scoreboard
        </button>
      </div>
    </div>
  );
}

// WINNER LOGIC

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        line,
      };
    }
  }

  return null;
}

export default Board;
