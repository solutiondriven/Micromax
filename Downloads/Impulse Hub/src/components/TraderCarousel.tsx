import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";

interface Portfolio {
  id: number;
  name: string;
  description: string;
  trader: string;
  image: string;
  squareImage?: string;
  badgeBg?: string;
  badgeText?: string;
  tiers: string[];
  performance: string;
  risk: string;
}

interface TraderCarouselProps {
  portfolios: Portfolio[];
  onPortfolioChange?: (index: number) => void;
  initialIndex?: number;
}

export function TraderCarousel({ portfolios, onPortfolioChange, initialIndex = 0 }: TraderCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isPausedByScroll, setIsPausedByScroll] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Update current index when initialIndex changes (for external navigation)
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Scroll detection to pause auto-play when viewing details
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Pause auto-play when scrolled down more than 30% of viewport height
      if (scrollY > windowHeight * 0.3) {
        setIsPausedByScroll(true);
      } else {
        setIsPausedByScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlay || isPausedByScroll) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % portfolios.length);
    }, 10000); // Speed up auto-play to 10 seconds

    return () => clearInterval(interval);
  }, [portfolios.length, isAutoPlay, isPausedByScroll]);

  // Notify parent of portfolio changes
  useEffect(() => {
    onPortfolioChange?.(currentIndex);
  }, [currentIndex, onPortfolioChange]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000); // Resume auto-play after 8 seconds
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % portfolios.length);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + portfolios.length) % portfolios.length);
  };

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const currentPortfolio = portfolios[currentIndex];

  return (
    <div 
      className="relative w-full min-h-screen bg-background overflow-hidden pt-20 sm:pt-24 md:pt-28"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      
      {/* Main Carousel Container */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 pt-8 sm:pt-4 md:pt-0 lg:-mt-24">
        <div className="w-full max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.1, 0.25, 1],
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            >
              {/* Mobile Title Section - Shows above image on mobile */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="lg:hidden order-1 text-center space-y-2 sm:space-y-3 pt-0 px-2"
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight leading-tight">
                  Impulse Trader {currentPortfolio.trader.split(' ')[0]}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
                  {currentPortfolio.description}
                </p>
              </motion.div>

              {/* Left Side - Content (Desktop Only) */}
              <div className="hidden lg:block space-y-8 lg:order-1">
                {/* Title Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-2"
                >
                  <h1 className="text-4xl lg:text-6xl font-medium tracking-tight">
                    Impulse Trader {currentPortfolio.trader.split(' ')[0]}
                  </h1>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-4"
                >
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                    {currentPortfolio.description}
                  </p>
                </motion.div>

                {/* Detail Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-4 pt-6 border-t border-border"
                >
                  <h3 className="text-xl font-medium">
                    Expert in {currentPortfolio.risk} Risk Strategies
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Delivering consistent performance with {currentPortfolio.performance} returns 
                    through advanced algorithmic trading and sophisticated risk management protocols.
                  </p>
                  
                  {/* Performance Stats */}
                  <div className="flex items-center gap-6 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-medium text-green-600 dark:text-green-400">
                        {currentPortfolio.performance}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Performance
                      </div>
                    </div>
                    <div className="w-px h-12 bg-border" />
                    <div className="text-center">
                      <div className="text-2xl font-medium">
                        {currentPortfolio.risk}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Risk Level
                      </div>
                    </div>
                  </div>

                  {/* Next Trader Button */}
                  <motion.button
                    onClick={nextSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-white/10 dark:bg-black/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 text-foreground rounded-full hover:bg-white/20 dark:hover:bg-black/20 hover:border-white/30 dark:hover:border-white/20 transition-all duration-300 group shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]"
                  >
                    <span className="text-sm font-medium">Next Trader</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Right Side - Trader Images Layout */}
              <div className="relative lg:order-2 order-2 w-full h-64 sm:h-80 md:h-96 lg:h-auto mt-2 sm:mt-0">
                {/* Main Trader Portrait - Center Area */}
                <div className="relative flex justify-center lg:justify-start lg:ml-16 h-full items-center pt-4 sm:pt-0">
                  {/* Blurred Background Images for Depth */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="absolute inset-0 translate-x-2 md:translate-x-4 translate-y-2 md:translate-y-4 scale-110"
                  >
                    <img
                      src={currentPortfolio.image}
                      alt=""
                      className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover rounded-full blur-lg image-blend-soft mx-auto"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ delay: 0.05, duration: 0.8 }}
                    className="absolute inset-0 translate-x-1 md:translate-x-2 translate-y-1 md:translate-y-2 scale-105"
                  >
                    <img
                      src={currentPortfolio.image}
                      alt=""
                      className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover rounded-full blur-sm image-blend-soft mx-auto"
                    />
                  </motion.div>

                  {/* Main Trader Image with Floating Animation */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1, 
                      y: 0,
                    }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="relative z-10 flex justify-center"
                  >
                    <motion.div
                      animate={{ 
                        y: [-4, 4, -4],
                        rotate: [-0.5, 0.5, -0.5]
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="relative"
                    >
                      <img
                        src={currentPortfolio.image}
                        alt={currentPortfolio.trader}
                        className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover rounded-full shadow-luxury hover:shadow-luxury-hover transition-all duration-500 image-blend-circular image-overlay-blend"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-full" />
                      
                      {/* Trader Name Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="absolute bottom-2 sm:bottom-3 md:bottom-6 left-2 sm:left-3 md:left-6 right-2 sm:right-3 md:right-6"
                      >
                        {currentPortfolio.badgeBg && currentPortfolio.badgeText ? (
                          // Custom styled badge for bots (MicroMax)
                          <div 
                            className="backdrop-blur-sm rounded-lg md:rounded-xl p-1.5 sm:p-2 md:p-4 shadow-lg"
                            style={{
                              background: currentPortfolio.badgeBg,
                              color: currentPortfolio.badgeText
                            }}
                          >
                            <div 
                              className="font-medium text-[10px] sm:text-xs md:text-sm leading-tight" 
                              style={{ color: currentPortfolio.badgeText }}
                            >
                              {currentPortfolio.trader}
                            </div>
                            <div 
                              className="text-[9px] sm:text-xs leading-tight"
                              style={{
                                opacity: 0.85,
                                color: currentPortfolio.badgeText
                              }}
                            >
                              {currentPortfolio.name}
                            </div>
                          </div>
                        ) : (
                          // Default theme-aware badge for human traders
                          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg md:rounded-xl p-1.5 sm:p-2 md:p-4 shadow-lg">
                            <div className="font-medium text-foreground text-[10px] sm:text-xs md:text-sm leading-tight">
                              {currentPortfolio.trader}
                            </div>
                            <div className="text-[9px] sm:text-xs text-muted-foreground leading-tight">
                              {currentPortfolio.name}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Next Portfolio Preview - Far Right Area - Hidden on mobile for better main image visibility */}
                <motion.div
                  key={`next-${currentIndex}`}
                  initial={{ scale: 0.6, opacity: 0, x: 100 }}
                  animate={{ scale: 0.75, opacity: 0.35, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="hidden lg:block absolute top-16 right-8 lg:right-16 z-0"
                >
                  <img
                    src={portfolios[(currentIndex + 1) % portfolios.length].image}
                    alt=""
                    className="w-44 h-44 lg:w-52 lg:h-52 object-cover rounded-full blur-md image-blend-soft opacity-50"
                  />
                </motion.div>
              </div>

              {/* Mobile Stats and Button Section - Shows below image on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="lg:hidden order-3 text-center space-y-4 sm:space-y-6 px-2"
              >
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-medium">
                    Expert in {currentPortfolio.risk} Risk Strategies
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
                    Delivering consistent performance with {currentPortfolio.performance} returns 
                    through advanced algorithmic trading and sophisticated risk management protocols.
                  </p>
                  
                  {/* Performance Stats */}
                  <div className="flex items-center justify-center gap-6 pt-4">
                    <div className="text-center">
                      <div className="text-xl font-medium text-green-600 dark:text-green-400">
                        {currentPortfolio.performance}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Performance
                      </div>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                      <div className="text-xl font-medium">
                        {currentPortfolio.risk}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Risk Level
                      </div>
                    </div>
                  </div>

                  {/* Next Trader Button */}
                  <motion.button
                    onClick={nextSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white/10 dark:bg-black/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 text-foreground rounded-full hover:bg-white/20 dark:hover:bg-black/20 hover:border-white/30 dark:hover:border-white/20 transition-all duration-300 group shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]"
                  >
                    <span className="text-sm font-medium">Next Trader</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>



      </div>
    </div>
  );
}