// src/components/Loader.jsx
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0d0d0d] z-[9999]">
      {/* Candlesticks */}
      <div className="flex space-x-2">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 rounded bg-green-400"
            initial={{ height: 10 }}
            animate={{ height: [10, 40, 15] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <motion.p
        className="mt-6 text-white font-semibold tracking-widest text-sm"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Fetching Data...
      </motion.p>
    </div>
  );
};

export default Loader;
