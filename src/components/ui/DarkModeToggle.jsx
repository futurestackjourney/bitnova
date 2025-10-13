import { BiMoon, BiSun } from "react-icons/bi";
import { useTheme } from "../../context/ThemeContext";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-between h-8 w-14 rounded-full px- transition-colors bg-zinc-200 dark:bg-[#1c1c1c]  "
    >
      {/* Sun icon (light mode) */}
      <BiSun
        className={`absolute left-2 text-yellow-400 transition-opacity duration-300 ${
          theme === "dark" ? "opacity-0" && "z-10" : "opacity-100"
        }`}
        size={14}
      />

      {/* Moon icon (dark mode) */}
      <BiMoon
        className={`absolute right-2 text-gray-500 transition-opacity duration-300 ${
          theme === "dark" ? "opacity-100" : "opacity-0" && "z-10"
        }`}
        size={14}
      />

      {/* Knob */}
      <span
        className={`${
          theme === "dark"
            ? "translate-x-8 rotate-180 scale-110"
            : "translate-x-1 rotate-0 scale-100"
        } inline-block w-5 h-5 transform bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out`}
      />
    </button>
  );
};

export default DarkModeToggle;
