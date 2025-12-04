import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import microMaxTypewriterImage from 'figma:asset/de1a94f267fe9f6b569c65967cf01b482828aab2.png';
import impulseCardImage from 'figma:asset/249e060a0ef9d37df1256ae136dee39ff3732be0.png';

interface Innovation {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  isReferralNetwork?: boolean;
  onClick?: () => void;
}

interface BidirectionalInnovationCarouselProps {
  innovations: Innovation[];
}

export function BidirectionalInnovationCarousel({ innovations }: BidirectionalInnovationCarouselProps) {
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  
  // Card width + gap (420px + 24px gap)
  const cardWidth = 444;
  
  // The "IMPULSE Network Marketing Ecosystem" is the 3rd card (index 2)
  // When we reach it, we want to reverse direction
  const networkMarketingCardIndex = 2;
  const maxScroll = networkMarketingCardIndex * cardWidth;

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(prev => prev === "forward" ? "backward" : "forward");
    }, 120000); // Switch direction every 2 minutes - very slow luxury timing - 3x slower for luxury pacing

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.4 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl"
    >
      <motion.div
        className="flex items-center space-x-6 py-2"
        animate={{
          x: direction === "forward" ? [-maxScroll, 0] : [0, -maxScroll]
        }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {/* Render multiple sets for seamless scrolling */}
        {[...Array(3)].map((_, setIndex) => (
          innovations.map((innovation) => (
            <div
              key={`set-${setIndex}-${innovation.id}`}
              onClick={innovation.onClick}
              className={`min-w-[420px] w-[420px] h-96 rounded-3xl overflow-hidden bg-card border border-border/50 hover:scale-[1.02] transition-all duration-500 group flex-shrink-0 ${innovation.onClick ? 'cursor-pointer' : ''}`}
            >
              <div className="relative h-full">
                {/* Category badge */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="text-xs font-medium tracking-widest uppercase bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 text-muted-foreground shadow-lg">
                    {innovation.category}
                  </div>
                </div>
                
                {/* Image with overlay or Referral Network */}
                <div className="relative h-3/5 overflow-hidden">
                  {innovation.isReferralNetwork ? (
                    <div className="w-full h-full relative overflow-hidden bg-black">
                      {/* Central white light radiating outward */}
                      <div className="absolute inset-0">
                        {/* Main central light source */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-white/25 via-white/10 to-transparent rounded-full animate-pulse" />
                        
                        {/* Secondary light layers for depth */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-radial from-white/35 via-white/15 to-transparent rounded-full animate-pulse delay-500" />
                        
                        {/* Core bright center */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-radial from-white/45 via-white/20 to-transparent rounded-full animate-pulse delay-1000" />
                        
                        {/* Animated light rays */}
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-radial from-white/20 via-white/8 to-transparent animate-pulse delay-200" />
                        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-radial from-white/15 via-white/6 to-transparent animate-pulse delay-700" />
                        <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full bg-gradient-radial from-white/18 via-white/7 to-transparent animate-pulse delay-1200" />
                        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 rounded-full bg-gradient-radial from-white/12 via-white/5 to-transparent animate-pulse delay-900" />
                      </div>
                      
                      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
                        {/* Network Connection Lines */}
                        <div className="absolute inset-0 pointer-events-none">
                          <svg className="w-full h-full" viewBox="0 0 400 300">
                            {/* Animated connection lines */}
                            <defs>
                              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgb(255 255 255)" stopOpacity="0.4" />
                                <stop offset="50%" stopColor="rgb(255 255 255)" stopOpacity="0.7" />
                                <stop offset="100%" stopColor="rgb(255 255 255)" stopOpacity="0.3" />
                              </linearGradient>
                            </defs>
                            
                            {/* Central hub to satellites */}
                            <motion.line 
                              x1="200" y1="150" x2="120" y2="220"
                              stroke="url(#connectionGradient)" 
                              strokeWidth="2"
                              strokeDasharray="5,5"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 0.7 }}
                              transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
                            />
                            <motion.line 
                              x1="200" y1="150" x2="280" y2="220"
                              stroke="url(#connectionGradient)" 
                              strokeWidth="2"
                              strokeDasharray="5,5"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 0.7 }}
                              transition={{ duration: 2, delay: 0.8, repeat: Infinity, repeatType: "reverse" }}
                            />
                            <motion.line 
                              x1="200" y1="150" x2="320" y2="120"
                              stroke="url(#connectionGradient)" 
                              strokeWidth="2"
                              strokeDasharray="5,5"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 0.7 }}
                              transition={{ duration: 2, delay: 1.1, repeat: Infinity, repeatType: "reverse" }}
                            />
                            <motion.line 
                              x1="200" y1="150" x2="80" y2="120"
                              stroke="url(#connectionGradient)" 
                              strokeWidth="2"
                              strokeDasharray="5,5"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 0.7 }}
                              transition={{ duration: 2, delay: 1.4, repeat: Infinity, repeatType: "reverse" }}
                            />
                            <motion.line 
                              x1="200" y1="150" x2="200" y2="80"
                              stroke="url(#connectionGradient)" 
                              strokeWidth="2"
                              strokeDasharray="5,5"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 0.7 }}
                              transition={{ duration: 2, delay: 1.7, repeat: Infinity, repeatType: "reverse" }}
                            />
                          </svg>
                        </div>

                        {/* Central Main Avatar - Enhanced */}
                        <motion.div 
                          className="mb-8 relative"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.8 }}
                        >
                          {/* Pulsing rings around main avatar - white light themed */}
                          <motion.div 
                            className="absolute inset-0 w-28 h-28 rounded-full border-2 border-white/40"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                          <motion.div 
                            className="absolute inset-0 w-28 h-28 rounded-full border border-white/30"
                            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                          />
                          
                          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 flex items-center justify-center shadow-2xl border-2 border-white/50">
                            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 via-white/10 to-transparent" />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="relative z-10 w-14 h-14">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                        </motion.div>

                        {/* Satellite Referral Avatars - Enhanced with staggered positions */}
                        <div className="relative">
                          {/* Upper satellite */}
                          <motion.div 
                            className="absolute -top-16 left-1/2 transform -translate-x-1/2"
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                          >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 flex items-center justify-center shadow-xl border-2 border-white/40 hover:scale-110 transition-transform duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                            </div>
                          </motion.div>

                          {/* Lower ring of satellites */}
                          <div className="flex items-center gap-4">
                            {[...Array(4)].map((_, i) => (
                              <motion.div 
                                key={i}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 + (i * 0.1) }}
                                whileHover={{ scale: 1.1, y: -2 }}
                              >
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                                  i % 2 === 0 
                                    ? 'from-gray-600 via-gray-700 to-gray-800' 
                                    : 'from-gray-700 via-gray-800 to-gray-900'
                                } flex items-center justify-center shadow-lg border border-white/30 transition-all duration-300`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                  </svg>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Data flow particles */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-gradient-to-r from-white/60 to-white/30 rounded-full"
                              initial={{ 
                                x: Math.random() * 100 + '%',
                                y: Math.random() * 100 + '%',
                                scale: 0
                              }}
                              animate={{ 
                                x: [Math.random() * 100 + '%', Math.random() * 100 + '%', Math.random() * 100 + '%'],
                                y: [Math.random() * 100 + '%', Math.random() * 100 + '%', Math.random() * 100 + '%'],
                                scale: [0, 1, 0]
                              }}
                              transition={{ 
                                duration: 4 + (i * 0.5), 
                                repeat: Infinity,
                                delay: i * 0.3
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageWithFallback
                        src={innovation.image}
                        alt={innovation.title}
                        className={`w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700 ${innovation.id === 2 ? 'object-center' : ''}`}
                        style={innovation.id === 2 ? { objectPosition: 'center 58%' } : undefined}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
                    </>
                  )}
                </div>
                
                {/* Content section */}
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-card via-card/98 to-card/95 backdrop-blur-sm p-8 space-y-3">
                  <h4 className="text-xl font-medium text-foreground leading-tight tracking-wide">
                    {innovation.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {innovation.description}
                  </p>
                  
                  {/* Decorative line with brown suit theme */}
                  <div className="pt-3">
                    <div className="h-px w-12 bg-gradient-to-r from-amber-600/50 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ))}
      </motion.div>
      
      {/* Direction indicator - subtle visual cue */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 font-mono">
        {direction === "forward" ? "→" : "←"}
      </div>
    </motion.div>
  );
}