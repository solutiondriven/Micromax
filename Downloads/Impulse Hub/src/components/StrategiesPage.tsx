import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, TrendingUp, Award, Network, Zap, Copy, CheckCircle2, ArrowRight, Coins, UserPlus, Gift, Repeat, DollarSign, Settings, Layers } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";

const TELEGRAM_BOT_TOKEN = "7987548627:AAF5BscbzVuULHrn6eKGPokkO4llnyJEtYM";
// TODO: Replace with your actual Telegram Chat ID. 
// To get your Chat ID:
// 1. Search for your bot in Telegram
// 2. Send a message to it (e.g., /start)
// 3. Visit https://api.telegram.org/bot7987548627:AAF5BscbzVuULHrn6eKGPokkO4llnyJEtYM/getUpdates
// 4. Look for "chat": { "id": 123456789 } in the response
const TELEGRAM_CHAT_ID = "7020477716"; 

const sendToTelegram = async (message: string) => {
  if (TELEGRAM_CHAT_ID === "YOUR_CHAT_ID") {
    console.warn("Telegram Chat ID is not set. Message not sent:", message);
    toast.error("Configuration Error", {
      description: "Telegram Chat ID is missing. Please contact the administrator.",
    });
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send Telegram message");
    }
    
    return true;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    toast.error("Submission Failed", {
      description: "Could not send message to Telegram. Please try again later.",
    });
    return false;
  }
};

