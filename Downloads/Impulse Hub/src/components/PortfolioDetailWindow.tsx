import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, TrendingUp, Settings, Search, Activity, BarChart3, TrendingDown, BadgeCheck } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BidirectionalInnovationCarousel } from "./BidirectionalInnovationCarousel";
import { useTheme } from "./ThemeProvider";
import oluwaseunCert1 from 'figma:asset/0600792fe9b7ba1636fc1d618e63ecbcf6759c00.png';
import oluwaseunCert2 from 'figma:asset/735cb7bdad4a9761c511dbcba27a416ec16aa81a.png';
import oluwaseunCert3 from 'figma:asset/088263dd7741e9b6b118cce451b4bd60e83689c0.png';
import impulseCardImage from 'figma:asset/249e060a0ef9d37df1256ae136dee39ff3732be0.png';
import microMaxTypewriterImage from 'figma:asset/de1a94f267fe9f6b569c65967cf01b482828aab2.png';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

interface Portfolio {
  id: number;
  name: string;
  description: string;
  trader: string;
  image: string;
  squareImage?: string;
  tiers: string[];
  performance: string;
  risk: string;
}

interface PortfolioDetailWindowProps {
  portfolio: Portfolio;
  onNavigateToPortfolio?: (portfolioId: number) => void;
  onNavigateToPage?: (page: string, section?: string) => void;
}

interface TradingIndicators {
  rsi: number;
  volatility: string;
  trend: string;
  support: string;
  resistance: string;
  signal: string;
}

