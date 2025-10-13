import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import Modal from "../../components/FormAlert";
import Button from "../../components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAlertInfo({
        title: "Login successful",
        message: "Welcome back! Redirecting to your dashboard...",
      });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      switch (error.code) {
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          message = "Invalid email or password. Please try again.";
          break;
        case "auth/too-many-requests":
          message = "Too many failed attempts. Try again later.";
          break;
        default:
          message = "Login failed. Please check your details and try again.";
      }

      setAlertInfo({
        title: "Login failed",
        message,
      });
    }
  };

  return (
    <section
      className="min-h-screen px-4 py-8 flex items-center justify-center bg-cover bg-center bg-no-repeat bg-blend-overlay bg-zinc-100/40 dark:bg-black/50"
      style={{ backgroundImage: "url('/images/tiles3.jpg')" }}
    >
      {/* <div className="absolute inset-0 bg-black/50"></div>  */}
      <div className=" mt-20 w-full max-w-md bg-zinc-900/40 backdrop-blur-sm border border-zinc-700 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Welcome Back 👋
          {/* Login */}
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:ring focus:ring-blue-500/40 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:ring focus:ring-blue-500/40 outline-none transition"
                required
              />
              {/* <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button> */}
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer "
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/reset-password"
              className="text-sm text-blue-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          {/* <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Login
          </button> */}
          <div className="flex justify-between items-center w-full">
            <Button
              text="Login"
              type="submit"
              className="w-full sm:w-1/2 mx-auto rounded-lg bg-green-600 text-white group font-sem"
              // icon={<FiLogIn className="hidden group-hover:block"/>}
            />
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Register now
          </Link>
        </p>
      </div>

      {/* Modal Alert */}
      <Modal
        open={!!alertInfo}
        title={alertInfo?.title || "Notice"}
        onClose={() => setAlertInfo(null)}
        actions={[
          {
            label: "OK",
            variant: "primary",
            onClick: () => setAlertInfo(null),
          },
        ]}
      >
        <div>{alertInfo?.message}</div>
      </Modal>
    </section>
  );
}
