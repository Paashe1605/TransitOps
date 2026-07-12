import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center hover:scale-105 active:scale-95"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
