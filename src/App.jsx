import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import News from "./pages/News";
import Markets from "./pages/Markets";
import CoinDetail from "./pages/CoinDetail";
import FuturesTrading from "./pages/FuturesTrading/FuturesTrading";
import SpotTrading from "./pages/SpotTrading/SpotTrading";
import Deposit from "./pages/Deposit";
import Testimonial from "./sections/Testimonial";
import Frequently from "./sections/Frequently";


// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Protected App Pages
import Dashboard from "./pages/app/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

// Shared Layout
import Navbar from "./sections/Navbar";
import Footer from "./sections/Footer";
import UserPortfolio from "./pages/app/UserPortfolio";
import ContactBot from "./sections/ContactBot";
import NotFound from "./pages/NotFound";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fake loading for UX (wait until everything mounts)
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/news" element={<News />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
        <Route path="/futures" element={<FuturesTrading />} />
        <Route path="/spot" element={<SpotTrading />} />
        <Route path="/deposit" element={<Deposit/>}/>
        <Route path="/faqs" element={< Frequently/>}/>
        <Route path="/testimonials" element={< Testimonial/>}/>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <PrivateRoute>
              <UserPortfolio />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ContactBot />
      <Footer />
    </>
  );
};

export default App;
