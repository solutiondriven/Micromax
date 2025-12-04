import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface LuxuryHeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function LuxuryHeader({ currentPage = "portfolio", onNavigate }: LuxuryHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.(page);
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
  };

  return (
    <header className="bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <button 
            onClick={handleNavClick("portfolio")}
            className="flex items-center flex-shrink-0"
          >
            <h1 className="text-base sm:text-xl md:text-2xl font-light tracking-[0.15em] sm:tracking-[0.2em] text-foreground whitespace-nowrap">
              IMPULSE HUB
            </h1>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-12">
              <button 
                onClick={handleNavClick("portfolio")}
                className={`transition-colors duration-200 text-sm tracking-wide font-light ${
                  currentPage === "portfolio" 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Portfolio
              </button>
              <button 
                onClick={handleNavClick("performance")}
                className={`transition-colors duration-200 text-sm tracking-wide font-light ${
                  currentPage === "performance" 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Performance
              </button>
              <button 
                onClick={handleNavClick("strategies")}
                className={`transition-colors duration-200 text-sm tracking-wide font-light ${
                  currentPage === "strategies" 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Earn
              </button>
            </nav>
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <nav className="flex flex-col space-y-4 pt-4">
              <button 
                onClick={handleNavClick("portfolio")}
                className={`text-left py-2 px-4 rounded-lg transition-colors duration-200 text-base tracking-wide font-light ${
                  currentPage === "portfolio" 
                    ? "text-foreground bg-muted" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Portfolio
              </button>
              <button 
                onClick={handleNavClick("performance")}
                className={`text-left py-2 px-4 rounded-lg transition-colors duration-200 text-base tracking-wide font-light ${
                  currentPage === "performance" 
                    ? "text-foreground bg-muted" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Performance
              </button>
              <button 
                onClick={handleNavClick("strategies")}
                className={`text-left py-2 px-4 rounded-lg transition-colors duration-200 text-base tracking-wide font-light ${
                  currentPage === "strategies" 
                    ? "text-foreground bg-muted" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Earn
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
