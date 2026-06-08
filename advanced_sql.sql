-- =========================================================
-- ADVANCED ANALYTICAL SQL QUERIES (SQLite / PostgreSQL)
-- Proves deep capability with CTEs, Window Functions, and standard SQL
-- =========================================================

-- 1. WINDOW FUNCTION: ROW_NUMBER() - Top 3 Most Profitable Orders per Region
WITH RankedOrders AS (
    SELECT 
        Order_ID, Date, Region, Revenue, Profit,
        ROW_NUMBER() OVER(PARTITION BY Region ORDER BY Profit DESC) as Rank
    FROM sales
)
SELECT * FROM RankedOrders WHERE Rank <= 3;


-- 2. WINDOW FUNCTION: LAG() - Month-over-Month (MoM) Revenue Growth
WITH MonthlyRevenue AS (
    SELECT 
        STRFTIME('%Y-%m', Date) as Month,
        SUM(Revenue) as Total_Revenue
    FROM sales
    GROUP BY 1
)
SELECT 
    Month, Total_Revenue,
    LAG(Total_Revenue) OVER(ORDER BY Month) as Prev_Month_Rev,
    (Total_Revenue - LAG(Total_Revenue) OVER(ORDER BY Month)) / LAG(Total_Revenue) OVER(ORDER BY Month) * 100 as MoM_Growth_Pct
FROM MonthlyRevenue;


-- 3. COMMON TABLE EXPRESSIONS (CTEs) & JOINS - Customer Lifetime Segmentation
WITH CustomerTotals AS (
    SELECT 
        Customer_ID, 
        COUNT(Order_ID) as Total_Orders,
        SUM(Revenue) as Lifetime_Revenue
    FROM sales
    GROUP BY Customer_ID
),
CustomerTiers AS (
    SELECT 
        Customer_ID, Total_Orders, Lifetime_Revenue,
        CASE 
            WHEN Lifetime_Revenue > 10000 THEN 'Platinum'
            WHEN Lifetime_Revenue > 5000 THEN 'Gold'
            ELSE 'Standard'
        END as Tier
    FROM CustomerTotals
)
SELECT Tier, COUNT(*) as Customer_Count, SUM(Lifetime_Revenue) as Tier_Total_Revenue
FROM CustomerTiers
GROUP BY Tier;


