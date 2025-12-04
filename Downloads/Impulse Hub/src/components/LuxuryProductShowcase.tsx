import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const portfolios = [
  {
    id: 1,
    name: "IMPULSE PRO PORTFOLIO",
    description: "$1,000 funded account managed with advanced risk control",
    trader: "Marcus Chen",
    image: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFkZXIlMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODA4NzYwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tiers: ["Basic", "Pro", "Elite"],
    performance: "+127.5%",
    risk: "Low-Medium"
  },
  {
    id: 2,
    name: "MOMENTUM MASTER",
    description: "$5,000 algorithmic momentum trading with AI signals",
    trader: "Sarah Rodriguez",
    image: "https://images.unsplash.com/photo-1659353220597-71b8c6a56259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwZXhwZXJ0JTIwYnVzaW5lc3MlMjB3b21hbnxlbnwxfHx8fDE3NTgwODc2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tiers: ["Basic", "Pro", "Elite"],
    performance: "+189.2%",
    risk: "Medium"
  },
  {
    id: 3,
    name: "ALPHA GENERATOR",
    description: "$10,000 institutional-grade quantitative strategies",
    trader: "David Kim",
    image: "https://images.unsplash.com/photo-1653378972336-103e1ea62721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnZlc3RtZW50JTIwcG9ydGZvbGlvJTIwbWFuYWdlcnxlbnwxfHx8fDE3NTgwODc2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tiers: ["Basic", "Pro", "Elite"],
    performance: "+234.7%",
    risk: "Medium-High"
  },
  {
    id: 4,
    name: "CRYPTO ELITE FUND",
    description: "$25,000 cryptocurrency arbitrage and DeFi strategies",
    trader: "Emma Thompson",
    image: "https://images.unsplash.com/photo-1738750908048-14200459c3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBhZHZpc29yJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzU4MDg3NjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tiers: ["Basic", "Pro", "Elite"],
    performance: "+167.3%",
    risk: "High"
  }
];

interface LuxuryProductShowcaseProps {
  onPortfolioChange: (index: number) => void;
  currentIndex: number;
}

export function LuxuryProductShowcase({ onPortfolioChange, currentIndex }: LuxuryProductShowcaseProps) {
  const [selectedTier, setSelectedTier] = useState("");

  const currentPortfolio = portfolios[currentIndex];

  // Create lineup positions for all cards
  const getLineupPositions = () => {
    return portfolios.map((_, index) => {
      const relativeIndex = (index - currentIndex + portfolios.length) % portfolios.length;
      
      if (relativeIndex === 0) {
        // Main featured card
        return {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          blur: 0,
          zIndex: 10
        };
      } else {
        // Background lineup cards
        const lineupIndex = relativeIndex - 1;
        return {
          x: 200 + (lineupIndex * 120), // Spread them horizontally
          y: -100 - (lineupIndex * 30), // Elevate them up and back
          scale: 0.5 - (lineupIndex * 0.1), // Make them progressively smaller
          opacity: 0.6 - (lineupIndex * 0.15), // Fade them out
          blur: 2 + (lineupIndex * 2), // Progressive blur
          zIndex: 5 - lineupIndex
        };
      }
    });
  };

  const lineupPositions = getLineupPositions();

  const goToNextProduct = () => {
    const newIndex = (currentIndex + 1) % portfolios.length;
    onPortfolioChange(newIndex);
    setSelectedTier("");
  };

  return (
    <div className="bg-background overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8 items-center min-h-[900px]">
          
          {/* Left Side - Portfolio Details (Squeezed on smaller screens) */}
          <div className="col-span-4 sm:col-span-4 md:col-span-3 lg:col-span-4 space-y-4 md:space-y-6 lg:space-y-8 z-20 relative">
            <motion.div 
              key={currentPortfolio.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6"
            >
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-wider text-foreground leading-tight uppercase">
                {currentPortfolio.name}
              </h1>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest">Performance</span>
                  <span className="text-lg sm:text-xl md:text-2xl font-light text-foreground">{currentPortfolio.performance}</span>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest">Risk Level</span>
                  <span className="text-sm sm:text-base md:text-lg font-light text-foreground">{currentPortfolio.risk}</span>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest">Managed By</span>
                  <span className="text-sm sm:text-base md:text-lg font-light text-foreground">{currentPortfolio.trader}</span>
                </div>
              </div>
            </motion.div>

            {/* Tier Selection */}
            <div className="space-y-2 md:space-y-4">
              <h3 className="text-xs sm:text-sm tracking-widest text-foreground uppercase font-medium">Investment Tier</h3>
              <div className="flex gap-1 md:gap-2">
                {currentPortfolio.tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-2 sm:px-3 md:px-4 py-1 md:py-2 border transition-all duration-300 text-xs sm:text-sm ${
                      selectedTier === tier
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/50 text-foreground"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Simple Action */}
            <button 
              onClick={goToNextProduct}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 uppercase tracking-widest underline"
            >
              Next Portfolio →
            </button>
          </div>

          {/* Right Side - Trader Cards Lineup (Priority section - always prominent) */}
          <div className="col-span-8 sm:col-span-8 md:col-span-9 lg:col-span-8 relative h-full">
            <div 
              className="relative w-full h-full"
              style={{ 
                perspective: "2000px", 
                transformStyle: "preserve-3d" 
              }}
            >
              
              {/* Main Featured Card with Immediate Transitions */}
              <AnimatePresence>
                <motion.div
                  key={`main-${currentPortfolio.id}`}
                  initial={{ 
                    x: 300, 
                    y: -200,
                    scale: 0.8,
                    opacity: 0 
                  }}
                  animate={{ 
                    x: 0, 
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)"
                  }}
                  exit={{
                    x: -300,
                    y: 300,
                    scale: 0.6,
                    opacity: 0,
                    filter: "blur(8px)",
                    rotateZ: -15
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 25,
                    duration: 0.5
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ 
                    transformOrigin: "center center",
                    zIndex: 10
                  }}
                  onClick={goToNextProduct}
                >
                  <div className="relative">
                    <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-500">
                      <ImageWithFallback
                        src={currentPortfolio.image}
                        alt={currentPortfolio.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* 3D Effects for main card */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-foreground/5 via-transparent to-background/10 pointer-events-none" />
                    <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-radial-shadow rounded-full blur-3xl opacity-30" />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Background Lineup Cards */}
              {portfolios.map((portfolio, index) => {
                if (index === currentIndex) return null; // Skip the main card
                
                const position = lineupPositions[index];
                
                return (
                  <motion.div
                    key={`lineup-${portfolio.id}`}
                    initial={{ 
                      x: position.x + 200, 
                      y: position.y,
                      scale: position.scale,
                      opacity: 0 
                    }}
                    animate={{ 
                      x: position.x, 
                      y: position.y,
                      scale: position.scale,
                      opacity: position.opacity,
                      filter: `blur(${position.blur}px)`
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 25,
                      duration: 0.4
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ 
                      transformOrigin: "center center",
                      zIndex: position.zIndex
                    }}
                    onClick={() => onPortfolioChange(index)}
                  >
                    <div className="relative">
                      <div className="w-60 h-60 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-500">
                        <ImageWithFallback
                          src={portfolio.image}
                          alt={portfolio.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Overlay for lineup cards */}
                      <div className="absolute inset-0 rounded-2xl bg-background/20 pointer-events-none" />
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Click indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground font-light tracking-widest z-30">
                CLICK ANY CARD TO EXPLORE
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}