# IMPULSE HUB Performance Calendar - Complete Data Breakdown

## 📊 DATA OVERVIEW
**Period:** January 1, 2023 - October 4, 2024  
**Total Trading Days Generated:** ~400+ days (excluding weekends)  
**Trading Frequency:** 65% of weekdays (realistic trading pattern)  
**Win Rate:** 45% (realistic professional trader statistics)

---

## 🎯 PROFIT/LOSS GENERATION LOGIC

### **Winning Trades (45% probability)**
- **Range:** $50 - $800 per day
- **Formula:** `baseProfit = Math.random() * 750 + 50`
- **Volatility Factor:** `Math.sin(date) * 100` (seasonal market variations)
- **Trades per Day:** 2-10 trades
- **Final Calculation:** `(baseProfit + volatility) rounded to 2 decimals`

### **Losing Trades (55% probability)**
- **Range:** -$20 to -$400 per day (good risk management)
- **Formula:** `baseLoss = -(Math.random() * 380 + 20)`
- **Volatility Factor:** `Math.sin(date) * 50` (smaller volatility on losses)
- **Trades per Day:** 1-7 trades
- **Final Calculation:** `(baseLoss + volatility) rounded to 2 decimals`

---

## 📅 DAILY DATA STRUCTURE

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `date` | Date | Trading date (weekdays only) | `2024-01-15` |
| `profit` | Number | Daily P&L in USD | `$342.75` |
| `trades` | Number | Number of trades executed | `5` |

### **Sample Daily Records:**
```javascript
{
  date: new Date(2024, 0, 15),  // Jan 15, 2024
  profit: 342.75,
  trades: 5
},
{
  date: new Date(2024, 0, 16),  // Jan 16, 2024
  profit: -156.20,
  trades: 3
}
```

---

## 📊 MONTHLY AGGREGATION DATA

| Field | Description | Calculation | Example |
|-------|-------------|-------------|---------|
| `month` | Month index (0-11) | Direct from date | `0` (January) |
| `year` | Year | Direct from date | `2024` |
| `totalProfit` | Monthly P&L | Sum of all daily profits | `$12,450.00` |
| `totalTrades` | Monthly trades | Sum of all daily trades | `247` |
| `winningDays` | Days with profit > 0 | Count positive days | `14` |
| `losingDays` | Days with profit < 0 | Count negative days | `8` |
| `tradingDays` | Total active days | Total days with trades | `22` |
| `avgDailyProfit` | Average per day | `totalProfit / tradingDays` | `$565.45` |
| `bestDay` | Highest single day | `Math.max(profits)` | `$789.50` |
| `worstDay` | Lowest single day | `Math.min(profits)` | `-$298.30` |

---

## 🎨 COLOR CODING SYSTEM

### **Monthly View (Calendar Grid)**
```javascript
// Profit Color Intensity
if (profit > 0) {
  intensity = Math.min(profit / 15000, 1);  // Scale to $15k max
  color = `rgba(34, 197, 94, ${0.2 + intensity * 0.6})`;  // Green
} else if (profit < 0) {
  intensity = Math.min(Math.abs(profit) / 8000, 1);  // Scale to $8k max loss
  color = `rgba(239, 68, 68, ${0.2 + intensity * 0.6})`;  // Red
}
```

### **Daily View (Individual Days)**
- **Green Gradient:** Profit range $0 - $800+ (opacity 0.2 - 0.8)
- **Red Gradient:** Loss range $0 - $400+ (opacity 0.2 - 0.8)
- **Transparent:** No trading activity

---

## 📈 CUMULATIVE PERFORMANCE CHART

### **Data Points Generation:**
1. **Sort all daily data** chronologically
2. **Group by month** for cleaner visualization
3. **Calculate running total** of monthly profits
4. **Format dates** as "MMM YYYY" (e.g., "Jan 2024")

### **Chart Data Structure:**
```javascript
{
  date: "2024-01",
  profit: 45678.90,  // Cumulative total
  formattedDate: "Jan 2024"
}
```

---

## 🏆 YEARLY STATISTICS

### **Calculated Metrics:**
| Metric | Calculation | Purpose |
|--------|-------------|---------|
| **Yearly P&L** | Sum of all monthly totals | Overall performance |
| **Total Trading Days** | Sum of all trading days | Activity level |
| **Total Winning Days** | Sum of all winning days | Success frequency |
| **Total Losing Days** | Sum of all losing days | Risk assessment |
| **Avg Monthly P&L** | Yearly P&L ÷ number of months | Consistency |
| **Best Month** | Month with highest profit | Peak performance |
| **Worst Month** | Month with lowest profit | Risk evaluation |

---

## 🎯 PERFORMANCE TARGETS & BENCHMARKS

### **Realistic Trading Metrics:**
- **Win Rate:** 45% (industry standard for day traders)
- **Risk/Reward Ratio:** ~1:2 (losses capped at $400, wins up to $800)
- **Monthly Targets:** $8,000 - $15,000 positive months
- **Drawdown Limits:** Max $8,000 monthly loss
- **Trading Frequency:** 65% of available trading days

### **Seasonal Variations:**
- **Q1:** Higher volatility (tax season, earnings)
- **Q2:** Steady growth period
- **Q3:** Summer trading slowdown
- **Q4:** Holiday volatility and year-end positioning

---

## 📊 USER INTERFACE FEATURES

### **Interactive Elements:**
1. **Month Tiles:** Click to drill down to daily view
2. **Daily Calendar:** Click individual days for trade details
3. **Color Intensity:** Visual profit/loss magnitude
4. **Current Day Highlight:** Ring indicator for today
5. **Navigation:** Year switcher (2023-2024 available)

### **Data Display Formats:**
- **Currency:** `$12,450` (no cents for large amounts)
- **Percentages:** `67.5%` (one decimal place)
- **Win/Loss Records:** `14W / 8L` format
- **Dates:** Full format for details, abbreviated for grids

---

## 🔢 SAMPLE PERFORMANCE DATA

### **January 2024 Example:**
- **Total Profit:** $12,847.50
- **Trading Days:** 22
- **Winning Days:** 14 
- **Losing Days:** 8
- **Win Rate:** 63.6%
- **Best Day:** $789.50
- **Worst Day:** -$298.30
- **Avg Daily P&L:** $583.98

### **October 2024 (Partial):**
- **Total Profit:** $1,456.75 (4 days only)
- **Trading Days:** 3
- **Winning Days:** 2
- **Losing Days:** 1
- **Win Rate:** 66.7%
- **Best Day:** $645.25
- **Worst Day:** -$123.80

---

## 🎨 VISUAL DESIGN SPECIFICATIONS

### **Card Shadows:**
- **Standard:** `shadow-luxury` (25px blur, 20% opacity)
- **Hover:** `shadow-luxury-hover` (35px blur, 25% opacity)

### **Border Radius:**
- **Cards:** `rounded-2xl` (16px)
- **Buttons:** `rounded-xl` (12px)
- **Small elements:** `rounded-full`

### **Color Palette:**
- **Success:** `text-green-600 dark:text-green-400`
- **Loss:** `text-red-600 dark:text-red-400`
- **Muted:** `text-muted-foreground`
- **Primary:** `text-foreground`

---

*This breakdown covers all data generation, calculations, and display logic used in the IMPULSE HUB Performance Calendar system. The data simulates realistic professional trading performance with proper risk management and seasonal market variations.*