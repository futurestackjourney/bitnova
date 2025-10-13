import Hero from "./../sections/Hero";
import Features from "./../sections/Features";
import Content from "../sections/Content";
import Frequently from "../sections/Frequently";
import Testimonial from "../sections/Testimonial";
import CandleGraph from "../sections/CandleGraph";
import HomeMarket from "../sections/HomeMarketSection";
import GraphSec from "./../sections/GraphSec";
import HomeMarketSection from "./../sections/HomeMarketSection";
import { Route, Routes } from "react-router-dom";

const Home = () => {
  return (
    <main className="bg-white dark:bg-black">
      <Hero />
      <Features />
      <HomeMarketSection />
      <Content />
      <Testimonial />
      <Frequently />
    </main>
  );
};

export default Home;
