import { motion } from "framer-motion";
import Button from "../components/Button";
import i18n from "../context/i18";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";



const CreateAccount = () => (
  <svg
    width="63"
    height="63"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M4 7C4 5.11438 4 4.17157 4.58579 3.58579C5.17157 3 6.11438 3 8 3H16C17.8856 3 18.8284 3 19.4142 3.58579C20 4.17157 20 5.11438 20 7V15C20 17.8284 20 19.2426 19.1213 20.1213C18.2426 21 16.8284 21 14 21H10C7.17157 21 5.75736 21 4.87868 20.1213C4 19.2426 4 17.8284 4 15V7Z"
        stroke="#05df72"
        strokeWidth="2"
      ></path>{" "}
      <path
        d="M15 18L15 21M9 18L9 21"
        stroke="#05df72"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>{" "}
      <path
        d="M9 8L15 8"
        stroke="#05df72"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>{" "}
      <path
        d="M9 12L15 12"
        stroke="#05df72"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>{" "}
    </g>
  </svg>
);

const InvestMoney = () => (
  <svg
    fill="#05df72"
    height="50"
    width="50"
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 330 330"
    xmlSpace="preserve"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g id="XMLID_350_">
        {" "}
        <path
          id="XMLID_351_"
          d="M329.986,14.723c-0.005-0.266-0.021-0.532-0.04-0.797c-0.017-0.237-0.034-0.474-0.061-0.707 c-0.029-0.239-0.069-0.476-0.109-0.713c-0.043-0.252-0.083-0.504-0.138-0.752c-0.049-0.22-0.11-0.436-0.168-0.654 c-0.068-0.253-0.134-0.507-0.215-0.754c-0.071-0.218-0.155-0.432-0.236-0.647c-0.09-0.236-0.176-0.473-0.277-0.703 c-0.098-0.225-0.21-0.444-0.32-0.665c-0.105-0.211-0.207-0.424-0.322-0.629c-0.124-0.223-0.262-0.438-0.398-0.656 c-0.123-0.196-0.244-0.393-0.375-0.583c-0.142-0.204-0.295-0.4-0.448-0.598c-0.15-0.196-0.3-0.391-0.46-0.578 c-0.15-0.176-0.309-0.345-0.468-0.515c-0.186-0.198-0.372-0.393-0.568-0.582c-0.066-0.063-0.123-0.133-0.19-0.195 c-0.098-0.091-0.204-0.167-0.304-0.254c-0.206-0.181-0.414-0.356-0.628-0.526c-0.183-0.144-0.369-0.282-0.557-0.416 c-0.207-0.148-0.417-0.291-0.631-0.428c-0.206-0.132-0.413-0.258-0.624-0.379c-0.211-0.121-0.424-0.235-0.64-0.346 c-0.221-0.113-0.443-0.221-0.668-0.321c-0.22-0.099-0.442-0.191-0.667-0.279c-0.23-0.09-0.46-0.175-0.692-0.253 c-0.229-0.077-0.462-0.147-0.696-0.214c-0.238-0.067-0.476-0.129-0.716-0.184c-0.233-0.054-0.468-0.101-0.705-0.144 c-0.253-0.046-0.507-0.084-0.762-0.117c-0.227-0.029-0.455-0.053-0.684-0.072c-0.274-0.022-0.549-0.035-0.823-0.042 C315.261,0.017,315.133,0,315,0h-60c-8.284,0-15,6.716-15,15s6.716,15,15,15h25.669l-91.084,98.371l-38.978-38.978 c-2.882-2.883-6.804-4.448-10.891-4.391c-4.076,0.078-7.945,1.811-10.717,4.801l-125,134.868 c-5.631,6.076-5.271,15.566,0.805,21.198c2.887,2.676,6.544,3.999,10.193,3.999c4.03,0,8.049-1.615,11.005-4.803l114.409-123.441 l38.983,38.983c2.884,2.884,6.847,4.483,10.895,4.391c4.078-0.078,7.948-1.814,10.718-4.806L300,53.278V75c0,8.284,6.716,15,15,15 c8.284,0,15-6.716,15-15V15C330,14.906,329.988,14.816,329.986,14.723z"
        ></path>{" "}
        <path
          id="XMLID_352_"
          d="M315,300H15c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h300c8.284,0,15-6.716,15-15 C330,306.716,323.284,300,315,300z"
        ></path>{" "}
      </g>{" "}
    </g>
  </svg>
);

const EarnMoney = () => (
  <svg
    fill="#05df72"
    width="50"
    height="50"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g data-name="2. Coin" id="_2._Coin">
        {" "}
        <path d="M22,9h-.19A2.83,2.83,0,0,0,22,8V6a3,3,0,0,0-3-3H3A3,3,0,0,0,0,6V8a3,3,0,0,0,2.22,2.88A3,3,0,0,0,2,12v2a3,3,0,0,0,.22,1.12A3,3,0,0,0,0,18v2a3,3,0,0,0,2.22,2.88A3,3,0,0,0,2,24v2a3,3,0,0,0,3,3H22A10,10,0,0,0,22,9Zm-9.16,6H5a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H16A10,10,0,0,0,12.84,15ZM2,6A1,1,0,0,1,3,5H19a1,1,0,0,1,1,1V8a1,1,0,0,1-1,1H3A1,1,0,0,1,2,8ZM2,18a1,1,0,0,1,1-1h9.2a10.1,10.1,0,0,0,0,4H3a1,1,0,0,1-1-1Zm3,9a1,1,0,0,1-1-1V24a1,1,0,0,1,1-1h7.84A10,10,0,0,0,16,27Zm17,0a8,8,0,1,1,8-8A8,8,0,0,1,22,27Z"></path>{" "}
        <path d="M22,16h2a1,1,0,0,0,0-2H23a1,1,0,0,0-2,0v.18A3,3,0,0,0,22,20a1,1,0,0,1,0,2H20a1,1,0,0,0,0,2h1a1,1,0,0,0,2,0v-.18A3,3,0,0,0,22,18a1,1,0,0,1,0-2Z"></path>{" "}
      </g>{" "}
    </g>
  </svg>
);

const FeatureCard = ({ icon: Icon, title, children }) => (
  <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      viewport={{ once: true, amount: 0.5 }}
      className="w-20 h-20 inline-flex items-center justify-center rounded-full mb-5 flex-shrink-0"
    >
      <Icon />
    </motion.div>
    <div className="flex-grow">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-black dark:text-white text-lg title-font font-medium mb-3"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}
        className="leading-relaxed text-base text-black dark:text-white"
      >
        {children}
      </motion.p>
    </div>
  </div>
);

const Features = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, [i18n]);

  return (
    <section className="min-h-screen section-padding bg-white dark:bg-black" 
    >
      <div className="container px-5 py-24 mx-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-20"
        >
          <h1 className="title title-size mb-4">
            {t("home.features.title")}
          </h1>
          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-400 text-opacity-80">
            {t("home.features.description")}
          </p>
          <div className="flex mt-6 justify-center">
            <div className="w-16 h-1 rounded-full bg-green-500 inline-flex"></div>
          </div>
        </motion.div>

        <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
          <FeatureCard icon={CreateAccount} title={t("home.features.cards.0.title")}>
            {t("home.features.cards.0.text")}
          </FeatureCard>
          <FeatureCard icon={EarnMoney} title={t("home.features.cards.1.title")}>
            {t("home.features.cards.1.text")}
          </FeatureCard>
          <FeatureCard icon={InvestMoney} title={t("home.features.cards.2.title")}>
            {t("home.features.cards.2.text")}
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default Features;