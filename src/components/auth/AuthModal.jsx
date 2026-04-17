import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { FiMail, FiLock, FiUser, FiAlertCircle } from "react-icons/fi";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLogin ? "Welcome Back" : "Create Account"}
    >
      <div className="flex flex-col gap-6">
        {/* Toggle Links */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl">
          <button
            className={`flex-1 py-2 text-base font-medium rounded-lg transition-all ${isLogin ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-base font-medium rounded-lg transition-all ${!isLogin ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 text-sm text-red-600 bg-red-50 rounded-xl animate-in fade-in slide-in-from-top-1">
              <FiAlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="text-black w-full pl-12 pr-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="text-black w-full pl-12 pr-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="text-black w-full pl-12 pr-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="solid"
            className="w-full !py-3 !mt-2 bg-primary hover:bg-primary/90 text-white text-base font-semibold disabled:opacity-70 rounded-xl"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              isLogin ? "Login Now" : "Create Account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 px-4">
          By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </Modal>
  );
};

export default AuthModal;
