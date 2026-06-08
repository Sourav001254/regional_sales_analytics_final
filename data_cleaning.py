import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
import os
import sys
import json

# Add current directory to path to import src.logger
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from logger import logger

warnings.filterwarnings('ignore')

def clean_and_transform(input_file="data/synthetic_sales_data.csv", output_file="cleaned_sales_data.csv"):
    logger.info("="*50)
    logger.info("STAGE 2: DATA CLEANING & TRANSFORMATION")
    logger.info("="*50)
    
    # ---------------------------------------------------------
    # 1. LOAD DATA
    # ---------------------------------------------------------
    try:
        df = pd.read_csv(input_file)
        raw_shape = df.shape
        logger.info("Data Loaded successfully. Shape before cleaning: %s", raw_shape)
    except FileNotFoundError:
        logger.error("Error: %s not found. Ensure Step 1 has generated the dataset.", input_file)
        return
    
    # ---------------------------------------------------------
    # 2. HANDLE MISSING VALUES
    # ---------------------------------------------------------
    logger.info("Checking for Missing Values...")
    missing_before = df.isnull().sum()
    missing_cols = missing_before[missing_before > 0]
    if not missing_cols.empty:
        logger.info("Missing values found:\n%s", missing_cols.to_string())
    
    # Fill categorical nulls with mode
    for col in ['Customer_Segment', 'Channel']:
        if col in df.columns:
            df[col].fillna(df[col].mode()[0], inplace=True)
            
    # Fill numeric nulls
    if 'Delivery_Days' in df.columns:
        df['Delivery_Days'].fillna(df['Delivery_Days'].median(), inplace=True)
    if 'Return_Flag' in df.columns:
        df['Return_Flag'].fillna(0, inplace=True) 

    logger.info("Missing values after fillna: %s", df.isnull().sum().sum())

    # ---------------------------------------------------------
    # 3. REMOVE DUPLICATES
    # ---------------------------------------------------------
    duplicates_count = df.duplicated(subset=['Order_ID']).sum()
    logger.info("Found %d duplicate rows. Removing...", duplicates_count)
    df.drop_duplicates(subset=['Order_ID'], inplace=True)
    logger.info("Shape after duplicate removal: %s", df.shape)

    # ---------------------------------------------------------
    # 4. FIX DATA TYPES & PARSE MIXED TYPES
    # ---------------------------------------------------------
    logger.info("Fixing Data Types...")
    
    # Fix currency-symbol prices
    if 'Unit_Price' in df.columns:
        df['Unit_Price'] = df['Unit_Price'].astype(str).str.replace(r'[\$,]', '', regex=True)
        df['Unit_Price'] = pd.to_numeric(df['Unit_Price'], errors='coerce')
        
    # Fix mixed date formats
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'], format='mixed', errors='coerce')
        unparsed = df['Date'].isna().sum()
        if unparsed > 0:
            logger.warning("%d dates could not be parsed and were dropped", unparsed)
            df.dropna(subset=['Date'], inplace=True)
            
    df['Year'] = df['Date'].dt.year
    df['Quarter'] = 'Q' + df['Date'].dt.quarter.astype(str)
    
    # Fix negative COGS and Revenue
    if 'COGS' in df.columns:
        df['COGS'] = df['COGS'].abs()
    if 'Revenue' in df.columns:
        df['Revenue'] = df['Revenue'].abs()
        
    # Recalculate Profit
    if 'Profit' in df.columns and 'Revenue' in df.columns and 'COGS' in df.columns:
        df['Profit'] = df['Revenue'] - df['COGS']
    
    # Recalculate Profit Margin
    if 'Profit_Margin_%' in df.columns and 'Profit' in df.columns and 'Revenue' in df.columns:
        df['Profit_Margin_%'] = np.where(df['Revenue'] != 0, (df['Profit'] / df['Revenue']) * 100, 0)
        
    # Drop remaining rows with null Revenue or COGS that couldn't be parsed
    df.dropna(subset=['Revenue', 'COGS'], inplace=True)

    logger.info("Converted 'Date' to datetime64[ns] and fixed Unit_Price, COGS, Revenue, Profit.")

    # ---------------------------------------------------------
    # 5. DETECT AND TREAT OUTLIERS (IQR METHOD)
    # ---------------------------------------------------------
    logger.info("Outlier Detection & Treatment...")
    # Visualize Before
    plt.figure(figsize=(10, 5))
    sns.boxplot(x=df['Revenue'], color='lightcoral')
    plt.title('Revenue Distribution (Before Outlier Treatment)')
    plt.savefig('revenue_outliers_before.png')
    plt.close()
    
    Q1 = df['Revenue'].quantile(0.25)
    Q3 = df['Revenue'].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    outliers = df[(df['Revenue'] < lower_bound) | (df['Revenue'] > upper_bound)]
    logger.info("Detected %d outliers in Revenue using IQR method.", outliers.shape[0])
    
    # Treatment: Capping extreme high values to the upper bound
    df['Revenue'] = np.where(df['Revenue'] > upper_bound, upper_bound, df['Revenue'])
    logger.info("Outliers capped to Upper Bound.")
    
    # Visualize After
    plt.figure(figsize=(10, 5))
    sns.boxplot(x=df['Revenue'], color='lightgreen')
    plt.title('Revenue Distribution (After Outlier Treatment)')
    plt.savefig('revenue_outliers_after.png')
    plt.close()

    # ---------------------------------------------------------
    # 6. FEATURE ENGINEERING
    # ---------------------------------------------------------
    logger.info("Feature Engineering in progress...")
    
    df['Revenue_Tier'] = pd.qcut(df['Revenue'], q=3, labels=['Low', 'Medium', 'High'])
    
    prof_norm = (df['Profit'] - df['Profit'].min()) / (df['Profit'].max() - df['Profit'].min())
    df['Customer_Lifetime_Value_Score'] = round((prof_norm * 0.7 + (df['Customer_Rating'] / 5) * 0.3) * 100, 2)
    
    df['Days_to_Profit_Breakeven'] = np.where(
        df['Profit'] > 0, 
        round((df['COGS'] / df['Profit']) * df['Delivery_Days'], 1), 
        np.nan
    )
    
    df.sort_values(by=['Region', 'Date'], inplace=True)
    df['Rolling_7day_Revenue'] = df.groupby('Region')['Revenue'].transform(lambda x: x.rolling(window=7, min_periods=1).mean())
    df['Rolling_7day_Revenue'] = df['Rolling_7day_Revenue'].round(2)
    
    df['Month'] = df['Date'].dt.month
    monthly_agg = df.groupby(['Region', 'Year', 'Month'])['Revenue'].sum().reset_index()
    monthly_agg = monthly_agg.sort_values(by=['Region', 'Year', 'Month'])
    monthly_agg['YoY_Growth_%'] = monthly_agg.groupby('Region')['Revenue'].shift(12).fillna(0)
    monthly_agg['YoY_Growth_%'] = np.where(monthly_agg['YoY_Growth_%'] == 0, 0, 
                                           ((monthly_agg['Revenue'] - monthly_agg['YoY_Growth_%']) / monthly_agg['YoY_Growth_%']) * 100)
    
    if 'YoY_Growth_%' in df.columns:
        df = df.drop(columns=['YoY_Growth_%'])
    df = df.merge(monthly_agg[['Region', 'Year', 'Month', 'YoY_Growth_%']], on=['Region', 'Year', 'Month'], how='left')
    df['YoY_Growth_%'] = df['YoY_Growth_%'].round(2)

    def get_season(month):
        if month in [3, 4, 5]: return 'Spring'
        elif month in [6, 7, 8]: return 'Summer'
        elif month in [9, 10, 11]: return 'Autumn'
        else: return 'Winter'
    df['Season'] = df['Date'].dt.month.apply(get_season)
    
    df['High_Value_Flag'] = (df['Profit_Margin_%'] > 20).astype(int)

    logger.info("Added new columns: Revenue_Tier, Customer_Lifetime_Value_Score, Days_to_Profit_Breakeven, "
          "Rolling_7day_Revenue, YoY_Growth_%, Season, High_Value_Flag.")

    # ---------------------------------------------------------
    # 7. EXPORT CLEANED DATA & REPORT
    # ---------------------------------------------------------
    df.to_csv(output_file, index=False)
    logger.info("Cleaned dataset saved to %s", output_file)
    logger.info("Final Shape: %s", df.shape)
    
    cleaning_report = {
        "nulls_found": int(missing_before.sum()),
        "nulls_fixed": int(missing_before.sum()),
        "duplicates_removed": int(duplicates_count),
        "outliers_capped": int(outliers.shape[0]),
        "rows_before": raw_shape[0],
        "rows_after": int(df.shape[0]),
        "columns_engineered": 7
    }
    
    with open("cleaning_report.json", "w") as f:
        json.dump(cleaning_report, f, indent=2)
    logger.info("Cleaning report saved to cleaning_report.json")
    
    logger.info("="*50)

if __name__ == "__main__":
    clean_and_transform("data/synthetic_sales_data.csv", "cleaned_sales_data.csv")
