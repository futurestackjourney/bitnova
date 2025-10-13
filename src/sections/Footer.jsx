import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaGithub,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-card-light dark:bg-[#0d0d0d] text-zinc-500 dark:text-zinc-300 pt-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-zinc-300 dark:border-zinc-700 pb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 8H14C15.1046 8 16 8.89543 16 10C16 11.1046 15.1046 12 14 12M10 8V12M10 8H8.5M10 8V6.5M14 12H10M14 12C15.1046 12 16 12.8954 16 14C16 15.1046 15.1046 16 14 16H10M10 12V16M10 16H8.5M10 16V17.5M13 8V6.5M13 17.5V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#05df72"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-2xl font-bold text-green-400">BitNova</span>
            </div>
            <p className="text-sm text-gray-400">
              Your smart investment partner. Trade. Track. Triumph.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-zinc-900 dark:text-white font-medium mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-400">Home</Link></li>
              <li><Link to="/about" className="hover:text-green-400">About</Link></li>
              <li><Link to="/news" className="hover:text-green-400">News</Link></li>
              <li><Link to="/contact" className="hover:text-green-400">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-zinc-900 dark:text-white font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-green-400">Help Center</a></li>
              <li><a className="hover:text-green-400">Terms & Conditions</a></li>
              <li><a className="hover:text-green-400">Privacy Policy</a></li>
              <li><a className="hover:text-green-400">Documentation</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-zinc-900 dark:text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><FaPhone /> +923 654987</li>
              <li className="flex items-center gap-2"><FaEnvelope /> bitnova@support.com</li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt /> London, UK</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 mt-8 pb-6">
          <p>
            © {new Date().getFullYear()} BitNova. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://twitter.com" target="_blank" className="hover:text-green-400"><FaTwitter /></a>
            <a href="https://github.com" target="_blank" className="hover:text-green-400"><FaGithub /></a>
            <a href="https://instagram.com" target="_blank" className="hover:text-green-400"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
