import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { FaNewspaper, FaUserPlus } from "react-icons/fa";
import i18n from "../context/i18";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";


const variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0 },
};

const varientParagraph = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const variantButton = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};


const Hero = () => {

  const {t, i18n} = useTranslation();
  
  useEffect(() =>{
  i18n.changeLanguage(navigator.language);
  }, [])

  return (
    <section
      className="py-8 px-6 h-screen bg-cover bg-center bg-no-repeat "
      style={{ backgroundImage: "url('/images/bg1.png')" }}>
      {/* for blury effect for bg */}
      <div className="absolute inset-0 bg-white/10 dark:bg-zinc-900/40 backdrop-blur-[5px] not-sm:h-screen"></div>

      <div className="mt-32 max-w-6xl mx-auto flex flex-col items-center text-center z-10 relative">
        <motion.h1
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 title-hero pb-4"
          
        >
          {t("home.hero.title")}
        </motion.h1>

        <motion.p
          variants={varientParagraph}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl mb-10 max-w-xl text-gray-300"
        >
        {t("home.hero.description")}
        </motion.p>

        <motion.div
          variants={variantButton}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <Button
            text={t("home.hero.link")}
            to="/news"
            className="bg-green-600"
            icon={<FaNewspaper />}
          />

          <Button
            text={t("home.hero.link2")}
            to="/signup"
            className=" text-black"
            icon={<FaUserPlus />}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
