import X from "./X";
import O from "./O";

function Square({
  value,
  onClick,
  isWinningSquare
}) {

  return (

    <button
      onClick={onClick}
      className={`
        w-28 h-28
        flex items-center
        justify-center
        border-2
        rounded-xl
        transition-all
        duration-300

        ${
          isWinningSquare
            ? "bg-green-500 border-green-400 scale-105"
            : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
        }
      `}
    >

      {value === "X" && <X />}

      {value === "O" && <O />}

    </button>
  );
}

export default Square;