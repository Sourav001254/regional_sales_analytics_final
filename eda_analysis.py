import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import folium
from folium.plugins import HeatMap
import warnings
import os
import sys
from statsmodels.tsa.seasonal import seasonal_decompose
import matplotlib.ticker as ticker

# Add current directory to path to import src.logger
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from logger import logger

warnings.filterwarnings('ignore')

def run_eda(input_file="cleaned_sales_data.csv", output_dir="eda_charts"):
    logger.info("="*50)
    logger.info("STAGE 3: EXPLORATORY DATA ANALYSIS (EDA)")
    logger.info("="*50)
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        df = pd.read_csv(input_file)
        df['Date'] = pd.to_datetime(df['Date'])
    except Exception as e:
        logger.error("Error loading %s. Run Step 2 (Data Cleaning) first.", input_file)
        return

    # Set professional style
    sns.set_theme(style="whitegrid", palette="deep")
    plt.rcParams.update({'figure.dpi': 300, 'savefig.bbox': 'tight'})
    
    # ---------------------------------------------------------
    # 1. UNIVARIATE ANALYSIS
    # ---------------------------------------------------------
    logger.info("Generating Univariate Charts...")
    
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    metrics = ['Revenue', 'Profit', 'Units_Sold']
    colors = ['#4C72B0', '#55A868', '#C44E52']
    
    for ax, metric, color in zip(axes, metrics, colors):
        sns.histplot(df[metric], kde=True, ax=ax, color=color, bins=30)
        ax.set_title(f'Distribution of {metric}', fontweight='bold')
    plt.savefig(f"{output_dir}/univariate_distributions.png")
    plt.close()

    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    sns.countplot(data=df, x='Region', ax=axes[0,0], palette='Blues_r', order=df['Region'].value_counts().index)
    axes[0,0].set_title('Orders by Region', fontweight='bold')
    
    sns.countplot(data=df, x='Product_Category', ax=axes[0,1], palette='Greens_r', order=df['Product_Category'].value_counts().index)
    axes[0,1].set_title('Orders by Category', fontweight='bold')
    
    sns.countplot(data=df, x='Channel', ax=axes[1,0], palette='Oranges_r')
    axes[1,0].set_title('Orders by Channel', fontweight='bold')
    
    sns.countplot(data=df, x='Customer_Segment', ax=axes[1,1], palette='Purples_r')
    axes[1,1].set_title('Orders by Customer Segment', fontweight='bold')
    plt.tight_layout()
    plt.savefig(f"{output_dir}/univariate_counts.png")
    plt.close()

    # ---------------------------------------------------------
    # 2. BIVARIATE ANALYSIS
    # ---------------------------------------------------------
    logger.info("Generating Bivariate Charts...")
    plt.figure(figsize=(10, 6))
    sns.lmplot(data=df, x='Revenue', y='Profit', hue='Region', height=6, aspect=1.5, scatter_kws={'alpha':0.5})
    plt.title("Revenue vs Profit by Region", fontweight='bold')
    plt.savefig(f"{output_dir}/bivariate_revenue_profit.png")
    plt.close('all')

    plt.figure(figsize=(10, 6))
    sns.boxplot(data=df, x='Product_Category', y='Profit_Margin_%', palette='Set2')
    plt.title("Profit Margin by Product Category", fontweight='bold')
    plt.savefig(f"{output_dir}/bivariate_margin_category.png")
    plt.close()

    plt.figure(figsize=(10, 8))
    num_cols = df.select_dtypes(include=[np.number]).columns
    # Filtering down to core numeric for clean heatmap
    core_num = ['Units_Sold', 'Unit_Price', 'Discount_%', 'COGS', 'Revenue', 'Profit', 'Profit_Margin_%', 'Delivery_Days', 'Customer_Rating']
    corr = df[core_num].corr()
    mask = np.triu(np.ones_like(corr, dtype=bool))
    sns.heatmap(corr, mask=mask, annot=True, fmt=".2f", cmap='coolwarm', vmin=-1, vmax=1, square=True)
    plt.title("Correlation Matrix of Numeric Features", fontweight='bold')
    plt.savefig(f"{output_dir}/bivariate_correlation.png")
    plt.close()

    # ---------------------------------------------------------
    # 3. MULTIVARIATE ANALYSIS
    # ---------------------------------------------------------
    logger.info("Generating Multivariate Charts...")
    pair_cols = ['Revenue', 'Profit', 'Units_Sold', 'Discount_%', 'Region']
    sns.pairplot(df[pair_cols], hue='Region', corner=True, diag_kind='kde')
    plt.savefig(f"{output_dir}/multivariate_pairplot.png")
    plt.close()

    plt.figure(figsize=(12, 8))
    scatter = sns.scatterplot(data=df, x='Revenue', y='Profit', size='Units_Sold', sizes=(20, 500), hue='Region', alpha=0.7, palette='tab10')
    plt.title("Bubble Chart: Revenue vs Profit (Size = Units Sold)", fontweight='bold')
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.savefig(f"{output_dir}/multivariate_bubble.png")
    plt.close()

    # ---------------------------------------------------------
    # 4. TIME SERIES ANALYSIS
    # ---------------------------------------------------------
    logger.info("Generating Time Series Charts...")
    monthly_rev = df.resample('ME', on='Date')['Revenue'].sum().reset_index()
    
    plt.figure(figsize=(14, 6))
    plt.plot(monthly_rev['Date'], monthly_rev['Revenue'], marker='o', linestyle='-', color='#2c3e50', linewidth=2)
    # Peak Annotation
    peak_date = monthly_rev.loc[monthly_rev['Revenue'].idxmax(), 'Date']
    peak_rev = monthly_rev['Revenue'].max()
    plt.annotate(f'Peak: ${peak_rev:,.0f}', xy=(peak_date, peak_rev), xytext=(peak_date, peak_rev*1.05),
                 arrowprops=dict(facecolor='red', shrink=0.05), fontsize=10, color='darkred', fontweight='bold')
    
    # 3-Month Rolling Overlay
    monthly_rev['Rolling_3M'] = monthly_rev['Revenue'].rolling(window=3).mean()
    plt.plot(monthly_rev['Date'], monthly_rev['Rolling_3M'], linestyle='--', color='#e74c3c', linewidth=2, label='3-Month Rolling Avg')
    plt.title("Monthly Revenue Trend (2021-2024)", fontweight='bold')
    plt.legend()
    plt.ylabel("Revenue ($)")
    plt.savefig(f"{output_dir}/timeseries_monthly_trend.png")
    plt.close()

    # YoY Comparison
    yearly = df.groupby('Year')['Revenue'].sum().reset_index()
    plt.figure(figsize=(8, 6))
    sns.barplot(data=yearly, x='Year', y='Revenue', palette='viridis')
    plt.title("YoY Revenue Comparison", fontweight='bold')
    plt.gca().yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, p: format(int(x), ',')))
    plt.savefig(f"{output_dir}/timeseries_yoy.png")
    plt.close()

    # Seasonal Decomposition (Requires 2 full cycles/years)
    try:
        monthly_ts = monthly_rev.set_index('Date')['Revenue']
        decomposition = seasonal_decompose(monthly_ts, model='additive', period=12)
        fig = decomposition.plot()
        fig.set_size_inches(14, 10)
        fig.suptitle('Seasonal Decomposition of Revenue', fontweight='bold', y=1.02)
        plt.savefig(f"{output_dir}/timeseries_decomposition.png")
        plt.close()
    except Exception as e:
        logger.warning("Skipping seasonal decomposition due to insufficient time periods.")

    # ---------------------------------------------------------
    # 5. ADVANCED ANALYSIS
    # ---------------------------------------------------------
    logger.info("Generating Advanced Charts...")
    
    # Pareto Chart
    prod_rev = df.groupby('Product_Name')['Revenue'].sum().sort_values(ascending=False).reset_index()
    prod_rev['Cumulative_Pct'] = prod_rev['Revenue'].cumsum() / prod_rev['Revenue'].sum() * 100
    
    fig, ax1 = plt.subplots(figsize=(14, 6))
    top_n = 20 # Show top 20 products
    sns.barplot(data=prod_rev.head(top_n), x='Product_Name', y='Revenue', ax=ax1, color='steelblue')
    ax1.set_xticklabels(ax1.get_xticklabels(), rotation=45, ha='right')
    ax1.set_ylabel("Revenue ($)")
    
    ax2 = ax1.twinx()
    ax2.plot(prod_rev.head(top_n)['Product_Name'], prod_rev.head(top_n)['Cumulative_Pct'], color='crimson', marker='D', ms=5)
    ax2.axhline(80, color='grey', linestyle='--', alpha=0.7)
    ax2.set_ylabel("Cumulative %", color='crimson')
    plt.title("Pareto Chart: Top Products by Revenue", fontweight='bold')
    plt.savefig(f"{output_dir}/advanced_pareto.png")
    plt.close()

    # Waterfall Chart
    wf_data = {
        'Category': ['Gross Revenue', 'COGS', 'Discounts (Proxy)', 'Net Profit'],
        'Amount': [df['Revenue'].sum() + (df['Revenue'].sum() * df['Discount_%'].mean() / 100), 
                   -df['COGS'].sum(), 
                   -(df['Revenue'].sum() * df['Discount_%'].mean() / 100), 
                   df['Profit'].sum()]
    }
    wf_df = pd.DataFrame(wf_data)
    
    bottoms = []
    running = 0
    for _, row in wf_df.iterrows():
        if row['Amount'] >= 0:
            bottoms.append(running)
        else:
            bottoms.append(running + row['Amount'])
        running += row['Amount']
        
    colors_wf = ['#1D9E75' if v >= 0 else '#E24B4A' for v in wf_df['Amount']]
    plt.figure(figsize=(10, 6))
    plt.bar(wf_df['Category'], wf_df['Amount'].abs(), bottom=bottoms, color=colors_wf)
    plt.title("Financial Waterfall Chart (Revenue to Profit)", fontweight='bold')
    plt.ylabel("Amount ($)")
    plt.savefig(f"{output_dir}/advanced_waterfall.png")
    plt.close()

    # RFM Analysis
    snapshot_date = df['Date'].max() + pd.Timedelta(days=1)
    rfm = df.groupby('Customer_ID').agg({
        'Date': lambda x: (snapshot_date - x.max()).days,
        'Order_ID': 'count',
        'Revenue': 'sum'
    }).rename(columns={'Date': 'Recency', 'Order_ID': 'Frequency', 'Revenue': 'Monetary'})
    
    rfm['R_Score'] = pd.qcut(rfm['Recency'], 4, labels=[4, 3, 2, 1])
    # Prevent drop_duplicates duplicate bin edge errors with rank based qcut
    freq_rank = rfm['Frequency'].rank(method='first')
    rfm['F_Score'] = pd.qcut(freq_rank, 4, labels=[1, 2, 3, 4])
    rfm['M_Score'] = pd.qcut(rfm['Monetary'], 4, labels=[1, 2, 3, 4])
    rfm['RFM_Score'] = rfm['R_Score'].astype(str) + rfm['F_Score'].astype(str) + rfm['M_Score'].astype(str)
    
    def rfm_segment(row):
        if row['RFM_Score'] >= '444': return 'VIP'
        elif int(row['RFM_Score'][0]) >= 3: return 'Loyal'
        elif int(row['RFM_Score'][0]) <= 2 and int(row['RFM_Score'][2]) >= 3: return 'At Risk VIP'
        else: return 'Standard'
        
    rfm['Segment'] = rfm.apply(rfm_segment, axis=1)
    plt.figure(figsize=(8, 6))
    sns.countplot(data=rfm, x='Segment', palette='magma', order=rfm['Segment'].value_counts().index)
    plt.title("RFM Customer Segments", fontweight='bold')
    plt.savefig(f"{output_dir}/advanced_rfm.png")
    plt.close()

    # Cohort Analysis (Retention Heatmap)
    df['CohortMonth'] = df.groupby('Customer_ID')['Date'].transform('min').dt.to_period('M')
    df['OrderMonth'] = df['Date'].dt.to_period('M')
    df['CohortIndex'] = (df['OrderMonth'].dt.year - df['CohortMonth'].dt.year) * 12 + (df['OrderMonth'].dt.month - df['CohortMonth'].dt.month) + 1
    cohort_data = df.groupby(['CohortMonth', 'CohortIndex'])['Customer_ID'].nunique().reset_index()
    cohort_pivot = cohort_data.pivot(index='CohortMonth', columns='CohortIndex', values='Customer_ID')
    cohort_size = cohort_pivot.iloc[:, 0]
    retention = cohort_pivot.divide(cohort_size, axis=0) * 100
    
    plt.figure(figsize=(16, 10))
    # Taking top 15 cohorts to avoid clutter
    sns.heatmap(retention.head(15), annot=True, fmt=".0f", cmap="YlGnBu", vmin=0.0, vmax=100)
    plt.title("Monthly Cohort Retention Rate (%)", fontweight='bold')
    plt.ylabel("Cohort Month")
    plt.xlabel("Month Index")
    plt.savefig(f"{output_dir}/advanced_cohort.png")
    plt.close()

    # Geographic Heatmap (Folium)
    # Using dummy coordinates for top cities to demonstrate map plotting
    city_coords = {
        'New Delhi': [28.6139, 77.2090],
        'Ludhiana': [30.9010, 75.8573],
        'Bangalore': [12.9716, 77.5946],
        'Chennai': [13.0827, 80.2707],
        'Kolkata': [22.5726, 88.3639],
        'Bhubaneswar': [20.2961, 85.8245],
        'Mumbai': [19.0760, 72.8777],
        'Ahmedabad': [23.0225, 72.5714],
        'Indore': [22.7196, 75.8577],
        'Raipur': [21.2514, 81.6296]
    }
    
    df['Lat'] = df['City'].map(lambda x: city_coords.get(x, [0,0])[0])
    df['Lon'] = df['City'].map(lambda x: city_coords.get(x, [0,0])[1])
    map_data = df[df['Lat'] != 0].groupby(['City', 'Lat', 'Lon'])['Revenue'].sum().reset_index()
    
    m = folium.Map(location=[20.5937, 78.9629], zoom_start=5, tiles='cartodb dark_matter')
    heat_data = [[row['Lat'], row['Lon'], row['Revenue']] for index, row in map_data.iterrows()]
    HeatMap(heat_data, radius=25, blur=15, max_zoom=1).add_to(m)
    m.save(f"{output_dir}/advanced_geo_heatmap.html")

    logger.info("EDA Complete! All high-res PNG plots saved to '%s' directory.", output_dir)
    logger.info("="*50)

if __name__ == "__main__":
    run_eda()
