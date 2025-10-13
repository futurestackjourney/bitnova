import { aboutContent } from "../constants";
import TeamMember from "../components/TeamMember";
import i18n from "../context/i18";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const About = () => {

const {t, i18n} = useTranslation();

useEffect(() =>{
i18n.changeLanguage(navigator.language);
}, [])

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="py-24 sm:py-52 b text-zinc-900 dark:text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 title title-size">
            {/* {aboutContent.hero.title} */}
            {t("about.hero.title")}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            {/* {aboutContent.hero.description} */}
            {t("about.hero.description")}

          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-card-light dark:bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-black dark:text-white">
            {t("about.mission.title")}
          </h2>
          <p className="text-base md:text-lg max-w-3xl mx-auto text-zinc-600 dark:text-white">
            {t("about.mission.description")}
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <h2 className="title text-3xl md:text-4xl font-semibold text-center mb-12 text-black dark:text-white ">
            {t("about.team.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
                 {t("about.team.members", { returnObjects: true }).map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-black dark:text-white">
            {t("about.contact.title")}
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 text-black dark:text-white">
            {t("about.contact.description")}
          </p>
          <a
            href={aboutContent.contact.link}
            className="inline-block bg-green-500 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            {t("about.contact.cta")}
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
