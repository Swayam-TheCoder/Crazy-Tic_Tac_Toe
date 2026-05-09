import { motion } from "framer-motion";

function X() {

  return (

    <motion.div

      initial={{
        scale: 0,
        rotate: -180
      }}

      animate={{
        scale: 1,
        rotate: 0
      }}

      transition={{
        duration: 0.3
      }}

      className="
        text-cyan-400
        text-6xl
        font-bold
      "
    >
      X
    </motion.div>
  );
}

export default X;