// import { frequently } from "../constants";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

const FrequentlyCard = ({title,text}) => {
  return (
       <motion.div
       variants={cardVariants}
       className="xl:w-1/3 lg:w-1/2 md:w-full px-8 py-6 ">
        <h2 className="text-lg sm:text-xl text-black dark:text-white font-medium title-font mb-2">{title}</h2>
        <p className="leading-relaxed text-base mb-4">{text}</p>
      </motion.div>
  )
}

export default FrequentlyCard
