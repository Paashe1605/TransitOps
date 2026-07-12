import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const navigate = useNavigate();

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

      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white dark:bg-gray-800 p-10 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Truck className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              TransitOps
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400 text-center">
                {error}
              </div>
            )}
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="sr-only" htmlFor="email-address">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-md border border-transparent bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