-- 4. RUNNING TOTAL & MOVING AVERAGES
SELECT 
    Date, Region, Revenue,
    SUM(Revenue) OVER(PARTITION BY Region ORDER BY Date) as Regional_Running_Total,
    AVG(Revenue) OVER(PARTITION BY Region ORDER BY Date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as Rolling_7_Day_Avg
FROM sales
ORDER BY Region, Date;


-- 5. RFM PREPARATION IN SQL
SELECT 
    Customer_ID,
    CAST(JULIANDAY((SELECT MAX(Date) FROM sales)) - JULIANDAY(MAX(Date)) AS INTEGER) as Recency_Days,
    COUNT(Order_ID) as Frequency,
    SUM(Revenue) as Monetary_Value
FROM sales
GROUP BY Customer_ID;


-- 6. DENSE_RANK() - Ranking Sales Reps safely without skipping ties
SELECT 
    Sales_Rep_Name, Region,
    SUM(Revenue) as Total_Sales,
    DENSE_RANK() OVER(PARTITION BY Region ORDER BY SUM(Revenue) DESC) as Rep_Region_Rank
FROM sales
GROUP BY Sales_Rep_Name, Region;


-- 7. PIVOTING / CROSS TABULATION (Using Conditional Aggregation)
SELECT 
    Product_Category,
    SUM(CASE WHEN Region = 'North' THEN Revenue ELSE 0 END) as North_Revenue,
    SUM(CASE WHEN Region = 'South' THEN Revenue ELSE 0 END) as South_Revenue,
    SUM(CASE WHEN Region = 'East' THEN Revenue ELSE 0 END) as East_Revenue,
    SUM(CASE WHEN Region = 'West' THEN Revenue ELSE 0 END) as West_Revenue,
    SUM(CASE WHEN Region = 'Central' THEN Revenue ELSE 0 END) as Central_Revenue
FROM sales
GROUP BY Product_Category;

-- 8. Identify Next Period Revenue Change (LEAD)
--------------------------------------------------
SELECT 
    Region, Year, Month, 
    SUM(Revenue) as Current_Revenue,
    LEAD(SUM(Revenue)) OVER (PARTITION BY Region ORDER BY Year, Month) as Next_Month_Revenue
FROM sales
GROUP BY Region, Year, Month;

--------------------------------------------------
-- 9. Customer Segmentation by Quartiles (NTILE)
--------------------------------------------------
SELECT 
    Customer_ID, 
    SUM(Revenue) as Total_Spend,
    NTILE(4) OVER (ORDER BY SUM(Revenue) DESC) as Customer_Quartile
FROM sales
GROUP BY Customer_ID;

--------------------------------------------------
-- 10. Percentile Ranking by Sales Rep (PERCENT_RANK)
--------------------------------------------------
SELECT 
    Sales_Rep_Name,
    SUM(Revenue) as Total_Sales,
    PERCENT_RANK() OVER (ORDER BY SUM(Revenue)) as Sales_Percentile
FROM sales
GROUP BY Sales_Rep_Name;

--------------------------------------------------
-- 11. Cross-Region Sales Comparison
--------------------------------------------------
WITH RegionTotals AS (
    SELECT Region, SUM(Revenue) as TotalRevenue
    FROM sales
    GROUP BY Region
)
SELECT 
    r1.Region, r2.Region as Comparison_Region,
    r1.TotalRevenue - r2.TotalRevenue as Revenue_Difference
FROM RegionTotals r1
CROSS JOIN RegionTotals r2
WHERE r1.Region != r2.Region;

--------------------------------------------------
-- 12. Recursive CTE: Hierarchical Organization Structure of Sales Team [SCHEMA EXAMPLE ONLY]
--------------------------------------------------
WITH RECURSIVE SalesOrgPath AS (
   SELECT EmpID, EmpName, ManagerID, 1 AS Level
   FROM Employees WHERE ManagerID IS NULL
   UNION ALL
   SELECT e.EmpID, e.EmpName, e.ManagerID, p.Level + 1
   FROM Employees e
   INNER JOIN SalesOrgPath p ON e.ManagerID = p.EmpID
)
SELECT * FROM SalesOrgPath;

--------------------------------------------------
-- 13. Subquery-based Top-N Products Per Region
--------------------------------------------------
SELECT Region, Product_Name, Revenue
FROM (
    SELECT Region, Product_Name, SUM(Revenue) as Revenue,
      ROW_NUMBER() OVER(PARTITION BY Region ORDER BY SUM(Revenue) DESC) as rn
    FROM sales
    GROUP BY Region, Product_Name
) t
WHERE rn <= 3;

--------------------------------------------------
-- 14. Sales Target vs Actual Variance
--------------------------------------------------
SELECT a.Region, a.Year, a.Month,
    a.TotalRevenue as Actual_Revenue,
    t.Target_Revenue,
    ROUND((a.TotalRevenue / t.Target_Revenue - 1) * 100, 1) as Variance_Pct
FROM (SELECT Region, Year, Month, SUM(Revenue) as TotalRevenue FROM sales GROUP BY Region, Year, Month) a
LEFT JOIN Targets t ON a.Region=t.Region AND a.Year=t.Year AND a.Month=t.Month;

--------------------------------------------------
-- 15. Complex Joining & Aggregation: Identifying Ghost Customers [SCHEMA EXAMPLE ONLY]
--------------------------------------------------
SELECT c.Customer_ID, c.Customer_Name
FROM Dim_Customer c
LEFT JOIN sales f 
    ON c.Customer_ID = f.Customer_ID 
    AND f.Date >= DATE('now', '-12 months')
WHERE f.Customer_ID IS NULL;

--------------------------------------------------
-- 16. Cumulative Distribution Function (CUME_DIST)
--------------------------------------------------
SELECT 
    Customer_ID,
    SUM(Revenue) as Total_Revenue,
    CUME_DIST() OVER (ORDER BY SUM(Revenue)) as Revenue_Percentile
FROM sales
GROUP BY Customer_ID;

--------------------------------------------------
-- 17. Year-over-Year (YoY) Revenue Change (LAG with 12 offset)
--------------------------------------------------
WITH MonthlyRevenue AS (
    SELECT 
        STRFTIME('%Y-%m', Date) as Month_Year,
        SUM(Revenue) as Total_Revenue
    FROM sales
    GROUP BY 1
)
SELECT 
    Month_Year,
    Total_Revenue,
    LAG(Total_Revenue, 12) OVER (ORDER BY Month_Year) as Prev_Year_Revenue,
    ROUND((Total_Revenue - LAG(Total_Revenue, 12) OVER (ORDER BY Month_Year)) / LAG(Total_Revenue, 12) OVER (ORDER BY Month_Year) * 100, 2) as YoY_Growth_Pct
FROM MonthlyRevenue;

--------------------------------------------------
-- 18. Session Gap / Streak Query (Longest Consecutive Months of Purchasing)
--------------------------------------------------
WITH CustomerMonths AS (
    SELECT DISTINCT
        Customer_ID,
        STRFTIME('%Y-%m', Date) as Purchase_Month,
        CAST(STRFTIME('%Y', Date) AS INTEGER) * 12 + CAST(STRFTIME('%m', Date) AS INTEGER) as Month_Index
    FROM sales
),
GroupedStreaks AS (
    SELECT 
        Customer_ID,
        Month_Index,
        Month_Index - ROW_NUMBER() OVER (PARTITION BY Customer_ID ORDER BY Month_Index) as Streak_Group
    FROM CustomerMonths
)
SELECT 
    Customer_ID,
    COUNT(*) as Consecutive_Months_Streak
FROM GroupedStreaks
GROUP BY Customer_ID, Streak_Group
ORDER BY Consecutive_Months_Streak DESC
LIMIT 10;
