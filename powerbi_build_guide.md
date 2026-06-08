# Power BI .pbix Build Guide
**A Step-by-Step Guide to Assembling the Regional Sales Dashboard in Power BI Desktop**

## 1. Import Data & Power Query Transformations
1. Open Power BI Desktop. Click **Get Data** -> **Text/CSV**.
2. Select `cleaned_sales_data.csv`. Click **Transform Data** to open Power Query.
3. **Data Type Checks:** Ensure `Revenue`, `Profit`, `COGS`, `Discount_%` are decimal numbers. Ensure `Date` is a Date type.
4. **Duplicate Fact Table for Dimensions:** We need to build a Star Schema. 
   - Right-click the base `Sales` query and click **Reference** (name it `Dim_Product`).
     - Keep only `Product_SKU`, `Product_Category`, `Sub_Category`, `Product_Name`. Remove duplicates based on `Product_SKU`.
   - Repeat for `Dim_Customer` (keep `Customer_ID`, `Customer_Name`, `Customer_Segment`). Remove duplicates.
   - Repeat for `Dim_Region` (keep `Region`, `State`, `City`).
5. **Create Date Table:** Back in the main window, go to **Modeling** -> **New Table**. However, to ensure proper time-intelligence, creating it via Power Query is recommended.
   - Go to **Power Query** -> **New Source** -> **Blank Query**.
   - Open the **Advanced Editor** and paste the following M Code:
     ```powerquery
     let
         StartDate = #date(2021, 1, 1),EndDate   = #date(2024, 12, 31),
         Duration  = Duration.Days(EndDate - StartDate) + 1,
         Dates     = List.Dates(StartDate, Duration, #duration(1,0,0,0)),
         Table     = Table.FromList(Dates, Splitter.SplitByNothing(), {"Date"}),
         AddYear   = Table.AddColumn(Table,   "Year",       each Date.Year([Date]),   Int64.Type),
         AddQtr    = Table.AddColumn(AddYear, "Quarter",    each "Q" & Text.From(Date.QuarterOfYear([Date]))),
         AddMonth  = Table.AddColumn(AddQtr,  "Month",      each Date.Month([Date]),  Int64.Type),
         AddMName  = Table.AddColumn(AddMonth,"Month_Name", each Date.ToText([Date], "MMM")),
         AddWday   = Table.AddColumn(AddMName,"Weekday",    each Date.DayOfWeekName([Date]))
     in AddWday
     ```
   - Name the query `Dim_Date` and click Close & Apply. Mark the table as a **Date Table** on the `Date` column in the model view.
6. **Clean Fact Table:** In Power Query, for the `Fact_Sales` table, keep only the Foreign Keys (`Product_SKU`, `Customer_ID`, `Region` (or generate a Geo_ID), `Date`) and the numeric facts (`Revenue`, etc.).
7. Click **Close & Apply**.

## 2. Build the Relationships (Star Schema)
1. Go to the **Model View** (third icon on the left).
2. Drag `Date` from `Dim_Date` to `Date` in `Fact_Sales` (1-to-Many).
3. Drag `Product_SKU` from `Dim_Product` to `Product_SKU` in `Fact_Sales` (1-to-Many).
4. Drag `Customer_ID` from `Dim_Customer` to `Customer_ID` in `Fact_Sales` (1-to-Many).
5. Verify cross-filter direction is **Single** (from Dimension to Fact).

## 3. Apply the Custom Theme
1. Go to the **View** ribbon.
2. Click the dropdown in the **Themes** gallery.
3. Select **Browse for themes**.
4. Select the `powerbi_theme.json` file provided in this repository.
5. Watch the background, text, and data colors instantly snap to the luxurious Dark Navy & Gold scheme.

## 4. Add DAX Measures
1. Go to **Modeling** -> **New Table**, name it `_MeasureTable` (put `""` inside it to create an empty table). 
2. Creating a dedicated measure table is a senior practice. Keep it at the top of your fields pane by hiding the dummy column.
3. **Create What-If Discount Parameter:** For the "Discount Impact on Profit" measure to work, you must create a What-If parameter.
   - Go to **Modeling tab** -> **New Parameter** -> **Numeric range**.
   - Name: `WhatIfDiscount`
   - Data type: Decimal number
   - Minimum: `-10`, Maximum: `10`, Increment: `0.5`
   - Click Create.
4. Systematically copy and paste the DAX code from `dax_measures.txt` into New Measures within this table.

## 5. Implement the Canvas & Bookmarks
1. Setup a **Navigation Pane** on the left side using basic Shape objects (Rectangles) colored `#0D1B31`. Add Page Navigator buttons.
2. Build **Page 1: Executive Summary** using the KPI cards.
3. **Advanced Bookmarks Toggle (Table vs Chart):**
   - Insert a Bar Chart and a Matrix Visual covering the exact same canvas space.
   - Open **View** -> **Selection** and **Bookmarks** panes.
   - Hide the Matrix, show the Chart, create a bookmark named `Show Chart`. Ensure "Data" is UNCHECKED in bookmark settings to prevent filter resets.
   - Hide the Chart, show the Matrix, create a bookmark named `Show Matrix`.
   - Assign these bookmarks to two toggle buttons.
4. Add polished Tooltips by creating a hidden page (Page Information -> Tooltip = On) with a trendline chart, and assign it to the main visuals.

## 6. Publish to Service
1. Click **Publish** to your Power BI workspace.
2. Configure scheduled refresh (if linked to a dynamic source like SQLite) or share the linked dashboard link in your portfolio.