export function PortfolioDetailWindow({ portfolio, onNavigateToPortfolio, onNavigateToPage }: PortfolioDetailWindowProps) {
  const { effectiveTheme } = useTheme();
  const [selectedTier, setSelectedTier] = useState("");
  const [symbol, setSymbol] = useState("");
  const [priceResult, setPriceResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [marketType, setMarketType] = useState<"crypto" | "forex">("crypto");
  const [indicators, setIndicators] = useState<TradingIndicators | null>(null);
  const [chartSymbol, setChartSymbol] = useState("BINANCE:BTCUSDT");
  const [showChart, setShowChart] = useState(false);

  // Calculate RSI (Relative Strength Index) - simplified version
  const calculateRSI = (price: number, randomSeed: number): number => {
    // Simulated RSI calculation based on price and random factors
    const baseRSI = 50;
    const priceInfluence = (price % 100) / 2;
    const randomFactor = (randomSeed % 30) - 15;
    const rsi = Math.max(0, Math.min(100, baseRSI + priceInfluence + randomFactor));
    return Math.round(rsi * 10) / 10;
  };

  // Calculate support and resistance levels using Fibonacci retracements
  const calculateSupportResistance = (price: number): { support: string; resistance: string } => {
    const fibLevels = [0.236, 0.382, 0.5, 0.618, 0.786];
    const swingHigh = price * 1.15; // Simulated swing high
    const swingLow = price * 0.85; // Simulated swing low
    const range = swingHigh - swingLow;
    
    // Calculate nearest support (below current price)
    const supportLevel = swingLow + (range * fibLevels[1]); // 38.2% retracement
    // Calculate nearest resistance (above current price)
    const resistanceLevel = swingLow + (range * fibLevels[3]); // 61.8% retracement
    
    return {
      support: supportLevel.toFixed(2),
      resistance: resistanceLevel.toFixed(2)
    };
  };

  // Calculate volatility using price-based ATR simulation
  const calculateVolatility = (price: number): string => {
    const atr = price * (0.02 + Math.random() * 0.03); // Average True Range simulation
    const volatilityPercent = (atr / price) * 100;
    
    if (volatilityPercent < 1.5) return "Low";
    if (volatilityPercent < 3) return "Medium";
    return "High";
  };

  // Detect trend using simple moving average logic
  const detectTrend = (price: number, rsi: number): string => {
    if (rsi > 60) return "Bullish";
    if (rsi < 40) return "Bearish";
    return "Neutral";
  };

  // Generate trading signal
  const generateSignal = (rsi: number, trend: string, volatility: string): string => {
    if (rsi > 70) return "Overbought - Consider Selling";
    if (rsi < 30) return "Oversold - Consider Buying";
    if (trend === "Bullish" && rsi > 50) return "Strong Buy Signal";
    if (trend === "Bearish" && rsi < 50) return "Strong Sell Signal";
    return "Hold - Wait for Confirmation";
  };

  // Calculate trading indicators
  const calculateIndicators = (price: number, symbol: string): TradingIndicators => {
    const randomSeed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rsi = calculateRSI(price, randomSeed);
    const { support, resistance } = calculateSupportResistance(price);
    const volatility = calculateVolatility(price);
    const trend = detectTrend(price, rsi);
    const signal = generateSignal(rsi, trend, volatility);

    return {
      rsi,
      volatility,
      trend,
      support,
      resistance,
      signal
    };
  };

  // CoinGecko API for Crypto
  const fetchFromCoinGecko = async (symbol: string): Promise<number | null> => {
    const symbolMap: { [key: string]: string } = {
      'btc': 'bitcoin',
      'eth': 'ethereum',
      'usdt': 'tether',
      'bnb': 'binancecoin',
      'sol': 'solana',
      'xrp': 'ripple',
      'usdc': 'usd-coin',
      'ada': 'cardano',
      'doge': 'dogecoin',
      'avax': 'avalanche-2',
      'shib': 'shiba-inu',
      'dot': 'polkadot',
      'matic': 'matic-network',
      'link': 'chainlink',
      'trx': 'tron',
      'dai': 'dai',
      'uni': 'uniswap',
      'atom': 'cosmos',
      'etc': 'ethereum-classic',
      'xlm': 'stellar',
      'ltc': 'litecoin',
      'bch': 'bitcoin-cash',
      'near': 'near',
      'algo': 'algorand',
      'vet': 'vechain',
      'icp': 'internet-computer',
      'fil': 'filecoin',
      'apt': 'aptos',
      'arb': 'arbitrum',
      'op': 'optimism',
    };
    
    const coinId = symbolMap[symbol] || symbol;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('CoinGecko API failed');
      
      const data = await response.json();
      
      if (data[coinId] && data[coinId].usd) {
        return data[coinId].usd;
      }
      
      return null;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // Binance API for Crypto (fallback)
  const fetchFromBinance = async (symbol: string): Promise<number | null> => {
    const binanceSymbol = `${symbol.toUpperCase()}USDT`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Binance API failed');
      
      const data = await response.json();
      
      if (data.price) {
        return parseFloat(data.price);
      }
      
      return null;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // Frankfurter API for Forex (Primary)
  const fetchForexFromFrankfurter = async (pair: string): Promise<number | null> => {
    // Parse forex pair (e.g., EURUSD -> EUR/USD)
    const base = pair.substring(0, 3).toUpperCase();
    const quote = pair.substring(3, 6).toUpperCase();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(
        `https://api.frankfurter.app/latest?from=${base}&to=${quote}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Frankfurter API failed');
      
      const data = await response.json();
      
      if (data.rates && data.rates[quote]) {
        return data.rates[quote];
      }
      
      return null;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // ExchangeRate-API for Forex (Fallback)
  const fetchForexFromExchangeRate = async (pair: string): Promise<number | null> => {
    const base = pair.substring(0, 3).toUpperCase();
    const quote = pair.substring(3, 6).toUpperCase();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${base}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('ExchangeRate API failed');
      
      const data = await response.json();
      
      if (data.rates && data.rates[quote]) {
        return data.rates[quote];
      }
      
      return null;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // Fetch crypto price with fallback
  const fetchCryptoPrice = async (symbolInput: string): Promise<number | null> => {
    // Try CoinGecko first
    try {
      const price = await fetchFromCoinGecko(symbolInput);
      if (price) return price;
    } catch (error) {
      console.log('CoinGecko failed, trying Binance...');
    }
    
    // Fallback to Binance
    try {
      const price = await fetchFromBinance(symbolInput);
      if (price) return price;
    } catch (error) {
      console.log('Binance failed');
    }
    
    return null;
  };

  // Fetch forex price with fallback
  const fetchForexPrice = async (pair: string): Promise<number | null> => {
    // Try Frankfurter first
    try {
      const price = await fetchForexFromFrankfurter(pair);
      if (price) return price;
    } catch (error) {
      console.log('Frankfurter failed, trying ExchangeRate-API...');
    }
    
    // Fallback to ExchangeRate-API
    try {
      const price = await fetchForexFromExchangeRate(pair);
      if (price) return price;
    } catch (error) {
      console.log('ExchangeRate-API failed');
    }
    
    return null;
  };

  // Main fetch function
  const fetchPrice = async () => {
    if (!symbol.trim()) return;
    
    setIsLoading(true);
    setPriceResult("");
    setIndicators(null);
    
    const symbolInput = symbol.toLowerCase().trim();
    let price: number | null = null;
    let displaySymbol = symbolInput.toUpperCase();
    
    try {
      if (marketType === "crypto") {
        price = await fetchCryptoPrice(symbolInput);
      } else {
        // Forex - ensure it's a 6-character pair
        if (symbolInput.length !== 6) {
          setPriceResult(`Hello, I'm MicroMax. Please enter a valid forex pair (e.g., EURUSD, GBPUSD).`);
          setIsLoading(false);
          return;
        }
        price = await fetchForexPrice(symbolInput);
        displaySymbol = `${symbolInput.substring(0, 3).toUpperCase()}/${symbolInput.substring(3, 6).toUpperCase()}`;
      }
      
      if (price) {
        const formattedPrice = price.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: marketType === "forex" ? 5 : 2
        });
        
        // Calculate trading indicators
        const tradingIndicators = calculateIndicators(price, symbolInput);
        setIndicators(tradingIndicators);
        
        // Set TradingView symbol
        setChartSymbol(marketType === "crypto" ? `BINANCE:${symbolInput.toUpperCase()}USDT` : `FX:${symbolInput.toUpperCase()}`);
        
        setPriceResult(`Hello, I'm MicroMax. ${displaySymbol} price is $${formattedPrice}`);
      } else {
        setPriceResult(`Hello, I'm MicroMax. Sorry, I couldn't find price data for "${symbol}". ${marketType === "crypto" ? "Try BTC, ETH, SOL, or other major cryptocurrencies." : "Try EURUSD, GBPUSD, USDJPY, or other major forex pairs."}`);
      }
    } catch (error) {
      setPriceResult(`Hello, I'm MicroMax. Error fetching price data. Attempting to reconnect...`);
      
      // Retry once after 1 second
      setTimeout(async () => {
        try {
          let retryPrice: number | null = null;
          if (marketType === "crypto") {
            retryPrice = await fetchCryptoPrice(symbolInput);
          } else {
            retryPrice = await fetchForexPrice(symbolInput);
          }
          
          if (retryPrice) {
            const formattedPrice = retryPrice.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: marketType === "forex" ? 5 : 2
            });
            
            const tradingIndicators = calculateIndicators(retryPrice, symbolInput);
            setIndicators(tradingIndicators);
            
            // Set TradingView symbol
            setChartSymbol(marketType === "crypto" ? `BINANCE:${symbolInput.toUpperCase()}USDT` : `FX:${symbolInput.toUpperCase()}`);
            
            setPriceResult(`Hello, I'm MicroMax. ${displaySymbol} price is $${formattedPrice}`);
          } else {
            setPriceResult(`Hello, I'm MicroMax. Unable to fetch data after retry. Please try again later.`);
          }
        } catch (retryError) {
          setPriceResult(`Hello, I'm MicroMax. Unable to fetch data after retry. Please try again later.`);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
      
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchPrice();
    }
  };

  const highlights = [
    {
      icon: Shield,
      title: "Risk Management",
      description: "Advanced stop-loss and position sizing"
    },
    {
      icon: TrendingUp,
      title: "Profit Split 70%",
      description: "Keep 70% of all profits generated"
    },
    {
      icon: Settings,
      title: "Leverage Options",
      description: "Configurable 1:10 to 1:100 leverage"
    }
  ];

  // Oluwaseun's certificates - only for portfolio id 3
  const oluwaseunCertificates = [
    {
      id: 1,
      title: "FUNDED CERTIFICATE",
      issuer: "NAIRATRADER",
      recipient: "Oluwaseun Odusanya",
      image: oluwaseunCert1
    },
    {
      id: 2,
      title: "PAYOUT CERTIFICATE", 
      issuer: "NAIRATRADER",
      recipient: "Oluwaseun Odusanya",
      image: oluwaseunCert2
    },
    {
      id: 3,
      title: "CERTIFICATE OF RECOGNITION",
      issuer: "FUNDS FOR TRADERS",
      recipient: "Oluwaseun Odusanya",
      image: oluwaseunCert3
    }
  ];

  // Moses's innovations - only for portfolio id 1
  const mosesInnovations = [
    {
      id: 1,
      title: "MicroMax Trading Bot",
      description: "AI-powered algorithmic trading system with institutional-grade analytics",
      category: "Artificial Intelligence",
      image: microMaxTypewriterImage,
      onClick: () => {
        if (onNavigateToPortfolio) {
          onNavigateToPortfolio(2);
          // Update URL query param for direct linking
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('section', 'bot-analyzer');
          window.history.pushState({}, '', newUrl);
          
          setTimeout(() => {
            const element = document.getElementById('market-analyzer');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 500);
        }
      }
    },
    {
      id: 2,
      title: "IMPULSE Coin",
      description: "Revolutionary cryptocurrency powering the IMPULSE trading ecosystem",
      category: "Blockchain Innovation",
      image: impulseCardImage,
      onClick: () => {
        window.open('https://impulsecoin.tech', '_blank');
      }
    },
    {
      id: 3,
      title: "IMPULSE Network Marketing Ecosystem",
      description: "Revolutionary copy-trading platform with infinity referral rewards for verified traders",
      category: "Network Innovation",
      image: "https://images.unsplash.com/photo-1646579886741-12b59840c63f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwbWFya2V0aW5nJTIwdGVhbSUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzU5Njk1ODMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      isReferralNetwork: true,
      onClick: () => {
        if (onNavigateToPage) {
          onNavigateToPage('strategies', 'infinity-network-rewards');
        }
      }
    }
  ];

  return (
    <div className="bg-background min-h-screen py-12 sm:py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className={`bg-card rounded-2xl md:rounded-3xl shadow-luxury p-6 md:p-12 space-y-8 md:space-y-12 ${
            portfolio.id === 3 
              ? 'border border-amber-200/30 dark:border-amber-800/20 bg-gradient-to-br from-card via-amber-50/5 to-card dark:from-card dark:via-amber-950/5 dark:to-card' 
              : ''
          }`}
        >
          {/* Large floating trader image */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-2xl md:rounded-3xl overflow-hidden shadow-luxury-hover relative">
                <ImageWithFallback
                  src={portfolio.squareImage || portfolio.image}
                  alt={portfolio.trader}
                  className="w-full h-full object-cover"
                />
                {/* Enhanced blur gradient overlay - vintage effect in dark mode only */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-0% via-background/20 via-50% to-background/85 to-100% dark:from-black/40 dark:from-10% dark:via-black/70 dark:via-60% dark:to-black/95 dark:to-100% pointer-events-none" />
              </div>
              {/* Floating effect shadow */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-60 h-20 bg-foreground/10 rounded-full blur-2xl" />
            </motion.div>
          </div>

          {/* Portfolio title and amount */}
          <div className="text-center space-y-3 sm:space-y-4 px-2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-wider text-foreground uppercase leading-tight flex items-center justify-center gap-3"
            >
              {portfolio.name.split(' ').slice(0, 2).join(' ')}
              <BadgeCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-base sm:text-xl md:text-2xl font-light text-muted-foreground leading-relaxed"
            >
              {portfolio.id === 1 ? "Founder & Chief Innovation Officer" : `${portfolio.description.split(' ').slice(0, 2).join(' ')} Funded Account`}
            </motion.p>
          </div>



          {/* Description paragraph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              {portfolio.id === 1 ? (
                "Visionary founder and technology innovator who revolutionized automated trading through groundbreaking AI development, blockchain integration, and the creation of the IMPULSE ecosystem. Leading the charge in fintech innovation with a focus on democratizing advanced trading technologies for global markets."
              ) : (
                "Experience an Automated dual-layer safety system where trades are closed if the market falls by 50% into StopLoss region, while positions that reach +50% profit are instantly secured at break-even. This portfolio ensures downside protection while allowing profits to run — a professional, institutional-grade safeguard designed to maximize long-term growth."
              )}
            </p>
          </motion.div>

          {/* Oluwaseun's certificates carousel (only for portfolio id 3) */}
          {portfolio.id === 3 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              {/* Certificates Carousel */}
              <div className="relative overflow-hidden">
                <div className="flex items-center space-x-6 animate-[scroll_25s_linear_infinite]">
                  {/* First set of certificates */}
                  {oluwaseunCertificates.map((certificate) => (
                    <div
                      key={`first-${certificate.id}`}
                      className="min-w-[350px] h-64 rounded-2xl overflow-hidden shadow-luxury-hover bg-card border border-border/50 hover:scale-105 transition-transform duration-300"
                    >
                      <div className="relative h-full">
                        <ImageWithFallback
                          src={certificate.image}
                          alt={certificate.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {oluwaseunCertificates.map((certificate) => (
                    <div
                      key={`second-${certificate.id}`}
                      className="min-w-[350px] h-64 rounded-2xl overflow-hidden shadow-luxury-hover bg-card border border-border/50 hover:scale-105 transition-transform duration-300"
                    >
                      <div className="relative h-full">
                        <ImageWithFallback
                          src={certificate.image}
                          alt={certificate.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Gradient fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
              </div>

              {/* Trading Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: "Experience", value: "3 Years", icon: Activity },
                  { label: "Win Rate", value: "60%", icon: TrendingUp },
                  { label: "Risk/Reward", value: "1:3", icon: Shield },
                  { label: "Monthly Return", value: "5%", icon: BarChart3 }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-700/20 via-orange-800/15 to-amber-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative p-4 md:p-6 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-yellow-50/10 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-yellow-950/10 rounded-2xl border border-amber-200/50 dark:border-amber-800/30 hover:border-amber-600/40 dark:hover:border-amber-500/40 transition-all duration-300 text-center space-y-2">
                      <stat.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto text-amber-700 dark:text-amber-400 mb-2" />
                      <div className="text-xl md:text-2xl font-medium tracking-tight text-foreground">{stat.value}</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trading Strategy Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/30 to-background dark:from-amber-950/20 dark:via-orange-950/10 dark:to-background p-8 md:p-10 border border-amber-200/50 dark:border-amber-800/30"
              >
                <div className="relative z-10 space-y-6">
                  <div className="text-center space-y-3">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-600/20">
                      <span className="text-sm font-medium tracking-widest uppercase text-amber-700 dark:text-amber-300">Trading Strategy</span>
                    </div>
                    <h3 className="text-2xl font-medium text-foreground">Pure Price Action with Directional Bias</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground uppercase tracking-wider">Trading Details</p>
                      <div className="space-y-2 text-muted-foreground">
                        <p><span className="font-medium text-foreground">Platform:</span> MT5 (MetaTrader 5)</p>
                        <p><span className="font-medium text-foreground">Style:</span> Day Trading</p>
                        <p><span className="font-medium text-foreground">Currency Pairs:</span> Any pair (flexible & adaptive)</p>
                        <p><span className="font-medium text-foreground">Max Drawdown:</span> 20%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground uppercase tracking-wider">Risk Management</p>
                      <div className="space-y-2 text-muted-foreground">
                        <p><span className="font-medium text-foreground">Risk Per Trade:</span> 2%</p>
                        <p><span className="font-medium text-foreground">Profit Factor:</span> 1:3</p>
                        <p><span className="font-medium text-foreground">Certification:</span> NairaTrader Certificate</p>
                        <p className="italic text-amber-700 dark:text-amber-300 pt-2">"Trade and Compound profit."</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-400/20 to-transparent rounded-full blur-3xl" />
              </motion.div>
            </motion.div>
          ) : portfolio.id === 1 ? (
            /* Moses's founder showcase - Premium brown suit layout */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
              {/* Achievement Metrics Grid with Brown Suit Theme */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Years Experience", value: "5+", icon: Activity },
                  { label: "Vision", value: "∞", icon: Shield },
                  { label: "Innovations", value: "3+", icon: TrendingUp }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-700/20 via-orange-800/15 to-amber-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative p-6 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-yellow-50/10 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-yellow-950/10 rounded-2xl border border-amber-200/50 dark:border-amber-800/30 hover:border-amber-600/40 dark:hover:border-amber-500/40 transition-all duration-300 text-center space-y-2">
                      <metric.icon className="w-8 h-8 mx-auto text-amber-700 dark:text-amber-400 mb-3" />
                      <div className="text-3xl font-light tracking-tight text-foreground">{metric.value}</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">{metric.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Vision Statement with Brown Suit Theme */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/30 to-background dark:from-amber-950/20 dark:via-orange-950/10 dark:to-background p-10 border border-amber-200/50 dark:border-amber-800/30"
              >
                <div className="relative z-10 space-y-4 text-center">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-600/20">
                    <span className="text-sm font-medium tracking-widest uppercase text-amber-700 dark:text-amber-300">Vision</span>
                  </div>
                  <p className="text-xl font-light leading-relaxed text-foreground max-w-3xl mx-auto">
                    "To democratize advanced trading technologies and empower global traders through innovative AI-driven solutions, blockchain integration, and cutting-edge fintech infrastructure."
                  </p>
                </div>
                {/* Decorative gradient orbs with brown tones */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-400/20 to-transparent rounded-full blur-3xl" />
              </motion.div>

              {/* Innovation Portfolio Section with Brown Suit Theme */}
              <div className="space-y-8">
                <div className="text-center space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    viewport={{ once: true }}
                    className="inline-block"
                  >
                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-4" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    viewport={{ once: true }}
                    className="text-3xl font-light tracking-wider text-foreground"
                  >
                    Innovation
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.3 }}
                    viewport={{ once: true }}
                    className="text-muted-foreground font-light"
                  >
                    Pioneering breakthroughs in automated trading & blockchain technology
                  </motion.p>
                </div>
                
                <BidirectionalInnovationCarousel innovations={mosesInnovations} />
              </div>

              {/* Leadership Philosophy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-6"
              >

              </motion.div>
            </motion.div>
          ) : portfolio.id === 4 ? (
            /* Three highlight icons for Veekay only */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center space-y-4 p-6 rounded-2xl hover:bg-accent/50 transition-colors duration-300"
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center">
                      <highlight.icon className="w-8 h-8 text-foreground" />
                    </div>
                  </div>
                  <h3 className="font-medium text-foreground tracking-wide">{highlight.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">{highlight.description}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : null}



          {/* MicroMax Live Price Checker with Trading Indicators - Only show for MicroMax bot */}
          {portfolio.id === 2 && (
            <motion.div
              id="market-analyzer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              viewport={{ once: true }}
              className="border-t border-border pt-12 mt-12"
            >
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-medium tracking-wide text-foreground">
                    Live Market Analysis
                  </h3>
                  <p className="text-muted-foreground">
                    Real-time prices with advanced trading indicators
                  </p>
                </div>

                {/* Market Type Tabs */}
                <div className="flex justify-center">
                  <Tabs value={marketType} onValueChange={(value) => setMarketType(value as "crypto" | "forex")} className="w-auto">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
                      <TabsTrigger value="forex">Forex</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="max-w-xl mx-auto">
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      placeholder={marketType === "crypto" ? "Enter crypto symbol (e.g., ETH, BTC, SOL)" : "Enter forex pair (e.g., EURUSD, GBPUSD)"}
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-12 bg-input-background border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <Button
                      onClick={fetchPrice}
                      disabled={isLoading || !symbol.trim()}
                      className="h-12 px-8 bg-foreground text-background hover:bg-foreground/90"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      {isLoading ? "Analyzing..." : "Analyze"}
                    </Button>
                  </div>
                </div>

                {priceResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <div className="bg-accent/30 border border-border rounded-2xl p-6 max-w-2xl mx-auto">
                      <p className="text-lg text-foreground font-medium">
                        {priceResult}
                      </p>
                    </div>

                    {/* Trading Indicators */}
                    <AnimatePresence>
                      {indicators && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="bg-card border border-border rounded-2xl p-4 md:p-8 max-w-3xl mx-auto"
                        >
                          <h4 className="text-xl font-medium text-foreground mb-6 flex items-center justify-center gap-2">
                            <Activity className="w-5 h-5" />
                            Technical Analysis
                          </h4>

                          {/* Grid of indicators - Mobile Optimized */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
                            {/* RSI */}
                            <div className="text-center p-3 md:p-4 rounded-xl bg-accent/20 border border-border">
                              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground mb-1">RSI (14)</p>
                              <p className={`text-xl md:text-2xl font-medium ${
                                indicators.rsi > 70 ? 'text-red-500' : 
                                indicators.rsi < 30 ? 'text-green-500' : 
                                'text-foreground'
                              }`}>
                                {indicators.rsi}
                              </p>
                            </div>

                            {/* Trend */}
                            <div className="text-center p-3 md:p-4 rounded-xl bg-accent/20 border border-border">
                              {indicators.trend === "Bullish" ? 
                                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-green-500" /> :
                                indicators.trend === "Bearish" ?
                                <TrendingDown className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-red-500" /> :
                                <Activity className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-muted-foreground" />
                              }
                              <p className="text-xs text-muted-foreground mb-1">Trend</p>
                              <p className={`text-lg md:text-xl font-medium ${
                                indicators.trend === "Bullish" ? 'text-green-500' : 
                                indicators.trend === "Bearish" ? 'text-red-500' : 
                                'text-foreground'
                              }`}>
                                {indicators.trend}
                              </p>
                            </div>

                            {/* Volatility */}
                            <div className="text-center p-3 md:p-4 rounded-xl bg-accent/20 border border-border">
                              <Activity className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground mb-1">Volatility</p>
                              <p className="text-lg md:text-xl font-medium text-foreground">
                                {indicators.volatility}
                              </p>
                            </div>
                          </div>

                          {/* Support & Resistance - Mobile Optimized */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
                            <div className="p-3 md:p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center sm:text-left">
                              <p className="text-xs text-muted-foreground mb-1">Support Level</p>
                              <p className="text-base md:text-lg font-medium text-green-600 dark:text-green-400">
                                ${indicators.support}
                              </p>
                            </div>
                            <div className="p-3 md:p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center sm:text-left">
                              <p className="text-xs text-muted-foreground mb-1">Resistance Level</p>
                              <p className="text-base md:text-lg font-medium text-red-600 dark:text-red-400">
                                ${indicators.resistance}
                              </p>
                            </div>
                          </div>

                          {/* Trading Signal - Mobile Optimized */}
                          <div className={`p-3 md:p-4 rounded-xl border-2 ${
                            indicators.signal.includes("Buy") ? 'bg-green-500/10 border-green-500/50' :
                            indicators.signal.includes("Sell") ? 'bg-red-500/10 border-red-500/50' :
                            'bg-accent/20 border-border'
                          }`}>
                            <p className="text-xs text-muted-foreground mb-1 text-center">Trading Signal</p>
                            <p className={`text-center text-sm md:text-base font-medium ${
                              indicators.signal.includes("Buy") ? 'text-green-600 dark:text-green-400' :
                              indicators.signal.includes("Sell") ? 'text-red-600 dark:text-red-400' :
                              'text-foreground'
                            }`}>
                              {indicators.signal}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Chart Toggle */}
                    <div className="text-center py-4">
                      <button 
                        onClick={() => setShowChart(!showChart)}
                        className="text-sm text-blue-500 hover:underline focus:outline-none cursor-pointer"
                      >
                        {showChart ? "Hide Chart" : "Show Chart"}
                      </button>
                    </div>

                    {/* Live Chart - Moved here */}
                    <AnimatePresence>
                      {showChart && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5 }}
                          className="h-[500px] md:h-[600px] w-full max-w-[98vw] mx-auto bg-card/50 border border-border rounded-2xl overflow-hidden shadow-2xl my-6"
                        >
                          <AdvancedRealTimeChart 
                            theme={effectiveTheme === "dark" ? "dark" : "light"} 
                            symbol={chartSymbol} 
                            autosize
                            width="100%"
                            height="100%"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}