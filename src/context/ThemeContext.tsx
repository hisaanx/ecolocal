import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeContextType = {
  nightMode: boolean;
  toggleNightMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [nightMode, setNightMode] = useState(false);

  // Optional: Load preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("eco-theme");
    if (stored === "dark") setNightMode(true);
  }, []);

  const toggleNightMode = () => {
    setNightMode((prev) => {
      const next = !prev;
      localStorage.setItem("eco-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ nightMode, toggleNightMode }}>
      <div className={nightMode ? "bg-gray-900 text-white" : "bg-white text-black"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
