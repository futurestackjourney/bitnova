import { useState } from "react"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/FormAlert";
import Button from "../../components/Button";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [alertInfo, setAlertInfo] = useState(null);
  const navigate = useNavigate();

  // validation rules
  const validateField = (name, value) => {
    let error = "";

    if (name === "name" && !value.trim()) {
      error = "Name is required.";
    }
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = "Email is required.";
      else if (!emailRegex.test(value)) error = "Enter a valid email.";
    }
    if (name === "password") {
      if (value.length < 8) {
        error = "Password must be at least 8 characters.";
      } else if (!/[A-Z]/.test(value)) {
        error = "Password must include an uppercase letter.";
      } else if (!/\d/.test(value)) {
        error = "Password must include a number.";
      }
    }
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        error = "Passwords do not match.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // validate all fields
    Object.keys(formData).forEach((key) =>
      validateField(key, formData[key])
    );

    if (Object.values(errors).some((err) => err)) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // store extra fields
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        balance: 1000,
      });

      setAlertInfo({
        title: "Signup successful 🎉",
        message: "Your account has been created. Redirecting to login...",
      });

      // auto-redirect after short delay
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setAlertInfo({
        title: "Signup failed",
        message: error.message,
      });
    }
  };

  return (
    <section className="min-h-screen px-4 py-8 flex items-center justify-center bg-cover bg-center bg-no-repeat bg-zinc-100/40 dark:bg-black/40 bg-blend-overlay"
      style={{ backgroundImage: "url('/images/tiles3.jpg')" }}>
      
      <div className="w-full max-w-md mt-20 bg-zinc-900/40 backdrop-blur-sm border border-zinc-700 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl text-center font-bold mb-6">Create your account</h2>

        <form className="space-y-5" onSubmit={handleSignup}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:ring focus:ring-blue-500/40 outline-none transition"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <p className="text-red-400 text-sm mb-2">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:ring focus:ring-blue-500/40 outline-none transition"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <p className="text-red-400 text-sm mb-2">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:ring focus:ring-blue-500/40 outline-none transition"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="text-red-400 text-sm mb-2">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 mb-4 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:ring focus:ring-blue-500/40 outline-none transition"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mb-2">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center w-full">
            <Button
              text="Signup"
              type="submit"
              className="w-full sm:w-1/2 mx-auto rounded-lg bg-green-600 text-white group font-semibold"
            />
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </div>
      </div>
      
      {/* Modal Alert */}
      <Modal
        open={!!alertInfo}
        title={alertInfo?.title || "Notice"}
        onClose={() => {
          setAlertInfo(null);
          navigate("/login");
        }}
        actions={[
          {
            label: "OK",
            variant: "primary",
            onClick: () => {
              setAlertInfo(null);
              navigate("/login");
            },
          },
        ]}
      >
        <div>{alertInfo?.message}</div>
      </Modal>
    </section>
  );
}
