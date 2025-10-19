import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { MdDarkMode } from "react-icons/md";
import { FaChevronDown, FaChevronUp, FaCommentsDollar } from "react-icons/fa";
import Modal from "../components/FormAlert";
import { BiMoon, BiSun } from "react-icons/bi";
import { useTheme } from "../context/ThemeContext";
import DarkModeToggle from "../components/ui/DarkModeToggle";
import LanguageToggle from "../components/ui/LanguageToggle";

import i18n from "../context/i18";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  // const [tradeOpen, setTradeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, []);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 2 && scrollY < 330) setShowNavbar(false);
      else setShowNavbar(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) =>
    location.pathname === path
      ? "text-green-400 underline underline-offset-4"
      : "hover:text-green-300";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Handle Deposit button
  const handleDepositClick = () => {
    if (user) {
      navigate("/deposit");
    } else {
      setDepositModalOpen(true);
    }
  };
  return (
    <>
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            key="navbar"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white/10 text-zinc-900 dark:bg-black/10 dark:text-white backdrop-blur-lg top-0 fixed w-full shadow px-6 py-2 z-30 "
          >
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              {/* LEFT SIDE */}
              <div className="flex items-center space-x-8">
                <Link
                  to="/"
                  className="flex space-x-2 text-[16px]"
                  onClick={closeMenu}
                >
                  {theme === "light" ? (
                    <img
                      src="/images/logo-light.png"
                      alt="logo"
                      width={120}
                      height={90}
                    />
                  ) : (
                    <img
                      src="/images/logo.png"
                      alt="logo"
                      width={120}
                      height={90}
                    />
                  )}
                </Link>
                <ul className="hidden md:flex space-x-6 text-[16px]">
                  <li>
                    <Link to="/news" className={isActive("/news")}>
                      {t("navbar.news")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className={isActive("/about")}>
                      {t("navbar.about")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/markets" className={isActive("/markets")}>
                      {t("navbar.market")}
                    </Link>
                  </li>

                  {/* Trading dropdown */}
                  <li className="relative group">
                    <button className="flex items-center space-x-1 group-hover:text-green-300">
                      <span>{t("navbar.trading.trade")}</span>
                      <FaChevronDown
                        size={12}
                        className="group-hover:hidden block transition-all"
                      />
                      <FaChevronUp
                        size={12}
                        className="group-hover:block hidden transition-all"
                      />
                    </button>

                    {/* Invisible hover zone to bridge the gap */}
                    <div className="absolute left-0 right-0 h-[25px]"></div>

                    {/* Dropdown menu */}
                    <div className="absolute -left-20 mt-[22px] bg-card-light dark:bg-[#1c1c1c] p-2 text-[15px] w-68 hidden group-hover:block">
                      <Link
                        to="/spot"
                        className="block px-4 py-2 hover:text-green-300"
                      >
                        {t("navbar.trading.spot")}
                        <p className="text-sm text-gray-400  ">
                          {t("navbar.trading.spotpara")}
                        </p>
                      </Link>
                      <Link
                        to="/futures"
                        className="block px-4 py-2 hover:text-green-300"
                      >
                        {t("navbar.trading.features")}
                        <p className="text-sm text-gray-400 max-w-4xl">
                          {t("navbar.trading.featurespara")}
                        </p>
                      </Link>
                    </div>
                  </li>

                  {/* More Dropdown on Left */}
                  <li className="relative group ">
                    <button className="flex items-center space-x-1 group-hover:text-green-300">
                      <span>{t("navbar.more.more")}</span>
                      <FaChevronDown
                        size={12}
                        className="group-hover:hidden block transition-all"
                      />
                      <FaChevronUp
                        size={12}
                        className="group-hover:block hidden transition-all"
                      />
                    </button>

                    {/* Invisible hover zone to bridge the gap */}
                    <div className="absolute left-0 right-0 h-[25px]"></div>

                    {/* Dropdown menu */}
                    <div className="absolute -left-30 mt-[22px] bg-card-light dark:bg-[#1c1c1c] p-2 text-[16px] w-78 hidden group-hover:block">
                      <Link
                        to="/testimonials"
                        className="block px-4 py-2 hover:text-green-300"
                      >
                        {t("navbar.more.testimonials")}
                        <p className="text-sm w-full text-gray-400">
                          {t("navbar.more.testimonialspara")}
                        </p>
                      </Link>

                      <Link
                        to="/faqs"
                        className="block px-4 py-2 hover:text-green-300"
                      >
                        {t("navbar.more.faqs")}
                        <p className="text-sm text-gray-400 max-w-4xl">
                          {t("navbar.more.faqspara")}
                        </p>
                      </Link>

                      <Link
                        to="/support"
                        className="block px-4 py-2 hover:text-green-300"
                      >
                        {t("navbar.more.support")}
                        <p className="text-sm text-gray-400 max-w-4xl">
                          {t("navbar.more.supportpara")}
                        </p>
                      </Link>

                      <Link
                        to="/referral"
                        className="block px-4 py-2 hover:text-green-300"
                      >
                        {t("navbar.more.program")}
                        <p className="text-sm text-gray-400 max-w-4xl">
                          {t("navbar.more.programpara")}
                        </p>
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>

              {/* RIGHT SIDE */}
              <div className="hidden md:flex items-center space-x-4 text-sm">
                {/* Language Button */}
                <LanguageToggle />

                {/* Dark Mode Button */}
                <DarkModeToggle />

                {/* Deposit Button */}
                <button
                  onClick={handleDepositClick}
                  className="px-3 py-1.5 rounded bg-green-500 text-black hover:bg-green-600"
                >
                  {t("navbar.depositbtn")}
                </button>
                {user ? (
                  <div className="relative group">
                    <button className="p-2 rounded-full bg-zinc-100 hover:bg-card-light-hover dark:bg-[#1c1c1c] dark:group-hover:bg-[#1c1c1c] flex items-center space-x-1">
                      <FiUser size={20} />
                    </button>
                    <div className="absolute left-0 right-0 h-[25px]"></div>

                    {/* Dropdown menu (opens on hover) */}
                    <div className="absolute -right-5 mt-[16px] bg-white dark:bg-[#1c1c1c] rounded-lg p-2 shadow-lg hidden group-hover:block min-w-[180px]">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:text-green-300"
                      >
                        {t("navbar.profile.dashboard")}
                      </Link>
                      <Link
                        to="/portfolio"
                        className="block px-4 py-2 hover:text-green-300"
                      >
                        {t("navbar.profile.Portfolio")}
                      </Link>
                      <Link
                        to="/create"
                        className="block px-4 py-2 hover:text-green-300"
                      >
                        {t("navbar.profile.settings")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:text-green-300"
                      >
                        {t("navbar.profile.logout")}
                      </button>
                    </div>
                  </div>
                ) : (
                  // If NOT logged in → Login button
                  <Link
                    to="/login"
                    className="px-3 py-1.5  rounded bg-green-500 text-black hover:bg-green-600"
                  >
                    {t("navbar.loginbtn")}
                  </Link>
                )}
              </div>

              {/* Mobile Menu Icon */}
              <div className="md:hidden" onClick={toggleMenu}>
                {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </div>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
              <ul className="mt-4 flex flex-col space-y-4 md:hidden h-screen">
                <li>
                  <Link to="/news" onClick={closeMenu}>
                    {t("navbar.news")}
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={closeMenu}>
                    {t("navbar.about")}
                  </Link>
                </li>
                <li>
                  <Link to="/spot" onClick={closeMenu}>
                    {t("navbar.trading.spot")}
                  </Link>
                </li>
                <li>
                  <Link to="/futures" onClick={closeMenu}>
                    {t("navbar.trading.features")}
                  </Link>
                </li>
                <li>
                  <Link to="/markets" onClick={closeMenu}>
                    {t("navbar.market")}
                  </Link>
                </li>

                {/* Profile Dropdown in Mobile */}
                {/* <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="flex items-center"
                >
                  Profile <FaChevronDown size={12} className="ml-1" />
                </button> */}
                {user ? (
                  <>
                    <li>
                      <Link to="/dashboard" onClick={closeMenu}>
                        {t("navbar.profile.dashboard")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/portfolio" onClick={closeMenu}>
                        {t("navbar.profile.Portfolio")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/create" onClick={closeMenu}>
                        {t("navbar.profile.settings")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/deposit" onClick={closeMenu}>
                        {t("navbar.depositbtn")}
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }}
                        className="bg-green-400 px-3 py-1 rounded text-black"
                      >
                        {t("navbar.profile.logout")}
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="bg-green-500 px-3 py-1 rounded"
                    >
                      Login
                    </Link>
                  </li>
                )}

                <li>
                  {/* Language Button */}
                  <LanguageToggle />
                </li>
                <li>
                  {/* darkmode button */}
                  <DarkModeToggle />
                </li>
              </ul>
            )}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ✅ Modal for not logged-in users */}
      <Modal
        open={depositModalOpen}
        title="Login Required"
        onClose={() => setDepositModalOpen(false)}
        actions={[
          {
            label: "Cancel",
            onClick: () => setDepositModalOpen(false),
            variant: "secondary",
          },
          {
            label: "Login",
            onClick: () => {
              setDepositModalOpen(false);
              navigate("/login");
            },
            variant: "primary",
          },
        ]}
      >
        You must be logged in to make a deposit.
      </Modal>
    </>
  );
};

export default Navbar;
