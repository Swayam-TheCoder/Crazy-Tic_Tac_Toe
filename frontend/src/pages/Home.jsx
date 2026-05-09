import { Link } from "react-router-dom";

function Home() {

  return (

    <div className="
      min-h-screen
      bg-zinc-900
      text-white
      flex flex-col
      items-center
      justify-center
      gap-6
    ">

      <h1 className="
        text-5xl
        font-bold
        text-cyan-400
        mb-10
      ">
        Tic Tac Toe
      </h1>


      <Link
        to="/1v1"
        className="
          bg-cyan-500
          hover:bg-cyan-600
          px-8 py-4
          rounded-xl
          text-2xl
          font-semibold
          transition
        "
      >
        1 vs 1
      </Link>


      <Link
        to="/1vbot"
        className="
          bg-pink-500
          hover:bg-pink-600
          px-8 py-4
          rounded-xl
          text-2xl
          font-semibold
          transition
        "
      >
        1 vs Bot
      </Link>


      <Link
        to="/online"
        className="
          bg-green-500
          hover:bg-green-600
          px-8 py-4
          rounded-xl
          text-2xl
          font-semibold
          transition
        "
      >
        Online Multiplayer
      </Link>

    </div>
  );
}

export default Home;