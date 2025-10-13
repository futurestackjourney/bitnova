import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "17b13d400203b4ab3c82e818d612dc18";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=crypto&lang=en&token=${API_KEY}`
        );
        const data = await res.json();
        setArticles(data.articles.slice(0, 10));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);
  return (
    <section className="py-28 px-6 min-h-screen bg-white dark:bg-black ">
      <div className="p-6">
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ ease: "easeOut", duration: 0.4, delay: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
          className="title title-size mb-6"
        >
          Latest Crypto & Trading News
        </motion.h2>
        {loading ? (
          <p>Loading news...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ease: "easeOut", duration: 0.4, delay: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
                key={index}
                className=" p-4 rounded shadow-md bg-card-light dark:bg-card border border-zinc-100 dark:border-zinc-700 hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold text-black dark:text-white">{article.title}</h3>
                <p className="text-sm  mb-2 text-zinc-700 dark:text-zinc-300">
                  {new Date(article.publishedAt).toLocaleString()} —{" "}
                  {article.source.name}
                </p>
                <p className="mb-2 text-zinc-700 dark:text-zinc-300">{article.description}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Read Full Article ↗
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default News;
