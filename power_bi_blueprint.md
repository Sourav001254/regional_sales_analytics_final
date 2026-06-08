# POWER BI DASHBOARD DESIGN BLUEPRINT

## DESIGN RULES & THEME
- **Color Palette:** Dark Navy (`#0A162B`), Slate (`#111F38`), Gold/Accent (`#D4AF37`), Emerald (`#10B981`) for positive, Rose (`#F43F5E`) for negative.
- **Navigation:** Persistent left-side navigation bar with icons for the 6 pages.
- **Interactivity:** Bookmarks to toggle table/chart views. Mini trend charts in hover tooltips.

---

## PAGE 1 — Executive Summary
**Purpose:** High-level overview of business performance.
- **Header:** Dynamic Text (`"Best performing region: [Region] with $[X] Revenue"`)
- **KPI Cards (Top Row):** Revenue, Profit, Orders, Margin %, Growth %, Return Rate.
- **Visual 1 (Top Right):** Revenue trend sparkline (Line chart, 12 months, hidden axes).
- **Visual 2 (Middle Left):** Region-wise revenue contribution (Donut chart).
- **Visual 3 (Bottom):** Top 5 Products (Table with data bars for Revenue and conditional coloring for Profit Margin).

---

## PAGE 2 — Regional Deep Dive
**Purpose:** Geographical performance insights.
- **Visual 1 (Center Left):** Map visual (Choropleth map of State-level revenue intensity).
- **Visual 2 (Center Right):** Clustered Bar chart (Region on X-axis, Grouped Revenue & Profit on Y-axis).
- **Visual 3 (Bottom Right):** Scatter plot quadrant analysis (X = Region Revenue, Y = YoY Growth rate, crosshair average lines).
- **Filters (Side Panel):** Slicers for Region, Year, Quarter.

---

## PAGE 3 — Product Analysis
**Purpose:** Granular view of what we sell and what is profitable.
- **Visual 1 (Top Left):** Matrix visualization (Hierarchy: Category → Sub-Category → Product. Enable drill-through).
- **Visual 2 (Top Right):** Treemap (Revenue contribution by Product_Category, color intensity by Profit Margin).
- **Visual 3 (Bottom Left):** Pareto line/column mixed chart (Products on X-axis, Revenue as columns, Cumulative % as line threshold at 80%).
- **Interactive Toggles:** Bookmark buttons to switch between "Top 10 Products" and "Bottom 10 Products" views.

---

## PAGE 4 — Sales Rep & Customer Analysis
**Purpose:** Evaluating human capital and customer segmentation.
- **Visual 1 (Left Col):** Sales Rep leaderboard (Table with Rank, Rep Name, Revenue, Target Gauge visual).
- **Visual 2 (Top Right):** RFM Customer Segmentation (Stacked Bar chart of VIP, Loyal, At-Risk, Standard counts).
- **Visual 3 (Middle Right):** Revenue Breakdown by Customer Segment (B2B vs B2C vs Enterprise, 100% stacked bar).
- **Visual 4 (Bottom Right):** Customer Rating Distribution (Histogram / Column chart showing count of 1-5 star ratings).

---

## PAGE 5 — Time Intelligence
**Purpose:** Trends, seasonality, and forecasting.
- **Visual 1 (Top Left):** YoY Comparison Waterfall chart (Base previous year, up/down variances by quarter, current year end total).
- **Visual 2 (Top Right):** Revenue vs Target Line chart (Actuals line vs Target line, with shaded gap area for variances).
- **Visual 3 (Bottom Left):** Seasonal Analysis Heat matrix (Rows: Months, Columns: Years, Values: Revenue intensity).
- **Visual 4 (Bottom Right):** Forecast line chart (Historical revenue + 3-month forward projection with upper/lower confidence bounds).

---

## PAGE 6 — What-If & Scenario Analysis
**Purpose:** Interactive simulation for executives.
- **Control Panel:** Numeric parameter slicer (Adjust Base Discount % range: -10% to +10%).
- **Visual 1 (Top Left):** Scenario toggle buttons (Optimistic, Base, Pessimistic baseline assumptions).
- **Visual 2 (Top Right):** Sensitivity Analysis Matrix (Units Sold vs Price adjustments impacting simulated net profit).
- **Visual 3 (Bottom):** Simulated Profit Impact chart (Clustered column comparing "Current Profit" vs "Simulated Profit" based on slicer selection).
