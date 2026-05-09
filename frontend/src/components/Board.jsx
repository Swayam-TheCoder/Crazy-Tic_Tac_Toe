import { useState } from "react";

import Square from "./Square";

function Board() {

  const [board, setBoard] = useState(
    Array(9).fill(null)
  );

  const [isXTurn, setIsXTurn] = useState(true);

  const [xScore, setXScore] = useState(0);

  const [oScore, setOScore] = useState(0);

  const [drawScore, setDrawScore] = useState(0);


  const winnerData = calculateWinner(board);

  const winner = winnerData?.winner;

  const winningLine = winnerData?.line;


  // DRAW DETECTION
  const isDraw =
    !winner &&
    board.every(square => square !== null);


  const handleClick = (index) => {

    if (
      board[index] ||
      winner
    ) {
      return;
    }

    const newBoard = [...board];

    newBoard[index] =
      isXTurn ? "X" : "O";

    setBoard(newBoard);

    setIsXTurn(!isXTurn);


    // CHECK WINNER AFTER MOVE
    const result =
      calculateWinner(newBoard);

    if (result?.winner === "X") {

      setXScore(prev => prev + 1);
    }

    else if (
      result?.winner === "O"
    ) {

      setOScore(prev => prev + 1);
    }

    else if (
      !result &&
      newBoard.every(
        square => square !== null
      )
    ) {

      setDrawScore(prev => prev + 1);
    }
  };


  const resetGame = () => {

    setBoard(Array(9).fill(null));

    setIsXTurn(true);
  };


  const resetScoreboard = () => {

    setXScore(0);

    setOScore(0);

    setDrawScore(0);

    resetGame();
  };


  return (

    <div className="
      min-h-screen
      bg-zinc-900
      text-white
      flex flex-col
      items-center
      justify-center
      px-4
    ">

      {/* TITLE */}
      <h1 className="
        text-5xl
        font-bold
        mb-10
        text-cyan-400
      ">
        Tic Tac Toe
      </h1>


      {/* SCOREBOARD */}
      <div className="
        flex gap-8
        mb-8
        text-xl
        font-semibold
      ">

        <div className="
          bg-zinc-800
          px-5 py-3
          rounded-xl
        ">
          X : {xScore}
        </div>

        <div className="
          bg-zinc-800
          px-5 py-3
          rounded-xl
        ">
          O : {oScore}
        </div>

        <div className="
          bg-zinc-800
          px-5 py-3
          rounded-xl
        ">
          Draws : {drawScore}
        </div>

      </div>


      {/* BOARD */}
      <div className="
        grid grid-cols-3
        gap-2
      ">

        {board.map((value, index) => (

          <Square
            key={index}
            value={value}
            onClick={() => handleClick(index)}
            isWinningSquare={
              winningLine?.includes(index)
            }
          />

        ))}

      </div>


      {/* STATUS */}
      <h2 className="
        mt-8
        text-3xl
        font-bold
      ">

        {winner
          ? `Winner: ${winner} 🎉`
          : isDraw
          ? "It's a Draw 🤝"
          : `Turn: ${isXTurn ? "X" : "O"}`
        }

      </h2>


      {/* BUTTONS */}
      <div className="
        flex gap-4
        mt-8
      ">

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

    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
  ];


  for (let line of lines) {

    const [a, b, c] = line;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {

      return {
        winner: board[a],
        line
      };
    }
  }

  return null;
}

export default Board;