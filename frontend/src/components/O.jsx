import { motion } from "framer-motion";

function O() {

  return (

    <motion.div

      initial={{
        scale: 0,
        rotate: 180
      }}

      animate={{
        scale: 1,
        rotate: 0
      }}

      transition={{
        duration: 0.3
      }}

      className="
        text-pink-400
        text-6xl
        font-bold
      "
    >
      O
    </motion.div>
  );
}

export default O;