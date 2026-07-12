import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Truck, Eye, EyeOff } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      setToken(data.access_token);

      // Decode JWT role (Basic implementation for hackathon)
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      setRole(payload.role);

      // Show premium overlay before navigating for seamless UX
      setShowOverlay(true);
      setTimeout(() => navigate("/"), 1200);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-slide-up-delayed {
            opacity: 0;
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          }
        `}
      </style>
      
      {/* Theme Toggle in Top Right */}
      <div className="absolute top-6 right-6 z-40">
        <ThemeToggle />
      </div>

      {/* Premium Glassmorphism Auth Transition Overlay */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: "rgba(10, 15, 30, 0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            animation: "fadeInOverlay 0.35s ease-out forwards",
          }}
        >
          <div className="relative flex items-center justify-center mb-8">
            {/* Outer fast rotating arc */}
            <svg
              className="absolute w-24 h-24 animate-spin"
              style={{ animationDuration: "1.1s" }}
              viewBox="0 0 96 96"
              fill="none"
            >
              <circle
                cx="48" cy="48" r="42"
                stroke="url(#arcGradA)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="70 194"
              />
              <defs>
                <linearGradient id="arcGradA" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
            {/* Inner slow counter-rotating arc */}
            <svg
              className="absolute w-16 h-16 animate-spin"
              style={{ animationDuration: "2.2s", animationDirection: "reverse" }}
              viewBox="0 0 64 64"
              fill="none"
            >
              <circle
                cx="32" cy="32" r="27"
                stroke="#818CF8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="28 141"
                strokeOpacity="0.55"
              />
            </svg>
            {/* Center glowing icon */}
            <div
              className="p-4 rounded-2xl"
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                boxShadow: "0 0 40px rgba(59, 130, 246, 0.18), 0 0 80px rgba(99, 102, 241, 0.08)",
              }}
            >
              <Truck className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <p
            className="text-slate-200 text-xs font-bold tracking-[0.3em] uppercase"
            style={{ animation: "pulseText 1.8s ease-in-out infinite" }}
          >
            Authenticating
          </p>
          <p className="text-slate-500 text-[10px] font-semibold mt-2 tracking-widest uppercase">
            TransitOps Fleet Management
          </p>
        </div>
      )}

      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
        <div className={`w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-gray-800 p-10 shadow-2xl border border-gray-100 dark:border-gray-700 transition-all ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="flex flex-col items-center">
            <div className="rounded-2xl bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 shadow-inner">
              <Truck className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              TransitOps
            </h2>
            <p className="mt-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              Sign in to your workspace
            </p>
          </div>

          <form className={`mt-8 space-y-6 ${mounted ? 'animate-slide-up-delayed' : 'opacity-0'}`} onSubmit={handleLogin}>
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400 text-center font-medium border border-red-100 dark:border-red-800/30">
                {error}
              </div>
            )}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="email-address">
                  Email Address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  className="relative block w-full appearance-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                  placeholder="admin@transitops.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    className="relative block w-full appearance-none rounded-xl border border-gray-300 pl-4 pr-12 py-3 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-xl border border-transparent bg-blue-600 py-3 px-4 text-sm font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
