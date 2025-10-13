import FeatureCard from "../components/FeatureCard";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { features } from "../constants";
import i18n from "../context/i18";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {
  TbDeviceMobileShare,
  TbChartAreaLine,
  TbDeviceMobileDollar,
  TbDeviceMobileMessage,
  TbPasswordMobilePhone,
} from "react-icons/tb";
import { IoMdList } from "react-icons/io";

const iconMap = {
  TbDeviceMobileShare,
  IoMdList,
  TbChartAreaLine,
  TbDeviceMobileDollar,
  TbDeviceMobileMessage,
  TbPasswordMobilePhone,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Content = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, [i18n]);

  return (
    <section className="text-gray-400 min-h-screen section-padding" >
      <div className="container px-5 py-24 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-wrap w-full mb-20 flex-col items-center text-center"
        >
          <h1 className="title title-size">{t("home.content.title")}</h1>
          <p className="lg:w-1/2 w-full leading-relaxed text-opacity-80  ">
            {t("home.features.description")}
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap -m-4"
        >
          {t("home.content.contentcard", { returnObjects: true }).map(
            (card, index) => {
              const IconComponent = iconMap[card.icon];
              return (
                <FeatureCard
                  key={index}
                  icon={IconComponent}
                  title={card.title}
                  text={card.text}
                />
              );
            }
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="flex justify-center mx-auto mt-10"
        >
          <Button
            text={t("home.content.link")}
            to="/news"
            className="bg-green-600 hover:border-zinc-600"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Content;
