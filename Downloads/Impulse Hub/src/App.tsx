import { useState, useEffect } from "react";
import { LuxuryHeader } from "./components/LuxuryHeader";
import { TraderCarousel } from "./components/TraderCarousel";
import { PortfolioDetailWindow } from "./components/PortfolioDetailWindow";
import { PerformanceCalendar } from "./components/PerformanceCalendar";
import { StrategiesPage } from "./components/StrategiesPage";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/sonner";
import veekayImage from "figma:asset/df43acffb47f86faa5339972d428774b41ecfc53.png";
import microMaxTypewriterImage from "figma:asset/de1a94f267fe9f6b569c65967cf01b482828aab2.png";
import microMaxSquareImage from "figma:asset/7dc9bead5ea6d71ca751daea18a95008a95c8bea.png";
import founderCircleImage from "figma:asset/99eff0283c23d899497ecb7a32d51314300a2c34.png";
import founderSquareImage from "figma:asset/c3a556c09155ef1a9e8593b5afebe7383653ae57.png";
import oluwaseunImage from "figma:asset/ec98d2b1d30170f5ab0627db0eb5fcceb83884a1.png";

const portfolios = [
  {
    id: 1,
    name: "IMPULSE HUB",
    description: "Visionary leadership driving the future of automated trading technology and blockchain innovation",
    trader: "Moses Odusanya",
    image: founderCircleImage,
    squareImage: founderSquareImage,
    badgeBg: "linear-gradient(135deg, rgba(101, 67, 33, 0.95) 0%, rgba(139, 91, 47, 0.95) 50%, rgba(92, 64, 39, 0.95) 100%)",
    badgeText: "#f5f5dc",
    tiers: ["Founder", "Innovator", "Visionary"],
    performance: "Strategic Vision",
    risk: "Transformative"
  },
  {
    id: 2,
    name: "ALPHA GENERATOR",
    description: "Institutional-grade quantitative strategies",
    trader: "MicroMax",
    image: microMaxTypewriterImage,
    squareImage: microMaxSquareImage,
    badgeBg: "linear-gradient(135deg, rgba(20, 40, 80, 0.95) 0%, rgba(15, 50, 70, 0.95) 50%, rgba(25, 35, 60, 0.95) 100%)",
    badgeText: "#ffffff",
    tiers: ["Basic", "Pro", "Elite"],
    performance: "+234.7%",
    risk: "Medium-High"
  },
  {
    id: 3,
    name: "Elite Trader MOMENTUM",
    description: "$1,000 funded account managed with advanced risk control",
    trader: "Oluwaseun Odusanya",
    image: oluwaseunImage,
    squareImage: oluwaseunImage,
    tiers: ["Basic", "Pro", "Elite"],
    performance: "+127.5%",
    risk: "Low-Medium"
  },
  {
    id: 4,
    name: "Elite MASTER FX",
    description: "4 years of Swing & Scalp Trading expertise using Price Action & Technical Analysis on Synthetic Indices and Currency Pairs",
    trader: "NWADIKE KELECHI VICTOR (Veekay)",
    image: veekayImage,
    squareImage: veekayImage,
    tiers: ["Basic", "Pro", "Elite"],
    performance: "+189.2%",
    risk: "Medium"
  }
];

function AppContent() {
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState<string>("portfolio");
  const { setAutoTheme } = useTheme();

  // Handle URL query param navigation for direct linking
  useEffect(() => {
    const handleQueryNavigation = () => {
      const params = new URLSearchParams(window.location.search);
      const section = params.get('section');
      
      if (section === 'bot-analyzer' || section === 'micromax') {
        // Navigate to portfolio page
        setCurrentPage("portfolio");
        
        // Set to MicroMax portfolio (index 1, id: 2)
        setCurrentPortfolioIndex(1);
        
        // Scroll to market analyzer section after portfolio loads
        setTimeout(() => {
          const element = document.getElementById('market-analyzer');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 1000); // Wait for portfolio to fully render
      } else if (
        section === 'infinity-network-rewards' || 
        section === 'infinity-referral-program' || 
        section === 'copy-trading-model' || 
        section === 'payment-copytrading' || 
        section === 'bot-setup'
      ) {
        setCurrentPage("strategies");
        // StrategiesPage will handle the scroll via its own effect check or event
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('navigateToSection', { detail: { section } }));
        }, 500);
      }
    };

    // Handle initial query on page load
    handleQueryNavigation();

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', handleQueryNavigation);
    
    return () => window.removeEventListener('popstate', handleQueryNavigation);
  }, []);

  // Handle automatic theme switching for MicroMax bot with animation timing
  useEffect(() => {
    if (currentPage === "portfolio") {
      const currentPortfolio = portfolios[currentPortfolioIndex];
      
      // Delay theme change to sync with carousel animation completion (0.8s duration)
      const timer = setTimeout(() => {
        // MicroMax bot (id: 2) should trigger dark theme
        if (currentPortfolio.id === 2) {
          setAutoTheme("dark");
        } else {
          setAutoTheme("light");
        }
      }, 400); // Half of the 0.8s animation duration for perfect timing
      
      return () => clearTimeout(timer);
    } else {
      // Reset to light theme when not on portfolio page
      setAutoTheme("light");
    }
  }, [currentPortfolioIndex, currentPage, setAutoTheme]);

  // Navigation handler to switch to a specific portfolio by ID
  const handleNavigateToPortfolio = (portfolioId: number) => {
    const portfolioIndex = portfolios.findIndex(p => p.id === portfolioId);
    if (portfolioIndex !== -1) {
      setCurrentPortfolioIndex(portfolioIndex);
    }
  };

  // Navigation handler to switch to a specific page and section
  const handleNavigateToPageWithSection = (page: string, section?: string) => {
    setCurrentPage(page);
    
    // Update URL query param
    if (section) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('section', section);
      window.history.pushState({}, '', newUrl);
      
      // Trigger section navigation after page renders
      setTimeout(() => {
        // Dispatch custom event for the page to listen to
        window.dispatchEvent(new CustomEvent('navigateToSection', { detail: { section } }));
      }, 100);
    } else {
      // Clear section param if navigating to a page without specific section
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('section');
      window.history.pushState({}, '', newUrl);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <LuxuryHeader currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>
      
      <div className="flex-1">
        {currentPage === "portfolio" ? (
          <>
            <TraderCarousel 
              portfolios={portfolios}
              onPortfolioChange={setCurrentPortfolioIndex}
              initialIndex={currentPortfolioIndex}
            />
            <PortfolioDetailWindow 
              portfolio={portfolios[currentPortfolioIndex]} 
              onNavigateToPortfolio={handleNavigateToPortfolio}
              onNavigateToPage={handleNavigateToPageWithSection}
            />
          </>
        ) : currentPage === "performance" ? (
          <PerformanceCalendar />
        ) : currentPage === "strategies" ? (
          <StrategiesPage />
        ) : (
          <div className="min-h-screen flex items-center justify-center pt-24">
            <div className="text-center">
              <h1 className="text-4xl mb-4">Coming Soon</h1>
              <p className="text-muted-foreground">This page is under construction</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="py-4 sm:py-6 px-4 sm:px-6 border-t border-border/20 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2025 IMPULSE HUB. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Toast Notifications */}
      <Toaster 
        position="bottom-right" 
        richColors 
        offset="24px"
        toastOptions={{
          className: "shadow-luxury",
          style: {
            padding: "16px 20px",
            gap: "12px",
            borderRadius: "12px",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            backdropFilter: "blur(20px)",
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="impulse-hub-theme">
      <AppContent />
    </ThemeProvider>
  );
}
