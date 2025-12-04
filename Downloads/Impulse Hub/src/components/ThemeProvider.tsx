import { createContext, useContext, useEffect, useState, useRef } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  autoTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setAutoTheme: (theme: Theme | null) => void;
  effectiveTheme: "dark" | "light";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  setAutoTheme: () => null,
  effectiveTheme: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "impulse-hub-theme",
  autoTheme,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [autoThemeOverride, setAutoThemeOverride] = useState<Theme | null>(null);
  const [effectiveTheme, setEffectiveTheme] = useState<"dark" | "light">("light");
  const hasManualOverride = useRef(false);

  // Determine the active theme
  // Manual theme choice takes precedence over auto theme
  const activeTheme = hasManualOverride.current ? theme : (autoThemeOverride || theme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    let resolvedTheme: "dark" | "light";

    if (activeTheme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
    } else {
      resolvedTheme = activeTheme as "dark" | "light";
    }

    root.classList.add(resolvedTheme);
    setEffectiveTheme(resolvedTheme);
  }, [activeTheme]);

  const value = {
    theme: activeTheme,
    effectiveTheme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
      hasManualOverride.current = true; // Mark that user has manually changed theme
      setAutoThemeOverride(null); // Clear auto override when manually setting theme
    },
    setAutoTheme: (newAutoTheme: Theme | null) => {
      // Only apply auto theme if user hasn't manually overridden
      if (!hasManualOverride.current) {
        setAutoThemeOverride(newAutoTheme);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};