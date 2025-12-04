"use client";

import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "hsl(var(--background))",
          "--success-text": "hsl(var(--foreground))",
          "--success-border": "rgba(34, 197, 94, 0.3)",
          "--error-bg": "hsl(var(--background))",
          "--error-text": "hsl(var(--foreground))",
          "--error-border": "rgba(239, 68, 68, 0.3)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "var(--popover)",
          color: "var(--popover-foreground)",
          border: "1px solid var(--border)",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };