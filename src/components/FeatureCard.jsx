import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

const FeatureCard = ({ icon: Icon, title, text }) => {

  
  return (
    <motion.div variants={cardVariants} className="xl:w-1/3 md:w-1/2 p-4">
      <div className="border border-zinc-200 dark:border-zinc-800 border-opacity-75 p-6 rounded-lg bg-card-light dark:bg-[#0d0d0d] shadow-md">
        <div className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-green-400 mb-4 text-4xl">
          <Icon />
        </div>
        <h2 className="text-lg text-black dark:text-white font-medium title-font mb-2">
          {title}
        </h2>
        <p className="leading-relaxed text-sm text-zinc-600 dark:text-zinc-300">{text}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
