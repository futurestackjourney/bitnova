import FrequentlyCard from "../components/FrequentlyCard";
import { frequently } from "../constants";
import { motion } from "framer-motion";
import i18n from "../context/i18";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Frequently = () => {

  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, []);

  return (
    <section className="text-gray-400 min-h-screen section-padding">
      <div className="container px-5 py-24 mx-auto ">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-col text-start w-full px-5 mb-20"
        >
          <h2 className="text-xs text-green-400 tracking-widest font-medium title-font mb-1">
            {t("home.faq.subtitle")}
          </h2>
          <h1 className="mb-4 title title-size">{t("home.faq.title")}</h1>
          <p className="lg:w-2/3 leading-relaxed text-base">
            {t("home.faq.description")}
          </p>
          <a
            href="mailto:liebeya@mail.de"
            className="leading-relaxed text-base underline"
          >
            {t("home.faq.link")}
          </a>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex flex-wrap"
        >
          {t("home.faq.questions", { returnObjects: true }).map(
            (questions, index) => {
              return (
                <FrequentlyCard
                  key={index}
                  title={questions.title}
                  text={questions.text}
                />
              );
            }
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Frequently;
