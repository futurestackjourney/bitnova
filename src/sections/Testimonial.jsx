import { motion } from "framer-motion";
import { testimonials } from "../constants";
import i18n from "../context/i18";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function Column({ delay = 0, duration = 20 }) {
  const loopedTestimonials = [...testimonials, ...testimonials];

  return (
    <motion.div
      className="flex flex-col gap-6"
      animate={{ y: ["0%", "-50%"] }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
        delay,
      }}
    >
      {loopedTestimonials.map(({ icon: Icon, title, comment, name }, key) => (
        <div
          key={key}
          className="p-4 w-full sm:w-80 bg-card-light dark:bg-zinc-800 rounded-lg shadow-md"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} className="text-sky-400" />
              ))}
            </div>
            <h3 className="leading-relaxed font-semibold my-2.5 text-xl text-zinc-800 dark:text-white">
              “{title}”
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300">{comment}</p>
            <p className="mt-4 text-zinc-400">- {name}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function Testimonial() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, []);
  return (
    <section className="h-lvh w-dvw py-20 bg-card-light dark:bg-zinc-950 overflow-hidden section-padding">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center title title-size mb-12">
          {t("home.testimonials.title")}
        </h2>

        <div className="relative flex flex-col sm:flex-row justify-center gap-8 overflow-hidden max-w-[76rem] mx-auto">
          {/* Fade Overlays */}
          <div className="pointer-events-none absolute top-0 left-0 w-full h-16  bg-gradient-to-b from-white dark:from-zinc-950  to-transparent z-10"></div>
          {/* <div className="pointer-events-none absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-zinc-950 to-transparent z-10"></div> */}

          {/* Responsive columns */}
          <Column delay={0} duration={78} />
          <Column delay={0.8} duration={89} className="hidden sm:flex" />
          <Column delay={0.3} duration={85} className="hidden lg:flex" />

          <div className="pointer-events-none absolute top-82 left-0 w-full h-16 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent z-10 hidden sm:block"></div>
        </div>
      </div>
    </section>
  );
}
