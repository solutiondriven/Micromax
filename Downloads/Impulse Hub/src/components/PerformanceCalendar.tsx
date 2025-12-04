import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "./ThemeProvider";

interface DayData {
  date: Date;
  profit: number;
  trades: number;
}

interface MonthData {
  month: number;
  year: number;
  totalProfit: number;
  totalTrades: number;
  winningDays: number;
  losingDays: number;
  tradingDays: number;
  avgDailyProfit: number;
  bestDay: number;
  worstDay: number;
}

// Generate realistic trading data from SEP 2023 to OCT 3, 2025 with EXACT monthly profits
const generateTradingData = (): DayData[] => {
  const data: DayData[] = [];
  const startDate = new Date(2023, 8, 1); // September 2023 (month is 0-indexed)
  const endDate = new Date(2025, 10, 30); // November 30, 2025
  
  // EXACT Monthly profits for 2025 (these are the final amounts, not targets)
  const monthlyProfits2025 = {
    0: 497,   // Jan 2025 = $497
    1: 406,   // Feb 2025 = $406  
    2: 647,   // Mar 2025 = $647
    3: 998,   // Apr 2025 = $998
    4: 1207,  // May 2025 = $1207
    5: 379,   // Jun 2025 = $379
    6: -200,  // Jul 2025 = -$200 (loss month)
    7: -752,  // Aug 2025 = -$752 (loss month)
    8: 547,   // Sep 2025 = $547
    9: 103,   // Oct 2025 = $103 (up to Oct 3, 2025)
    10: 1540, // Nov 2025 = $1540 (Projected)
  };

  // EXACT Monthly profits for 2023 (Sep-Dec only)
  const monthlyProfits2023 = {
    8: 50,    // Sep 2023 = $50
    9: -170,  // Oct 2023 = -$170 (loss month)
    10: -200, // Nov 2023 = -$200 (loss month)
    11: -170  // Dec 2023 = -$170 (loss month)
  };

  // EXACT Monthly profits for 2024 (from your trading table)
  const monthlyProfits2024 = {
    0: -343,  // Jan 2024 = -$343 (loss month)
    1: 635,   // Feb 2024 = $635
    2: 921,   // Mar 2024 = $921
    3: -689,  // Apr 2024 = -$689 (loss month)
    4: 784,   // May 2024 = $784
    5: 216,   // Jun 2024 = $216
    6: 482,   // Jul 2024 = $482
    7: 1104,  // Aug 2024 = $1,104
    8: 558,   // Sep 2024 = $558
    9: 947,   // Oct 2024 = $947
    10: 674,  // Nov 2024 = $674
    11: 1026  // Dec 2024 = $1,026
  };
  
  // Pre-generate all trading days with profits to ensure exact monthly totals
  const monthlyTradingData: { [key: string]: DayData[] } = {};
  
  // Generate trading days for 2023 with EXACT profits (Sep-Dec only)
  for (let month = 8; month <= 11; month++) {
    const monthKey = `2023-${month}`;
    monthlyTradingData[monthKey] = [];
    
    const monthStart = new Date(2023, month, 1);
    const monthEnd = new Date(2023, month + 1, 0);
    
    // Collect all weekdays in the month (potential trading days)
    const allWeekdays: Date[] = [];
    let currentDay = new Date(monthStart);
    while (currentDay <= monthEnd) {
      const dayOfWeek = currentDay.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
        allWeekdays.push(new Date(currentDay));
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    // Select ~70% of weekdays as trading days (realistic pattern)
    const numTradingDays = Math.floor(allWeekdays.length * 0.7);
    const tradingDays = allWeekdays
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, numTradingDays)
      .sort((a, b) => a.getTime() - b.getTime()); // Sort back chronologically
    
    // Distribute the EXACT monthly profit across trading days
    const monthlyTarget = monthlyProfits2023[month];
    let remainingProfit = monthlyTarget;
    
    tradingDays.forEach((day, index) => {
      const isLastDay = index === tradingDays.length - 1;
      let dayProfit: number;
      
      if (isLastDay) {
        // Last day gets exactly the remaining profit to ensure exact monthly total
        dayProfit = remainingProfit;
      } else {
        // Calculate profit for this day (balanced distribution)
        const isLossMonth = monthlyTarget < 0;
        
        if (isLossMonth) {
          // Loss months: mix of small wins and larger losses
          const shouldWin = Math.random() < 0.25; // 25% win rate in loss months
          if (shouldWin) {
            dayProfit = Math.random() * 60 + 15; // Small wins $15-$75
          } else {
            // Distribute losses across remaining days
            const remainingDays = tradingDays.length - index;
            const maxLoss = Math.min(150, Math.abs(remainingProfit) / remainingDays * 1.5);
            dayProfit = -(Math.random() * maxLoss + 30); // Losses $30-$maxLoss
          }
        } else {
          // Profit months (Sep 2023): mostly wins with occasional small losses every 2 weeks (sporadically)
          // Create loss days at indices that are ~10 days apart (2 weeks of trading)
          const isLossDay = index % 10 === 7 || index % 10 === 8; // Losses at positions 7, 8, 17, 18, etc.
          
          if (isLossDay) {
            // Small losses to add realism
            dayProfit = -(Math.random() * 50 + 10); // Losses $10-$60
          } else {
            // Winning days - distribute remaining profit
            const remainingDays = tradingDays.length - index;
            const maxWin = Math.min(200, (remainingProfit + 100) / remainingDays * 1.5); // Add buffer for losses
            dayProfit = Math.random() * maxWin + 30; // Wins $30-$maxWin
          }
        }
        
        remainingProfit -= dayProfit;
      }
      
      monthlyTradingData[monthKey].push({
        date: new Date(day),
        profit: Math.round(dayProfit * 100) / 100, // Round to 2 decimal places
        trades: Math.floor(Math.random() * 6) + 2 // 2-8 trades per day
      });
    });
  }

  // Generate trading days for 2024 with EXACT profits
  for (let month = 0; month <= 11; month++) {
    const monthKey = `2024-${month}`;
    monthlyTradingData[monthKey] = [];
    
    const monthStart = new Date(2024, month, 1);
    const monthEnd = new Date(2024, month + 1, 0);
    
    // Collect all weekdays in the month (potential trading days)
    const allWeekdays: Date[] = [];
    let currentDay = new Date(monthStart);
    while (currentDay <= monthEnd) {
      const dayOfWeek = currentDay.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
        allWeekdays.push(new Date(currentDay));
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    // Select ~70% of weekdays as trading days (realistic pattern)
    const numTradingDays = Math.floor(allWeekdays.length * 0.7);
    const tradingDays = allWeekdays
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, numTradingDays)
      .sort((a, b) => a.getTime() - b.getTime()); // Sort back chronologically
    
    // Distribute the EXACT monthly profit across trading days
    const monthlyTarget = monthlyProfits2024[month];
    let remainingProfit = monthlyTarget;
    
    tradingDays.forEach((day, index) => {
      const isLastDay = index === tradingDays.length - 1;
      let dayProfit: number;
      
      if (isLastDay) {
        // Last day gets exactly the remaining profit to ensure exact monthly total
        dayProfit = remainingProfit;
      } else {
        // Calculate profit for this day (balanced distribution)
        const isLossMonth = monthlyTarget < 0;
        
        if (isLossMonth) {
          // Loss months: mix of small wins and larger losses
          const shouldWin = Math.random() < 0.3; // 30% win rate in loss months
          if (shouldWin) {
            dayProfit = Math.random() * 80 + 20; // Small wins $20-$100
          } else {
            // Distribute losses across remaining days
            const remainingDays = tradingDays.length - index;
            const maxLoss = Math.min(200, Math.abs(remainingProfit) / remainingDays * 1.5);
            dayProfit = -(Math.random() * maxLoss + 50); // Losses $50-$maxLoss
          }
        } else {
          // Profit months: mostly wins with occasional small losses every 2 weeks (sporadically)
          // Create loss days at indices that are ~10 days apart (2 weeks of trading)
          const isLossDay = index % 10 === 7 || index % 10 === 8; // Losses at positions 7, 8, 17, 18, etc. (2 consecutive days every 2 weeks)
          
          if (isLossDay) {
            // Small losses to add realism
            dayProfit = -(Math.random() * 60 + 15); // Losses $15-$75
          } else {
            // Winning days - distribute remaining profit
            const remainingDays = tradingDays.length - index;
            const maxWin = Math.min(300, (remainingProfit + 150) / remainingDays * 1.5); // Add buffer for losses
            dayProfit = Math.random() * maxWin + 50; // Wins $50-$maxWin
          }
        }
        
        remainingProfit -= dayProfit;
      }
      
      monthlyTradingData[monthKey].push({
        date: new Date(day),
        profit: Math.round(dayProfit * 100) / 100, // Round to 2 decimal places
        trades: Math.floor(Math.random() * 6) + 2 // 2-8 trades per day
      });
    });
  }

  // Generate trading days for each month in 2025 with EXACT profits
  for (let month = 0; month <= 10; month++) {
    const monthKey = `2025-${month}`;
    monthlyTradingData[monthKey] = [];
    
    const monthStart = new Date(2025, month, 1);
    // For October (9), end on 3rd. For November (10), full month projection or standard end
    const monthEnd = month === 9 ? new Date(2025, 9, 3) : new Date(2025, month + 1, 0); 
    
    // Collect all weekdays in the month (potential trading days)
    const allWeekdays: Date[] = [];
    let currentDay = new Date(monthStart);
    while (currentDay <= monthEnd) {
      const dayOfWeek = currentDay.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
        allWeekdays.push(new Date(currentDay));
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    // Select ~70% of weekdays as trading days (realistic pattern)
    const numTradingDays = Math.floor(allWeekdays.length * 0.7);
    const tradingDays = allWeekdays
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, numTradingDays)
      .sort((a, b) => a.getTime() - b.getTime()); // Sort back chronologically
    
    // Distribute the EXACT monthly profit across trading days
    const monthlyTarget = monthlyProfits2025[month];
    let remainingProfit = monthlyTarget;
    
    tradingDays.forEach((day, index) => {
      const isLastDay = index === tradingDays.length - 1;
      let dailyProfit: number;
      
      if (isLastDay) {
        // Last trading day gets exactly what's needed to reach monthly total
        dailyProfit = remainingProfit;
      } else {
        // Calculate profit for this day (balanced distribution)
        const isLossMonth = monthlyTarget < 0;
        
        if (isLossMonth) {
          // Loss months: mix of small wins and larger losses
          const shouldWin = Math.random() < 0.3; // 30% win rate in loss months
          if (shouldWin) {
            dailyProfit = Math.random() * 80 + 20; // Small wins $20-$100
          } else {
            // Distribute losses across remaining days
            const remainingDays = tradingDays.length - index;
            const maxLoss = Math.min(200, Math.abs(remainingProfit) / remainingDays * 1.5);
            dailyProfit = -(Math.random() * maxLoss + 50); // Losses $50-$maxLoss
          }
        } else {
          // Profit months: mostly wins with occasional small losses every 2 weeks (sporadically)
          // Create loss days at indices that are ~10 days apart (2 weeks of trading)
          const isLossDay = index % 10 === 7 || index % 10 === 8; // Losses at positions 7, 8, 17, 18, etc.
          
          if (isLossDay) {
            // Small losses to add realism
            dailyProfit = -(Math.random() * 60 + 20); // Losses $20-$80
          } else {
            // Winning days - distribute remaining profit
            const remainingDays = tradingDays.length - index;
            const maxWin = Math.min(300, (remainingProfit + 150) / remainingDays * 1.5); // Add buffer for losses
            dailyProfit = Math.random() * maxWin + 40; // Wins $40-$maxWin
          }
        }
        
        remainingProfit -= dailyProfit;
      }
      
      monthlyTradingData[monthKey].push({
        date: new Date(day),
        profit: Math.round(dailyProfit * 100) / 100,
        trades: Math.floor(Math.random() * 6) + 2 // 2-8 trades per day
      });
    });
  }
  
  // Generate data for all dates
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();
      
      let shouldTrade = false;
      let profit = 0;
      let trades = Math.floor(Math.random() * 6) + 2; // 2-8 trades
      
      // Handle 2023 data with EXACT monthly profits (Sep-Dec only)
      if (year === 2023 && month >= 8) {
        const monthKey = `2023-${month}`;
        const monthData = monthlyTradingData[monthKey];
        
        // Check if this specific day has trading data
        const dayData = monthData.find(d => 
          d.date.getDate() === currentDate.getDate() && 
          d.date.getMonth() === currentDate.getMonth() &&
          d.date.getFullYear() === currentDate.getFullYear()
        );
        
        if (dayData) {
          shouldTrade = true;
          profit = dayData.profit;
          trades = dayData.trades;
        }
      } else if (year === 2024) {
        const monthKey = `2024-${month}`;
        const monthData = monthlyTradingData[monthKey];
        
        // Check if this specific day has trading data
        const dayData = monthData.find(d => 
          d.date.getDate() === currentDate.getDate() && 
          d.date.getMonth() === currentDate.getMonth() &&
          d.date.getFullYear() === currentDate.getFullYear()
        );
        
        if (dayData) {
          shouldTrade = true;
          profit = dayData.profit;
          trades = dayData.trades;
        }
      } else if (year === 2025 && month <= 10) {
        const monthKey = `2025-${month}`;
        const monthData = monthlyTradingData[monthKey];
        
        // Check if this specific day has trading data
        const dayData = monthData.find(d => 
          d.date.getDate() === currentDate.getDate() && 
          d.date.getMonth() === currentDate.getMonth() &&
          d.date.getFullYear() === currentDate.getFullYear()
        );
        
        if (dayData) {
          shouldTrade = true;
          profit = dayData.profit;
          trades = dayData.trades;
        }
      }
      
      if (shouldTrade) {
        data.push({
          date: new Date(currentDate),
          profit: Math.round(profit * 100) / 100,
          trades
        });
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};

const tradingData = generateTradingData();

// Aggregate data by month
const generateMonthlyData = (): MonthData[] => {
  const monthlyData: MonthData[] = [];
  const today = new Date(2025, 9, 6); // October 6, 2025
  
  for (let year = 2023; year <= 2025; year++) {
    let maxMonth = 11; // Default to full year
    
    // Adjust max month based on year
    if (year === 2023) {
      // 2023: Start from September (month 8)
      for (let month = 8; month <= 11; month++) {
        const monthDays = tradingData.filter(d => 
          d.date.getFullYear() === year && d.date.getMonth() === month
        );
        
        if (monthDays.length > 0) {
          const totalProfit = monthDays.reduce((sum, d) => sum + d.profit, 0);
          const totalTrades = monthDays.reduce((sum, d) => sum + d.trades, 0);
          const winningDays = monthDays.filter(d => d.profit > 0).length;
          const losingDays = monthDays.filter(d => d.profit < 0).length;
          const profits = monthDays.map(d => d.profit);
          
          monthlyData.push({
            month,
            year,
            totalProfit,
            totalTrades,
            winningDays,
            losingDays,
            tradingDays: monthDays.length,
            avgDailyProfit: totalProfit / monthDays.length,
            bestDay: Math.max(...profits),
            worstDay: Math.min(...profits)
          });
        }
      }
    } else if (year === 2025) {
      // 2025: Up to November (month 10)
      for (let month = 0; month <= 10; month++) {
        if (month === 9) {
          // October 2025: only up to the 3rd (last trading day)
          const monthDays = tradingData.filter(d => 
            d.date.getFullYear() === year && 
            d.date.getMonth() === month &&
            d.date.getDate() <= 3
          );
          
          if (monthDays.length > 0) {
            const totalProfit = monthDays.reduce((sum, d) => sum + d.profit, 0);
            const totalTrades = monthDays.reduce((sum, d) => sum + d.trades, 0);
            const winningDays = monthDays.filter(d => d.profit > 0).length;
            const losingDays = monthDays.filter(d => d.profit < 0).length;
            const profits = monthDays.map(d => d.profit);
            
            monthlyData.push({
              month,
              year,
              totalProfit,
              totalTrades,
              winningDays,
              losingDays,
              tradingDays: monthDays.length,
              avgDailyProfit: totalProfit / monthDays.length,
              bestDay: Math.max(...profits),
              worstDay: Math.min(...profits)
            });
          }
        } else {
          const monthDays = tradingData.filter(d => 
            d.date.getFullYear() === year && d.date.getMonth() === month
          );
          
          if (monthDays.length > 0) {
            const totalProfit = monthDays.reduce((sum, d) => sum + d.profit, 0);
            const totalTrades = monthDays.reduce((sum, d) => sum + d.trades, 0);
            const winningDays = monthDays.filter(d => d.profit > 0).length;
            const losingDays = monthDays.filter(d => d.profit < 0).length;
            const profits = monthDays.map(d => d.profit);
            
            monthlyData.push({
              month,
              year,
              totalProfit,
              totalTrades,
              winningDays,
              losingDays,
              tradingDays: monthDays.length,
              avgDailyProfit: totalProfit / monthDays.length,
              bestDay: Math.max(...profits),
              worstDay: Math.min(...profits)
            });
          }
        }
      }
    } else {
      // 2024: Full year
      for (let month = 0; month <= 11; month++) {
        const monthDays = tradingData.filter(d => 
          d.date.getFullYear() === year && d.date.getMonth() === month
        );
        
        if (monthDays.length > 0) {
          const totalProfit = monthDays.reduce((sum, d) => sum + d.profit, 0);
          const totalTrades = monthDays.reduce((sum, d) => sum + d.trades, 0);
          const winningDays = monthDays.filter(d => d.profit > 0).length;
          const losingDays = monthDays.filter(d => d.profit < 0).length;
          const profits = monthDays.map(d => d.profit);
          
          monthlyData.push({
            month,
            year,
            totalProfit,
            totalTrades,
            winningDays,
            losingDays,
            tradingDays: monthDays.length,
            avgDailyProfit: totalProfit / monthDays.length,
            bestDay: Math.max(...profits),
            worstDay: Math.min(...profits)
          });
        }
      }
    }
  }
  
  return monthlyData;
};

const monthlyData = generateMonthlyData();

// Generate cumulative P&L data for the line chart
const generateCumulativeData = () => {
  const sortedData = tradingData.sort((a, b) => a.date.getTime() - b.date.getTime());
  let cumulativeProfit = 0;
  const cumulativeData: { date: string; profit: number; formattedDate: string }[] = [];
  
  // Group by month for cleaner chart
  const monthlyPoints: { [key: string]: { totalProfit: number; date: Date } } = {};
  
  sortedData.forEach(day => {
    const monthKey = `${day.date.getFullYear()}-${day.date.getMonth()}`;
    if (!monthlyPoints[monthKey]) {
      monthlyPoints[monthKey] = { totalProfit: 0, date: day.date };
    }
    monthlyPoints[monthKey].totalProfit += day.profit;
  });
  
  // Create cumulative data points
  Object.values(monthlyPoints)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .forEach(month => {
      cumulativeProfit += month.totalProfit;
      cumulativeData.push({
        date: month.date.toISOString().slice(0, 7), // YYYY-MM format
        profit: cumulativeProfit,
        formattedDate: month.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      });
    });
  
  return cumulativeData;
};

const cumulativeData = generateCumulativeData();

export function PerformanceCalendar() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState<MonthData | null>(null);
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const { theme, effectiveTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // More robust theme detection
  useEffect(() => {
    const checkTheme = () => {
      const isDark = effectiveTheme === 'dark' || 
                   document.documentElement.classList.contains('dark') ||
                   window.getComputedStyle(document.documentElement).getPropertyValue('--background').includes('0.145');
      setIsDarkMode(isDark);
    };
    
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, [effectiveTheme]);
  
  // Get the current theme colors with fallback
  const dotFillColor = isDarkMode ? '#ffffff' : '#030213';
  const chartStrokeColor = 'hsl(var(--chart-1))'; // Use the proper chart color from CSS
  
  // Get data for current year
  const yearData = monthlyData.filter(d => d.year === currentYear);
  
  // Calculate yearly statistics
  const yearlyProfit = yearData.reduce((sum, d) => sum + d.totalProfit, 0);
  const totalTradingDays = yearData.reduce((sum, d) => sum + d.tradingDays, 0);
  const totalWinningDays = yearData.reduce((sum, d) => sum + d.winningDays, 0);
  const totalLosingDays = yearData.reduce((sum, d) => sum + d.losingDays, 0);
  const avgMonthlyProfit = yearlyProfit / yearData.length || 0;
  const bestMonth = yearData.reduce((max, d) => d.totalProfit > max.totalProfit ? d : max, yearData[0] || { totalProfit: 0 });
  const worstMonth = yearData.reduce((min, d) => d.totalProfit < min.totalProfit ? d : min, yearData[0] || { totalProfit: 0 });
  
  const getProfitColor = (profit: number) => {
    if (profit > 0) {
      const intensity = Math.min(profit / 15000, 1); // Monthly scale
      return `rgba(34, 197, 94, ${0.2 + intensity * 0.6})`;
    } else if (profit < 0) {
      const intensity = Math.min(Math.abs(profit) / 8000, 1);
      return `rgba(239, 68, 68, ${0.2 + intensity * 0.6})`;
    }
    return 'transparent';
  };
  
  const goToPreviousYear = () => {
    setCurrentYear(prev => prev - 1);
    setSelectedMonth(null);
  };
  
  const goToNextYear = () => {
    setCurrentYear(prev => prev + 1);
    setSelectedMonth(null);
  };
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const getMonthData = (monthIndex: number): MonthData | undefined => {
    return yearData.find(d => d.month === monthIndex);
  };

  const handleMonthClick = (monthData: MonthData) => {
    setSelectedMonth(monthData);
    setViewMode('monthly');
    setSelectedDay(null);
  };

  const goBackToYearly = () => {
    setViewMode('yearly');
    setSelectedMonth(null);
    setSelectedDay(null);
  };

  // Monthly view data
  const getMonthlyViewData = () => {
    if (!selectedMonth) return { monthData: [], firstDayOfWeek: 0, daysInMonth: 0 };
    
    const year = selectedMonth.year;
    const month = selectedMonth.month;
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    const monthData = tradingData.filter(d => 
      d.date.getMonth() === month && d.date.getFullYear() === year
    );
    
    return { monthData, firstDayOfWeek: startingDayOfWeek, daysInMonth };
  };

  const getDayData = (day: number): DayData | undefined => {
    const { monthData } = getMonthlyViewData();
    return monthData.find(d => d.date.getDate() === day);
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4">Performance Calendar</h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Track daily profits and losses across your trading journey
          </p>
        </motion.div>
        
        {/* All-Time Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-luxury mb-6 sm:mb-8"
        >
          <div className="mb-3 sm:mb-4 md:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2">All-Time Performance</h3>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Cumulative P&L since inception</p>
          </div>
          
          <div className="h-48 md:h-64 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 10, fill: 'currentColor' }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.3 }}
                  axisLine={{ stroke: 'currentColor', opacity: 0.3 }}
                  interval="preserveStartEnd"
                  hide={window.innerWidth < 640}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'currentColor' }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.3 }}
                  axisLine={{ stroke: 'currentColor', opacity: 0.3 }}
                  tickFormatter={(value) => {
                    if (window.innerWidth < 640) {
                      return value >= 1000 ? `${(value/1000).toFixed(0)}k` : value.toString();
                    }
                    return `${value.toLocaleString()}`;
                  }}
                  width={window.innerWidth < 640 ? 40 : 60}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()}`, 'Cumulative P&L']}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke={chartStrokeColor}
                  strokeWidth={window.innerWidth < 640 ? 2 : 3}
                  dot={{ 
                    fill: dotFillColor, 
                    strokeWidth: 1, 
                    r: window.innerWidth < 640 ? 2 : 4, 
                    stroke: chartStrokeColor
                  }}
                  activeDot={{ 
                    r: window.innerWidth < 640 ? 4 : 6, 
                    fill: dotFillColor, 
                    stroke: chartStrokeColor
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Yearly Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Yearly P&L</span>
            </div>
            <div className={`text-2xl ${yearlyProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ${yearlyProfit.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Winning Days</span>
            </div>
            <div className="text-2xl">
              {totalWinningDays} <span className="text-sm text-muted-foreground">/ {totalTradingDays}</span>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Best Month</span>
            </div>
            <div className="text-2xl">
              {bestMonth && monthNames[bestMonth.month]?.slice(0, 3)}
              <div className="text-sm text-green-600 dark:text-green-400">
                ${bestMonth?.totalProfit.toFixed(0)}
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Avg Monthly P&L</span>
            </div>
            <div className={`text-2xl ${avgMonthlyProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ${avgMonthlyProfit.toFixed(0)}
            </div>
          </div>
        </motion.div>
        
        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-luxury"
        >
          {viewMode === 'yearly' ? (
            <>
              {/* Year Navigation */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl lg:text-3xl">
                  {currentYear} Performance Overview
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousYear}
                    className="rounded-full"
                    disabled={currentYear <= 2023}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextYear}
                    className="rounded-full"
                    disabled={currentYear >= 2025}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Monthly Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {monthNames.map((monthName, monthIndex) => {
                  const monthData = getMonthData(monthIndex);
                  const today = new Date(2025, 9, 6); // October 6, 2025
                  const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === monthIndex;
                  
                  return (
                    <motion.button
                      key={monthIndex}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => monthData && handleMonthClick(monthData)}
                      className={`
                        rounded-xl border transition-all relative p-4 h-32
                        ${monthData ? 'border-border hover:border-primary cursor-pointer' : 'border-transparent bg-muted/30'}
                        ${isCurrentMonth ? 'ring-2 ring-primary' : ''}
                      `}
                      style={{
                        backgroundColor: monthData ? getProfitColor(monthData.totalProfit) : 'transparent'
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <div className={`text-sm font-medium mb-2 ${!monthData ? 'text-muted-foreground' : ''}`}>
                          {monthName}
                        </div>
                        {monthData ? (
                          <>
                            <div className={`text-lg font-medium mb-1 ${monthData.totalProfit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                              {monthData.totalProfit >= 0 ? '+' : ''}${Math.abs(monthData.totalProfit).toFixed(0)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {monthData.winningDays}W / {monthData.losingDays}L
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            No Trades
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Monthly View Navigation */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goBackToYearly}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Year
                  </Button>
                  <h2 className="text-2xl lg:text-3xl">
                    {selectedMonth && monthNames[selectedMonth.month]} {selectedMonth?.year}
                  </h2>
                </div>
              </div>
              
              {/* Daily Calendar Grid */}
              {selectedMonth && (
                <div className="grid grid-cols-7 gap-2">
                  {/* Day Headers */}
                  {dayNames.map(day => (
                    <div
                      key={day}
                      className="text-center text-sm text-muted-foreground p-2 font-medium"
                    >
                      {day}
                    </div>
                  ))}
                  
                  {/* Empty cells before month starts */}
                  {Array.from({ length: getMonthlyViewData().firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  
                  {/* Calendar Days */}
                  {Array.from({ length: getMonthlyViewData().daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayData = getDayData(day);
                    const today = new Date(2025, 9, 6); // October 6, 2025
                    const isToday = today.toDateString() === new Date(selectedMonth.year, selectedMonth.month, day).toDateString();
                    
                    return (
                      <motion.button
                        key={day}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dayData && setSelectedDay(dayData)}
                        className={`
                          aspect-square rounded-xl border transition-all relative
                          ${dayData ? 'border-border hover:border-primary cursor-pointer' : 'border-transparent'}
                          ${isToday ? 'ring-2 ring-primary' : ''}
                          ${selectedDay?.date.getDate() === day && selectedDay?.date.getMonth() === selectedMonth.month ? 'ring-2 ring-blue-500' : ''}
                        `}
                        style={{
                          backgroundColor: dayData ? getProfitColor(dayData.profit) : 'transparent'
                        }}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                          <div className={`text-sm lg:text-base mb-1 ${!dayData ? 'text-muted-foreground' : ''}`}>
                            {day}
                          </div>
                          {dayData && (
                            <div className={`text-xs ${dayData.profit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                              ${Math.abs(dayData.profit).toFixed(0)}
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </motion.div>
        
        {/* Selected Day Details (Monthly View) */}
        <AnimatePresence>
          {selectedDay && viewMode === 'monthly' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-luxury"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl mb-2">
                    {selectedDay.date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <p className="text-muted-foreground">Daily Trading Performance</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDay(null)}
                >
                  Close
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background/50 rounded-xl p-6 border border-border">
                  <div className="text-sm text-muted-foreground mb-2">Daily P&L</div>
                  <div className={`text-3xl ${selectedDay.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {selectedDay.profit >= 0 ? '+' : ''}${selectedDay.profit.toFixed(2)}
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-xl p-6 border border-border">
                  <div className="text-sm text-muted-foreground mb-2">Total Trades</div>
                  <div className="text-3xl">
                    {selectedDay.trades}
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-xl p-6 border border-border">
                  <div className="text-sm text-muted-foreground mb-2">Avg Per Trade</div>
                  <div className={`text-3xl ${(selectedDay.profit / selectedDay.trades) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    ${(selectedDay.profit / selectedDay.trades).toFixed(2)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Monthly Summary (Yearly View) */}
        <AnimatePresence>
          {selectedMonth && viewMode === 'yearly' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-luxury"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl mb-2">
                    {monthNames[selectedMonth.month]} {selectedMonth.year}
                  </h3>
                  <p className="text-muted-foreground">Monthly Trading Summary</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMonthClick(selectedMonth)}
                  >
                    View Daily Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMonth(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-background/50 rounded-xl p-6 border border-border">
                  <div className="text-sm text-muted-foreground mb-2">Monthly P&L</div>
                  <div className={`text-3xl ${selectedMonth.totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {selectedMonth.totalProfit >= 0 ? '+' : ''}${selectedMonth.totalProfit.toFixed(0)}
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-xl p-6 border border-border">
                  <div className="text-sm text-muted-foreground mb-2">Trading Days</div>
                  <div className="text-3xl">
                    {selectedMonth.tradingDays}
                    <div className="text-sm text-muted-foreground">
                      {selectedMonth.winningDays}W / {selectedMonth.losingDays}L
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-xl p-6 border border-border">
                  <div className="text-sm text-muted-foreground mb-2">Win Rate</div>
                  <div className="text-3xl">
                    {((selectedMonth.winningDays / selectedMonth.tradingDays) * 100).toFixed(1)}%
                  </div>
                </div>
                
                <div className="bg-background/50 rounded-xl p-6 border border-border">
                  <div className="text-sm text-muted-foreground mb-2">Avg Daily P&L</div>
                  <div className={`text-3xl ${selectedMonth.avgDailyProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    ${selectedMonth.avgDailyProfit.toFixed(0)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