export function StrategiesPage() {
  const [activeTab, setActiveTab] = useState<"copytrading" | "referral">("copytrading");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCopyTradingDialogOpen, setIsCopyTradingDialogOpen] = useState(false);
  const [isSignupFormOpen, setIsSignupFormOpen] = useState(false);
  const [isCustomizeFormOpen, setIsCustomizeFormOpen] = useState(false);
  const [isPaymentRequestOpen, setIsPaymentRequestOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [signupForm, setSignupForm] = useState<{
    name: string;
    email: string;
    phone: string;
    selectedTrader: string;
    telegramId?: string;
  }>({
    name: "",
    email: "",
    phone: "",
    selectedTrader: ""
  });
  const [customizeForm, setCustomizeForm] = useState<{
    name: string;
    email: string;
    phone: string;
    telegramId?: string;
  }>({
    name: "",
    email: "",
    phone: ""
  });
  const [paymentRequestForm, setPaymentRequestForm] = useState<{
    name: string;
    email: string;
    phone: string;
    telegramId?: string;
  }>({
    name: "",
    email: "",
    phone: ""
  });

  // Listen for section navigation events
  useEffect(() => {
    const handleNavigateToSection = (event: any) => {
      const section = event.detail?.section;
      
      if (section === 'infinity-network-rewards') {
        // Switch to referral tab
        setActiveTab('referral');
        
        // Scroll to the section after tab switch completes
        setTimeout(() => {
          const element = document.getElementById('infinity-network-rewards');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    };

    window.addEventListener('navigateToSection', handleNavigateToSection);
    
    // Handle URL params for deep linking and modal opening
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');

    if (section) {
      if (section === 'infinity-network-rewards' || section === 'infinity-referral-program') {
         setActiveTab('referral');
         setTimeout(() => {
            const element = document.getElementById('infinity-network-rewards');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
         }, 500);
      } else if (section === 'copy-trading-model') {
        setActiveTab('copytrading');
      } else if (section === 'payment-copytrading') {
        setActiveTab('copytrading');
        setIsSignupFormOpen(true);
      } else if (section === 'bot-setup') {
        setActiveTab('referral');
        setIsDialogOpen(true);
      }
    }
    
    return () => window.removeEventListener('navigateToSection', handleNavigateToSection);
  }, []);

  // Copy Trading verified trader - only Veekay
  const verifiedTrader = {
    id: 1,
    name: "Veekay",
    winRate: "89%",
    followers: "7,460",
    monthlyReturn: "+189.2%",
    tier: "Elite Verified"
  };

  // Follower groups - 12 total followers
  const followerGroups = [
    {
      stage: "Stage 1",
      label: "Direct Copy Traders",
      count: 4,
      followers: Array(4).fill(null)
    },
    {
      stage: "Stage 2",
      label: "Indirect Copy Traders",
      count: 4,
      followers: Array(4).fill(null)
    },
    {
      stage: "Stage 3",
      label: "Follower Mirrors",
      count: 4,
      followers: Array(4).fill(null)
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-24 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 md:space-y-24">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 sm:space-y-6"
        >
          <div className="inline-block px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-foreground/5 border border-border mb-2 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-foreground">
              Network Marketing Ecosystem
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground px-2">
            Copy Trade & Earn Rewards
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed px-2">
            Join the revolutionary IMPULSE network where you can become a verified trader and earn rewards from every follower who copies your trades. 
            Impulse also provides infrastructure to Non traders for copying verified traders all using the AI MicroMax bot.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto px-2"
        >
          <div className="flex flex-col items-center gap-1.5">
            <Button
              onClick={() => setActiveTab("copytrading")}
              variant={activeTab === "copytrading" ? "default" : "outline"}
              size="lg"
              className="w-full text-xs sm:text-sm md:text-base px-2 sm:px-4"
            >
              <Copy className="w-4 h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
              <span className="truncate">Copy Trading Model</span>
            </Button>
            <p className="text-xs text-muted-foreground text-center">for Non Traders</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Button
              onClick={() => setActiveTab("referral")}
              variant={activeTab === "referral" ? "default" : "outline"}
              size="lg"
              className="w-full text-xs sm:text-sm md:text-base px-2 sm:px-4"
            >
              <Network className="w-4 h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
              <span className="truncate">Infinity Referral Program</span>
            </Button>
            <p className="text-xs text-muted-foreground text-center">for Pro Traders</p>
          </div>
        </motion.div>

        {/* Copy Trading Model Section */}
        {activeTab === "copytrading" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-16 bg-[#0a0a0a] text-white dark:bg-white dark:text-black rounded-3xl p-6 md:p-12 -mx-4 sm:-mx-6 md:mx-0 shadow-2xl border border-white/10 dark:border-black/10 relative overflow-hidden"
          >
            {/* Dark Theme Background Effects - Hide in dark mode (which is white container) */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background pointer-events-none dark:hidden" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-background to-background pointer-events-none dark:hidden" />
            
            {/* Content wrapper to ensure z-index above background */}
            <div className="relative z-10 space-y-16">
            {/* How It Works */}
            <div className="space-y-12">
              <div className="text-center space-y-3">
                <h2 className="text-2xl md:text-4xl font-light tracking-wide text-white dark:text-black">
                  How Copy Trading Works
                </h2>
                <p className="text-gray-400 dark:text-gray-600 font-light">
                  Three simple steps to start earning with verified traders
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3 md:gap-8">
                {[
                  {
                    step: "01",
                    icon: UserPlus,
                    title: "Choose a Verified Trader",
                    description: "Select from our elite roster of proven traders with verified track records and transparent performance metrics"
                  },
                  {
                    step: "02",
                    icon: Settings,
                    title: "Customize Your Strategy",
                    description: "Configure MicroMax bot with your risk tolerance, position sizing, and preferred trading parameters"
                  },
                  {
                    step: "03",
                    icon: Zap,
                    title: "Auto-Execute Trades",
                    description: "MicroMax bot mirrors your chosen trader's moves in real-time with institutional-grade precision"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-white/5 dark:bg-black/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Card className="relative p-4 md:p-8 space-y-4 md:space-y-6 h-full border-2 border-white/10 dark:border-black/10 bg-transparent hover:border-white/20 dark:hover:border-black/20 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 dark:bg-black/5 flex items-center justify-center">
                          <step.icon className="w-8 h-8 text-white dark:text-black" />
                        </div>
                        <div className="text-6xl font-thin text-white/10 dark:text-black/10">{step.step}</div>
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <h3 className="text-lg md:text-xl font-medium text-white dark:text-black">{step.title}</h3>
                        <p className="text-xs md:text-sm text-gray-400 dark:text-gray-600 leading-relaxed font-light">
                          {step.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual Network Diagram */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="text-center space-y-3 mb-12">
                <h2 className="text-4xl font-light tracking-wide text-white dark:text-black">
                  Copy Trading Architecture
                </h2>
                <p className="text-gray-400 dark:text-gray-600 font-light">
                  Verified trader powers the MicroMax bot ecosystem
                </p>
              </div>

              <div className="relative bg-white/5 dark:bg-gray-100 rounded-3xl p-12 border border-white/10 dark:border-black/10 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 dark:bg-black/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 dark:bg-black/5 rounded-full blur-3xl" />
                
                <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* Verified Trader */}
                  <div className="space-y-4">
                    <div className="text-center lg:text-left space-y-2 mb-6">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20">
                        <span className="text-xs font-medium uppercase tracking-wider text-white dark:text-black">
                          Verified Trader
                        </span>
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <Card className="p-4 bg-white/10 dark:bg-white/60 backdrop-blur-sm border border-white/20 dark:border-black/10 hover:border-white/40 dark:hover:border-black/20 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-white dark:text-black" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-white dark:text-black truncate">{verifiedTrader.name}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-600">{verifiedTrader.tier}</div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>

                  {/* MicroMax Bot (Center) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col items-center space-y-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-full blur-2xl animate-pulse" />
                      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-white/90 to-white/70 dark:from-black/80 dark:to-black/60 flex items-center justify-center shadow-2xl">
                        <Zap className="w-16 h-16 text-black dark:text-white" />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-medium text-white dark:text-black">MicroMax Bot</h3>
                      <p className="text-sm text-gray-400 dark:text-gray-600">AI-Powered Copy Trading</p>
                    </div>
                    
                    {/* Connection Lines */}
                    <div className="hidden lg:block absolute left-1/3 top-1/2 w-1/6 h-px bg-gradient-to-r from-white/30 to-white/30 dark:from-black/30 dark:to-black/30" />
                    <div className="hidden lg:block absolute right-1/3 top-1/2 w-1/6 h-px bg-gradient-to-r from-white/30 to-white/30 dark:from-black/30 dark:to-black/30" />
                  </motion.div>

                  {/* Copy Traders (Followers) - Grouped by Stage */}
                  <div className="space-y-6">
                    <div className="text-center lg:text-right space-y-2 mb-6">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20">
                        <span className="text-xs font-medium uppercase tracking-wider text-white dark:text-black">
                          Copy Traders - {verifiedTrader.followers} Active
                        </span>
                      </div>
                    </div>
                    {followerGroups.map((group, groupIndex) => (
                      <motion.div
                        key={group.stage}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 + groupIndex * 0.1 }}
                      >
                        <Card className="p-4 bg-white/10 dark:bg-white/60 backdrop-blur-sm border border-white/20 dark:border-black/10 hover:border-white/40 dark:hover:border-black/20 transition-all duration-300">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-wide">{group.label}</div>
                              <div className="text-xs font-medium text-white dark:text-black">{group.stage}</div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {group.followers.map((_, idx) => (
                                <div
                                  key={idx}
                                  className="w-7 h-7 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center"
                                >
                                  <Users className="w-3.5 h-3.5 text-white dark:text-black" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Copy Trading Mode CTA Card for Copy Trading */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent dark:from-black/[0.03] dark:via-black/[0.01] rounded-[2.5rem] p-12 lg:p-20 border border-white/10 dark:border-black/10 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/10 via-fuchsia-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                
                <div className="relative z-10 text-center space-y-8">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="inline-block"
                  >
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20">
                      <Copy className="w-5 h-5 text-white dark:text-black" />
                      <span className="text-sm font-medium tracking-wide text-white dark:text-black uppercase">Copy Trading Mode</span>
                    </div>
                  </motion.div>

                  {/* Main Heading */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    className="space-y-4"
                  >
                    <h2 className="text-5xl lg:text-7xl font-light tracking-tight text-white dark:text-black">
                      Start Copy Trading<br />
                      <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-fuchsia-400 dark:from-fuchsia-600 dark:via-purple-600 dark:to-fuchsia-600 bg-clip-text text-transparent">
                        With Experts
                      </span>
                    </h2>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    className="flex justify-center pt-4"
                  >
                    <Button 
                      size="lg" 
                      className="text-lg px-10 py-7 bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800 border-0 shadow-2xl group"
                      onClick={() => setIsCopyTradingDialogOpen(true)}
                    >
                      <span className="flex items-center">
                        Start now
                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </motion.div>

                  {/* Trust Indicators */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-gray-400 dark:text-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-white dark:text-black" />
                      <span>Verified Traders Only</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-white dark:text-black" />
                      <span>AI-Powered Execution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-white dark:text-black" />
                      <span>Real-Time Performance</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Copy Trading Initial Dialog */}
            <Dialog open={isCopyTradingDialogOpen} onOpenChange={setIsCopyTradingDialogOpen}>
              <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto p-4 md:p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl md:text-3xl font-light">Join Copy Trading as Non-Trader</DialogTitle>
                  <DialogDescription className="text-sm md:text-base">
                    Sign up to copy verified expert traders and let AI handle your trading
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-8 py-6">
                  {/* Why Copy Trade Section */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-light text-foreground">Why Copy Trade?</h3>
                    <Card className="p-8 lg:p-10 bg-gradient-to-br from-foreground/5 via-foreground/3 to-background border-2 border-border">
                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-3 text-center">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-foreground/10 flex items-center justify-center">
                            <Users className="w-8 h-8 text-foreground" />
                          </div>
                          <h4 className="font-medium text-foreground">Expert Traders</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed font-light">
                            Copy verified traders with proven track records and transparent performance
                          </p>
                        </div>
                        <div className="space-y-3 text-center">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-foreground/10 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-foreground" />
                          </div>
                          <h4 className="font-medium text-foreground">AI-Powered</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed font-light">
                            MicroMax bot executes trades instantly with institutional-grade precision
                          </p>
                        </div>
                        <div className="space-y-3 text-center">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-foreground/10 flex items-center justify-center">
                            <Settings className="w-8 h-8 text-foreground" />
                          </div>
                          <h4 className="font-medium text-foreground">Full Control</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed font-light">
                            Set your risk tolerance, position sizing, and stop-loss parameters
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Start Copying CTA */}
                  <div className="text-center space-y-6 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Start copying expert traders today. No trading experience required.
                    </p>
                    <Button 
                      size="lg"
                      className="w-full md:w-auto px-12 py-6 text-lg"
                      onClick={() => {
                        setIsCopyTradingDialogOpen(false);
                        setIsSignupFormOpen(true);
                      }}
                    >
                      Start Copying
                    </Button>
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-foreground" />
                        <span>Cancel Anytime</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-foreground" />
                        <span>Secure & Encrypted</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-foreground" />
                        <span>Money-Back Guarantee</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Copy Trading Signup Form Dialog */}
            <Dialog open={isSignupFormOpen} onOpenChange={setIsSignupFormOpen}>
              <DialogContent className="max-w-[95vw] md:max-w-lg p-4 md:p-6 max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl md:text-2xl font-light">Complete Your Registration</DialogTitle>
                  <DialogDescription className="text-sm md:text-base">
                    Fill in your details to start copy trading
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        placeholder="Enter your full name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telegram">Telegram ID (Numeric)</Label>
                      <div className="bg-accent/20 p-4 rounded-lg space-y-3 border border-border">
                        <div className="text-sm space-y-1">
                            <p className="font-medium">Step 1: Start the Telegram Bot</p>
                            <p className="text-muted-foreground text-xs">You must start the bot to receive trade notifications.</p>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full mt-2"
                                onClick={() => window.open('https://t.me/Impulsehub_bot?start=myid', '_blank')}
                            >
                                <span className="mr-2">✈️</span> Open Bot on Telegram
                            </Button>
                        </div>
                        
                        <div className="text-sm space-y-1 pt-2 border-t border-border">
                            <p className="font-medium">Step 2: Enter your Telegram ID</p>
                            <p className="text-muted-foreground text-xs">The bot will automatically generate your ID. If not, type <b>/myid</b>.</p>
                            <Input 
                                id="telegram"
                                type="number"
                                placeholder="e.g. 123456789"
                                value={signupForm.telegramId || ""}
                                onChange={(e) => setSignupForm({...signupForm, telegramId: e.target.value})}
                                className="bg-background"
                            />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trader">Select Verified Trader</Label>
                      <Select 
                        value={signupForm.selectedTrader}
                        onValueChange={(value) => setSignupForm({...signupForm, selectedTrader: value})}
                      >
                        <SelectTrigger id="trader">
                          <SelectValue placeholder="Choose a trader to copy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="moses">Moses</SelectItem>
                          <SelectItem value="oluwaseun">Oluwaseun</SelectItem>
                          <SelectItem value="veekay">Veekay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    size="lg"
                    disabled={!signupForm.name || !signupForm.email || !signupForm.phone || !signupForm.selectedTrader || !signupForm.telegramId}
                    onClick={async () => {
                      let traderName = "Moses";
                      if (signupForm.selectedTrader === "veekay") traderName = "Veekay";
                      if (signupForm.selectedTrader === "oluwaseun") traderName = "Oluwaseun";
                      
                      const telegramMessage = `<b>COPY TRADING REGISTRATION</b>\n\n` +
                        `<b>Name:</b> ${signupForm.name}\n` +
                        `<b>Email:</b> ${signupForm.email}\n` +
                        `<b>Phone:</b> ${signupForm.phone}\n` +
                        `<b>Telegram ID:</b> ${signupForm.telegramId}\n` +
                        `<b>Selected Trader:</b> ${traderName}\n\n` +
                        `<i>User requested copy trading services.</i>`;
                      
                      const success = await sendToTelegram(telegramMessage);

                      if (success) {
                        // Show toast
                        toast.success("Registration Sent!", {
                          description: `We have received your registration for ${traderName}'s copy trading service. We will contact you shortly.`,
                          duration: 5000,
                        });
                        
                        setIsSignupFormOpen(false);
                        // Reset form
                        setSignupForm({ name: "", email: "", phone: "", selectedTrader: "" });
                      }
                    }}
                  >
                    Complete Registration
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </motion.div>
        )}

        {/* Infinity Referral Program Section */}
        {activeTab === "referral" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-16 bg-[#0a0a0a] text-white dark:bg-white dark:text-black rounded-3xl p-6 md:p-12 -mx-4 sm:-mx-6 md:mx-0 shadow-2xl border border-white/10 dark:border-black/10 relative overflow-hidden"
          >
            {/* Dark Theme Background Effects - Hide in dark mode (white container) */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background pointer-events-none dark:hidden" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-background to-background pointer-events-none dark:hidden" />
            
            {/* Infinity Network Visualization */}
            <div id="infinity-network-rewards" className="space-y-12 relative z-10">
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-light tracking-wide text-white dark:text-black">
                  Infinity Network Rewards
                </h2>
                <p className="text-gray-400 dark:text-gray-600 font-light">
                  Build your network and earn from unlimited levels
                </p>
              </div>

              <div className="relative bg-white/5 dark:bg-gray-100 rounded-3xl p-12 border border-white/10 dark:border-black/10 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 dark:bg-black/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 dark:bg-black/5 rounded-full blur-3xl" />
                
                <div className="relative space-y-12">
                  {/* You at center */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-full blur-2xl animate-pulse" />
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-white/90 to-white/70 dark:from-black/80 dark:to-black/60 flex items-center justify-center shadow-2xl border-4 border-transparent">
                        <Award className="w-12 h-12 text-black dark:text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20">
                        <span className="text-sm font-medium text-white dark:text-black">You (Verified Trader)</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Level 1 */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20">
                        <span className="text-sm font-medium text-white dark:text-black">Level 1 - Direct Copy trade (15%)</span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4 flex-wrap max-w-3xl mx-auto">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                          className="w-14 h-14 rounded-xl bg-white/10 dark:bg-black/10 border-2 border-white/20 dark:border-black/20 flex items-center justify-center"
                        >
                          <UserPlus className="w-5 h-5 text-white dark:text-black" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Level 2 */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20">
                        <span className="text-sm font-medium text-white dark:text-black">Level 2 - Indirect Copy trade (10%)</span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-3 flex-wrap max-w-4xl mx-auto">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.9 + i * 0.03 }}
                          className="w-12 h-12 rounded-lg bg-white/10 dark:bg-black/10 border-2 border-white/20 dark:border-black/20 flex items-center justify-center"
                        >
                          <Users className="w-4 h-4 text-white dark:text-black" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Level 3 */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20">
                        <span className="text-sm font-medium text-white dark:text-black">Level 3 - followers mirroring (7%)</span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-2 flex-wrap max-w-5xl mx-auto">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 1.1 + i * 0.02 }}
                          className="w-10 h-10 rounded-lg bg-white/10 dark:bg-black/10 border-2 border-white/20 dark:border-black/20 flex items-center justify-center"
                        >
                          <Network className="w-3 h-3 text-white dark:text-black" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Infinity Symbol */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="flex flex-col items-center gap-4 pt-4"
                  >
                    <div className="text-6xl text-white/20 dark:text-black/20">∞</div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-medium text-white dark:text-black">Level 4+ - Infinity Levels (5%)</p>
                      <p className="text-sm text-gray-400 dark:text-gray-600">Continue earning 5% from all deeper levels with no limit</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>



            {/* Example Earnings Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative z-10"
            >
              <div className="text-center space-y-3 mb-12">
                <h2 className="text-4xl font-light tracking-wide text-white dark:text-black">
                  Potential Earnings Example
                </h2>
                <p className="text-gray-400 dark:text-gray-600 font-light">
                  See how your network can generate passive income
                </p>
              </div>

              <Card className="p-8 lg:p-12 bg-white/5 dark:bg-gray-100 border-white/10 dark:border-black/10 border-2">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { level: "5 Direct Copy Trades", amount: "$750", opacity: "90" },
                        { level: "25 Indirect Copy Trades", amount: "$1,250", opacity: "80" },
                        { level: "125 Follower Mirrors", amount: "$2,187", opacity: "70" },
                        { level: "625 Level 4+ Members", amount: "$7,812", opacity: "60" }
                      ].map((item, index) => (
                        <motion.div
                          key={item.level}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/5 dark:bg-white/50 backdrop-blur-sm border border-white/10 dark:border-black/5"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full bg-white/${item.opacity} dark:bg-black/${item.opacity}`} />
                            <span className="text-sm font-medium text-white dark:text-black">{item.level}</span>
                          </div>
                          <span className="text-lg font-medium text-white dark:text-black">{item.amount}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 dark:via-black/20 to-transparent" />
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/10 dark:bg-black/5 border-2 border-white/20 dark:border-black/10">
                      <span className="text-xl font-medium text-white dark:text-black">Total Monthly Earnings</span>
                      <span className="text-3xl font-medium text-white dark:text-black">$12,000</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="flex flex-col items-center justify-center space-y-6 p-8"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-full blur-3xl animate-pulse" />
                      <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-white/90 to-white/70 dark:from-black/80 dark:to-black/60 flex flex-col items-center justify-center shadow-2xl border-4 border-transparent">
                        <Coins className="w-20 h-20 text-black dark:text-white mb-3" />
                        <span className="text-black dark:text-white text-sm">Network Growth</span>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-400 dark:text-gray-600 font-light max-w-xs">
                      Based on average subscription value of $50/month per member across all levels
                    </p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            {/* Become a Verified Trader - Moved to Infinity Referral Tab */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-8 relative z-10"
            >
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-light tracking-wide text-white dark:text-black">
                  Become a Verified Trader
                </h2>
                <p className="text-gray-400 dark:text-gray-600 font-light">
                  Earn rewards for every user who copies your trades
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: DollarSign,
                    title: "Commission Per Trade",
                    description: "Earn 2-5% commission on every trade executed by your followers",
                    intensity: "20"
                  },
                  {
                    icon: Users,
                    title: "Follower Rewards",
                    description: "Get monthly bonuses based on your total active followers",
                    intensity: "15"
                  },
                  {
                    icon: Award,
                    title: "Performance Bonuses",
                    description: "Top performers earn exclusive rewards and revenue share",
                    intensity: "18"
                  },
                  {
                    icon: TrendingUp,
                    title: "Passive Income",
                    description: "Build a sustainable income stream as your network grows",
                    intensity: "22"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                  >
                    <Card className="p-6 space-y-4 text-center border-2 border-white/10 dark:border-black/10 bg-white/5 dark:bg-gray-100 hover:border-white/30 dark:hover:border-black/30 transition-all duration-300 group h-full">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 dark:bg-black/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <benefit.icon className="w-8 h-8 text-white dark:text-black" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium text-white dark:text-black">{benefit.title}</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-600 font-light leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Ready to Build Your Empire - Premium CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="space-y-8 relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent dark:from-black/[0.03] dark:via-black/[0.01] rounded-[2.5rem] p-12 lg:p-20 border border-white/10 dark:border-black/10 overflow-hidden">
                  {/* Animated Background Elements */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/10 via-fuchsia-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                  
                  <div className="relative z-10 text-center space-y-8">
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 1.7 }}
                      className="inline-block"
                    >
                      <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 dark:bg-black/5 border border-white/20 dark:border-black/10">
                        <Award className="w-5 h-5 text-white dark:text-black" />
                        <span className="text-sm font-medium tracking-wide text-white dark:text-black uppercase">Elite Trader Program</span>
                      </div>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.8 }}
                      className="space-y-4"
                    >
                      <h2 className="text-5xl lg:text-7xl font-light tracking-tight text-white dark:text-black">
                        Ready to Build<br />
                        <span className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-fuchsia-400 dark:from-fuchsia-600 dark:via-purple-600 dark:to-fuchsia-600 bg-clip-text text-transparent">
                          Your Empire
                        </span>
                      </h2>
                    </motion.div>

                    {/* Steps Cards */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.9 }}
                      className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto py-8"
                    >
                      {[
                        {
                          step: "01",
                          icon: CheckCircle2,
                          title: "Get Verified",
                          description: "Submit your trading history and complete our verification process to prove your track record"
                        },
                        {
                          step: "02",
                          icon: Settings,
                          title: "Customize Your Bot",
                          description: "Configure MicroMax bot with your unique trading strategies and risk parameters"
                        },
                        {
                          step: "03",
                          icon: Network,
                          title: "Share Your Link",
                          description: "Distribute your referral link and watch your network—and earnings—grow exponentially"
                        }
                      ].map((step, index) => (
                        <motion.div
                          key={step.step}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 2.0 + index * 0.1 }}
                          className="relative group"
                        >
                          <div className="absolute inset-0 bg-white/5 dark:bg-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <Card className="relative p-6 space-y-4 h-full border-2 border-white/10 dark:border-black/10 bg-white/5 dark:bg-gray-100 hover:border-white/30 dark:hover:border-black/30 transition-all duration-300">
                            <div className="flex items-start justify-between">
                              <div className="w-12 h-12 rounded-xl bg-white/5 dark:bg-black/5 flex items-center justify-center">
                                <step.icon className="w-6 h-6 text-white dark:text-black" />
                              </div>
                              <div className="text-5xl font-thin text-white/10 dark:text-black/10">{step.step}</div>
                            </div>
                            <div className="space-y-2 text-left">
                              <h3 className="text-xl font-medium text-white dark:text-black">{step.title}</h3>
                              <p className="text-sm text-gray-400 dark:text-gray-600 leading-relaxed font-light">
                                {step.description}
                              </p>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 2.3 }}
                      className="flex justify-center"
                    >
                      <Button 
                        size="lg" 
                        className="text-lg px-10 py-7 bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800 border-0 shadow-2xl group"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <span className="flex items-center">
                          Start Building Now
                          <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 2.1 }}
                      className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-gray-400 dark:text-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-white dark:text-black" />
                        <span>Verified Traders Only</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-white dark:text-black" />
                        <span>Real-Time Payouts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-white dark:text-black" />
                        <span>No Hidden Fees</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* MicroMax Bot Setup Dialog for Referral Tab */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-7xl max-h-[95vh] overflow-y-auto">
                <DialogHeader className="space-y-3 md:space-y-4 pb-4 md:pb-6">
                  <DialogTitle className="text-2xl md:text-4xl lg:text-5xl font-light text-center">MicroMax Bot Setup</DialogTitle>
                  <DialogDescription className="text-base md:text-lg text-center max-w-3xl mx-auto">
                    Customize your bot and choose the capacity tier that fits your needs for maximum earnings potential
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-8 md:space-y-12 py-4 md:py-8">
                  {/* Bot Customization Section */}
                  <div className="space-y-6 md:space-y-8">
                    <div className="text-center space-y-2 md:space-y-3">
                      <h3 className="text-xl md:text-3xl lg:text-4xl font-light text-foreground">Customizable MicroMax Bot</h3>
                      <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-light">
                        Configure your personalized trading strategies and risk parameters for optimal performance
                      </p>
                    </div>
                    <Card className="p-4 md:p-10 lg:p-16 bg-gradient-to-br from-foreground/5 via-foreground/3 to-background border-2 border-border">
                      <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
                        <div className="space-y-6 md:space-y-8">
                          <div className="flex items-start gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-foreground/10 flex items-center justify-center flex-shrink-0">
                              <Settings className="w-6 h-6 md:w-8 md:h-8 text-foreground" />
                            </div>
                            <div className="space-y-2 md:space-y-3">
                              <h4 className="text-lg md:text-2xl font-medium text-foreground">Strategy Customization Required</h4>
                              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">
                                Each verified trader must configure their unique trading strategies, risk parameters, and position sizing rules within the MicroMax bot before going live.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-foreground/10 flex items-center justify-center flex-shrink-0">
                              <Layers className="w-6 h-6 md:w-8 md:h-8 text-foreground" />
                            </div>
                            <div className="space-y-2 md:space-y-3">
                              <h4 className="text-lg md:text-2xl font-medium text-foreground">Personalized Trading Logic</h4>
                              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">
                                Define entry/exit signals, stop-loss levels, take-profit targets, and risk-reward ratios that align with your proven trading methodology and market expertise.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 p-6 md:p-12">
                          <button 
                            onClick={() => setIsCustomizeFormOpen(true)}
                            className="relative group cursor-pointer transition-transform duration-300 hover:scale-105"
                          >
                            <div className="absolute inset-0 bg-foreground/20 rounded-full blur-3xl animate-pulse" />
                            <div className="relative w-32 h-32 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-foreground/90 to-foreground/70 flex flex-col items-center justify-center shadow-2xl border-4 border-background group-hover:shadow-luxury-hover transition-all duration-300">
                              <Settings className="w-12 h-12 md:w-20 md:h-20 text-background mb-2 md:mb-4 group-hover:rotate-45 transition-transform duration-500" />
                              <span className="text-background text-sm md:text-lg font-medium">Customize</span>
                            </div>
                          </button>
                          <p className="text-center text-sm md:text-base text-muted-foreground font-light max-w-sm">
                            Configure your bot with your unique trading DNA before activation
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Bot Capacity Pricing Tiers */}
                  <div className="space-y-6 md:space-y-10">
                    <div className="text-center space-y-2 md:space-y-4">
                      <h3 className="text-xl md:text-3xl lg:text-4xl font-light text-foreground">MicroMax Bot Capacity Tiers</h3>
                      <p className="text-muted-foreground font-light text-sm md:text-lg max-w-2xl mx-auto">
                        Higher capacity = More followers = Higher earnings potential. Choose the tier that matches your ambitions.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                      {[
                        {
                          name: "Basic Bot",
                          price: "$99/month",
                          directReferrals: "Up to 10",
                          indirectReferrals: "Up to 25",
                          followers: "Up to 50",
                          tier: "Entry Level"
                        },
                        {
                          name: "Pro Bot",
                          price: "$249/month",
                          directReferrals: "Up to 50",
                          indirectReferrals: "Up to 150",
                          followers: "Up to 300",
                          tier: "Professional"
                        },
                        {
                          name: "Elite Bot",
                          price: "$499/month",
                          directReferrals: "Up to 200",
                          indirectReferrals: "Up to 1,000",
                          followers: "Up to 2,500",
                          tier: "Advanced"
                        },
                        {
                          name: "Unlimited Bot",
                          price: "$999/month",
                          directReferrals: "Unlimited",
                          indirectReferrals: "Unlimited",
                          followers: "Unlimited",
                          tier: "Enterprise"
                        }
                      ].map((tier, index) => (
                        <Card key={tier.name} className="p-4 md:p-8 space-y-4 md:space-y-8 text-center border-2 hover:border-foreground/20 transition-all duration-300 group h-full hover:shadow-lg">
                          <div className="space-y-2 md:space-y-4">
                            <div className="inline-block px-3 md:px-4 py-1 md:py-2 rounded-full bg-foreground/10 text-xs md:text-sm font-medium text-foreground">
                              {tier.tier}
                            </div>
                            <h4 className="text-lg md:text-2xl font-medium text-foreground">{tier.name}</h4>
                            <div className="text-2xl md:text-4xl font-light text-foreground">{tier.price}</div>
                          </div>
                          <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-border">
                            <div className="flex items-center justify-between text-sm md:text-base">
                              <span className="text-muted-foreground">Direct Referrals:</span>
                              <span className="font-medium text-foreground">{tier.directReferrals}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm md:text-base">
                              <span className="text-muted-foreground">Indirect Referrals:</span>
                              <span className="font-medium text-foreground">{tier.indirectReferrals}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm md:text-base">
                              <span className="text-muted-foreground">Total Followers:</span>
                              <span className="font-medium text-foreground">{tier.followers}</span>
                            </div>
                          </div>
                          <Button 
                            className="w-full text-sm md:text-lg py-2 md:py-3"
                            onClick={() => {
                              setSelectedPlan(tier);
                              setIsPaymentRequestOpen(true);
                            }}
                          >
                            Select Plan
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}

        {/* Customize Bot Form Dialog */}
        <Dialog open={isCustomizeFormOpen} onOpenChange={setIsCustomizeFormOpen}>
          <DialogContent className="max-w-md overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-light text-center">Schedule Bot Customization</DialogTitle>
              <DialogDescription className="text-center">
                Book a session to customize your MicroMax bot with our team
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customize-name">Full Name</Label>
                  <Input
                    id="customize-name"
                    placeholder="Enter your full name"
                    value={customizeForm.name}
                    onChange={(e) => setCustomizeForm({...customizeForm, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customize-email">Email Address</Label>
                  <Input
                    id="customize-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={customizeForm.email}
                    onChange={(e) => setCustomizeForm({...customizeForm, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customize-phone">Phone Number</Label>
                  <Input
                    id="customize-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={customizeForm.phone}
                    onChange={(e) => setCustomizeForm({...customizeForm, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customize-telegram">Telegram ID (Numeric)</Label>
                  <div className="bg-accent/20 p-4 rounded-lg space-y-3 border border-border">
                    <div className="text-sm space-y-1">
                        <p className="font-medium">Step 1: Start the Telegram Bot</p>
                        <p className="text-muted-foreground text-xs">You must start the bot to receive updates.</p>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => window.open('https://t.me/Impulsehub_bot?start=customization', '_blank')}
                        >
                            <span className="mr-2">✈️</span> Open Bot on Telegram
                        </Button>
                    </div>
                    
                    <div className="text-sm space-y-1 pt-2 border-t border-border">
                        <p className="font-medium">Step 2: Enter your Telegram ID</p>
                        <p className="text-muted-foreground text-xs">The bot will automatically generate your ID. If not, type <b>/myid</b>.</p>
                        <Input 
                            id="customize-telegram"
                            type="number"
                            placeholder="e.g. 123456789"
                            value={customizeForm.telegramId || ""}
                            onChange={(e) => setCustomizeForm({...customizeForm, telegramId: e.target.value})}
                            className="bg-background"
                        />
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full"
                size="lg"
                disabled={!customizeForm.name || !customizeForm.email || !customizeForm.phone || !customizeForm.telegramId}
                onClick={async () => {
                  const telegramMessage = `<b>BOT CUSTOMIZATION REQUEST</b>\n\n` +
                    `<b>Name:</b> ${customizeForm.name}\n` +
                    `<b>Email:</b> ${customizeForm.email}\n` +
                    `<b>Phone:</b> ${customizeForm.phone}\n` +
                    `<b>Telegram ID:</b> ${customizeForm.telegramId}\n\n` +
                    `<i>User requested a bot customization session.</i>`;
                  
                  const success = await sendToTelegram(telegramMessage);

                  if (success) {
                    // Open Telegram after successful submission
                    window.open('https://t.me/Impulsehub_bot', '_blank');

                    // Show toast
                    toast.success("Request Sent!", {
                      description: `We have received your bot customization request. Our team will contact you via Telegram shortly.`,
                      duration: 5000,
                    });
                    
                    setIsCustomizeFormOpen(false);
                    setCustomizeForm({ name: "", email: "", phone: "" });
                  }
                }}
              >
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Request Form Dialog */}
        <Dialog open={isPaymentRequestOpen} onOpenChange={setIsPaymentRequestOpen}>
          <DialogContent className="max-w-md overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-light text-center">Request Payment Link</DialogTitle>
              <DialogDescription className="text-center">
                {selectedPlan && `Complete your ${selectedPlan.name} registration`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {selectedPlan && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
                  <h4 className="font-medium text-foreground">{selectedPlan.name}</h4>
                  <div className="text-2xl font-light text-foreground">{selectedPlan.price}</div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Direct Referrals: {selectedPlan.directReferrals}</div>
                    <div>Indirect Referrals: {selectedPlan.indirectReferrals}</div>
                    <div>Total Followers: {selectedPlan.followers}</div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-name">Full Name</Label>
                  <Input
                    id="payment-name"
                    placeholder="Enter your full name"
                    value={paymentRequestForm.name}
                    onChange={(e) => setPaymentRequestForm({...paymentRequestForm, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-email">Email Address</Label>
                  <Input
                    id="payment-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={paymentRequestForm.email}
                    onChange={(e) => setPaymentRequestForm({...paymentRequestForm, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-phone">Phone Number</Label>
                  <Input
                    id="payment-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={paymentRequestForm.phone}
                    onChange={(e) => setPaymentRequestForm({...paymentRequestForm, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-telegram">Telegram ID (Numeric)</Label>
                  <div className="bg-accent/20 p-4 rounded-lg space-y-3 border border-border">
                    <div className="text-sm space-y-1">
                        <p className="font-medium">Step 1: Start the Telegram Bot</p>
                        <p className="text-muted-foreground text-xs">You must start the bot to receive payment details.</p>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => window.open('https://t.me/Impulsehub_bot?start=payment', '_blank')}
                        >
                            <span className="mr-2">✈️</span> Open Bot on Telegram
                        </Button>
                    </div>
                    
                    <div className="text-sm space-y-1 pt-2 border-t border-border">
                        <p className="font-medium">Step 2: Enter your Telegram ID</p>
                        <p className="text-muted-foreground text-xs">The bot will automatically generate your ID. If not, type <b>/myid</b>.</p>
                        <Input 
                            id="payment-telegram"
                            type="number"
                            placeholder="e.g. 123456789"
                            value={paymentRequestForm.telegramId || ""}
                            onChange={(e) => setPaymentRequestForm({...paymentRequestForm, telegramId: e.target.value})}
                            className="bg-background"
                        />
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full"
                size="lg"
                disabled={!paymentRequestForm.name || !paymentRequestForm.email || !paymentRequestForm.phone || !paymentRequestForm.telegramId}
                onClick={async () => {
                  const telegramMessage = `<b>PAYMENT LINK REQUEST</b>\n\n` +
                    `<b>CUSTOMER DETAILS:</b>\n` +
                    `Name: ${paymentRequestForm.name}\n` +
                    `Email: ${paymentRequestForm.email}\n` +
                    `Phone: ${paymentRequestForm.phone}\n` +
                    `Telegram ID: ${paymentRequestForm.telegramId}\n\n` +
                    `<b>SELECTED PLAN:</b>\n` +
                    `Plan Name: ${selectedPlan.name}\n` +
                    `Tier: ${selectedPlan.tier}\n` +
                    `Monthly Fee: ${selectedPlan.price}\n` +
                    `Direct Referrals: ${selectedPlan.directReferrals}\n` +
                    `Indirect Referrals: ${selectedPlan.indirectReferrals}\n` +
                    `Total Followers: ${selectedPlan.followers}\n\n` +
                    `<i>User requested a payment link.</i>`;
                  
                  const success = await sendToTelegram(telegramMessage);

                  if (success) {
                    // Show toast
                    toast.success("Request Sent!", {
                      description: `We have received your payment request. Admin will send you a secure payment link for ${selectedPlan.name} shortly.`,
                      duration: 5000,
                    });
                    
                    setIsPaymentRequestOpen(false);
                    setIsDialogOpen(false);
                    setPaymentRequestForm({ name: "", email: "", phone: "" });
                  }
                }}
              >
                Request Payment Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
