import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-zinc-700 dark:text-white px-6">
      {/* Animated 404 text */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-9xl font-extrabold text-green-500 drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 text-2xl md:text-3xl font-semibold"
      >
        Oops! Page Not Found
      </motion.h2>

      {/* Message */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-2 text-gray-400 text-center max-w-md"
      >
        The page you are looking for doesn’t exist or has been moved.  
        Let’s get you back to trading.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-8"
      >
         <Button text="Back to Home" to="/" className="px-6 py-3 text-lg font-medium rounded-2xl bg-green-500 hover:bg-green-600 transition-colors shadow-lg" />
      </motion.div>

      {/* Decorative line graph like trading chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 w-3/4 h-32"
      >
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,100 C150,200 350,0 500,100"
            stroke="lime"
            strokeWidth="3"
            fill="transparent"
          />
        </svg>
      </motion.div>
    </div>
  );
}
