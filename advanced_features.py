import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, root_mean_squared_error
from statsmodels.tsa.statespace.sarimax import SARIMAX
from prophet import Prophet
import itertools
import warnings
import os
import sys

# Add current directory to path to import src.logger
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from logger import logger

warnings.filterwarnings('ignore')

def run_advanced_features(input_file="cleaned_sales_data.csv", output_dir="advanced_outputs"):
    logger.info("="*50)
    logger.info("STAGE 6: ADVANCED AI & ML FEATURES")
    logger.info("="*50)
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        df = pd.read_csv(input_file)
        df['Date'] = pd.to_datetime(df['Date'])
    except Exception as e:
        logger.error("Error loading %s. Ensure previous steps are complete.", input_file)
        return

    # ---------------------------------------------------------
    # 1. ANOMALY DETECTION (Isolation Forest)
    # ---------------------------------------------------------
    logger.info("Running Anomaly Detection...")
    # Aggregate daily sales to find anomalous days
    daily_sales = df.groupby('Date').agg({'Revenue': 'sum', 'Profit': 'sum', 'Units_Sold': 'sum'}).reset_index()
    
    features = ['Revenue', 'Profit', 'Units_Sold']
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(daily_sales[features])
    
    # Train Isolation Forest
    iso_forest = IsolationForest(contamination=0.03, random_state=42) # Expecting ~3% anomalies
    daily_sales['Anomaly_Flag'] = iso_forest.fit_predict(scaled_features)
    
    anomalies = daily_sales[daily_sales['Anomaly_Flag'] == -1]
    
    plt.figure(figsize=(14, 6))
    plt.plot(daily_sales['Date'], daily_sales['Revenue'], color='steelblue', label='Normal Daily Revenue')
    plt.scatter(anomalies['Date'], anomalies['Revenue'], color='crimson', s=50, label='Anomaly detected', zorder=5)
    plt.title("Daily Revenue with Anomaly Detection (Isolation Forest)", fontweight='bold')
    plt.legend()
    plt.savefig(f"{output_dir}/anomaly_detection_timeline.png", dpi=300, bbox_inches='tight')
    plt.close()
    
    logger.info("Detected %d anomalous days based on volume and profit characteristics.", len(anomalies))

    # ---------------------------------------------------------
    # 2. PREDICTIVE FORECASTING (ARIMA/SARIMA vs PROPHET)
    # ---------------------------------------------------------
    logger.info("Running Predictive Forecasting...")
    monthly_rev = df.resample('ME', on='Date')['Revenue'].sum()
    monthly_rev.index = pd.date_range(start=monthly_rev.index[0], periods=len(monthly_rev), freq='ME')

    # Holdout last 3 months for evaluation
    train = monthly_rev.iloc[:-3]
    test  = monthly_rev.iloc[-3:]

    # SARIMA Grid Search
    logger.info("Running SARIMA parameter selection (AIC grid search)...")
    best_aic, best_order, best_seasonal = np.inf, None, None
    p_d_q = [(p,d,q) for p,d,q in itertools.product(range(2),range(2),range(2))]
    for order in p_d_q:
        try:
            m = SARIMAX(train, order=order,
                        seasonal_order=(1,1,0,12)).fit(disp=False)
            if m.aic < best_aic:
                best_aic, best_order = m.aic, order
        except:
            continue
    logger.info("Best SARIMA order: %s (AIC=%.2f)", best_order, best_aic)

    # Fit best SARIMAX model
    model = SARIMAX(train, order=best_order, seasonal_order=(1, 1, 0, 12)) 
    results = model.fit(disp=False)
    
    # Forecast next 3 months for evaluation
    sarima_pred = results.get_forecast(steps=3).predicted_mean
    sarima_rmse = root_mean_squared_error(test.values, sarima_pred.values)

    # Forecast next 6 months for plot
    model_full = SARIMAX(monthly_rev, order=best_order, seasonal_order=(1, 1, 0, 12)).fit(disp=False)
    forecast = model_full.get_forecast(steps=6)
    pred_mean = forecast.predicted_mean
    pred_ci = forecast.conf_int()
    
    # Prophet
    logger.info("Running Prophet baseline...")
    prophet_df = train.reset_index().rename(columns={'index':'ds','Revenue':'y', 0:'y'})
    if 'ds' not in prophet_df.columns and 'Date' in prophet_df.columns:
        prophet_df = prophet_df.rename(columns={'Date': 'ds'})
    m_prophet = Prophet(yearly_seasonality=True, weekly_seasonality=False)
    m_prophet.fit(prophet_df)
    future = m_prophet.make_future_dataframe(periods=3, freq='ME')
    prophet_pred = m_prophet.predict(future).tail(3)['yhat'].values
    prophet_rmse = root_mean_squared_error(test.values, prophet_pred)

    logger.info("SARIMA RMSE=%.0f  Prophet RMSE=%.0f", sarima_rmse, prophet_rmse)

    plt.figure(figsize=(12, 6))
    plt.plot(monthly_rev.index, monthly_rev, label='Historical Revenue', color='navy')
    plt.plot(pred_mean.index, pred_mean, label='6-Month Forecast', color='darkorange', linestyle='--')
    plt.fill_between(pred_ci.index, pred_ci.iloc[:, 0], pred_ci.iloc[:, 1], color='orange', alpha=0.2, label='95% Confidence Interval')
    plt.title("Revenue Forecast (SARIMA) for Next 6 Months", fontweight='bold')
    plt.legend()
    plt.savefig(f"{output_dir}/revenue_forecast_sarima.png", dpi=300, bbox_inches='tight')
    plt.close()

    # ---------------------------------------------------------
    # 3. CUSTOMER SEGMENTATION (K-Means Clustering)
    # ---------------------------------------------------------
    logger.info("Running Customer Segmentation...")
    # Base features: Revenue, Frequency, Discount Usage
    cust_data = df.groupby('Customer_ID').agg({
        'Revenue': 'sum',
        'Order_ID': 'count',
        'Discount_%': 'mean'
    }).rename(columns={'Order_ID': 'Frequency', 'Discount_%': 'Avg_Discount'})
    
    cust_scaled = scaler.fit_transform(cust_data)
    
    # Elbow and Silhouette Analysis
    wcss, sil_scores = [], []
    K_range = range(2, 9)
    for k in K_range:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        km.fit(cust_scaled)
        wcss.append(km.inertia_)
        sil_scores.append(silhouette_score(cust_scaled, km.labels_))

    # Optimal k = highest silhouette score
    optimal_k = K_range[sil_scores.index(max(sil_scores))]
    logger.info("Optimal k=%d (silhouette=%.3f)", optimal_k, max(sil_scores))

    # Save elbow plot
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
    ax1.plot(K_range, wcss, marker='o')
    ax1.set_title('Elbow Method (WCSS)')
    ax2.plot(K_range, sil_scores, marker='o', color='green')
    ax2.set_title('Silhouette Scores')
    plt.savefig(f"{output_dir}/kmeans_optimal_k.png")
    plt.close()

    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
    cust_data['Cluster'] = kmeans.fit_predict(cust_scaled)
    
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=cust_data, x='Revenue', y='Avg_Discount', hue='Cluster', palette='Set1', s=100, alpha=0.7)
    plt.title("Customer Segments: Revenue vs Average Discount", fontweight='bold')
    plt.savefig(f"{output_dir}/customer_kmeans_clusters.png", dpi=300, bbox_inches='tight')
    plt.close()
    logger.info("Created %d Customer Segments based on purchasing behavior.", optimal_k)

    # ---------------------------------------------------------
    # 4. AUTOMATED INSIGHT GENERATION
    # ---------------------------------------------------------
    logger.info("Generating Automated Business Insights...")
    
    insights = []
    
    best_region = df.groupby('Region')['Revenue'].sum().idxmax()
    best_region_rev = df.groupby('Region')['Revenue'].sum().max()
    insights.append(f"Top Region: '{best_region}' outperformed all others with total revenue of ${best_region_rev:,.2f}.")
    
    total_2022 = df[df['Year'] == 2022]['Revenue'].sum()
    total_2023 = df[df['Year'] == 2023]['Revenue'].sum()
    if total_2022 > 0:
        yoy_total = ((total_2023 - total_2022) / total_2022) * 100
        direction = "grew" if yoy_total > 0 else "shrank"
        insights.append(f"YoY Growth: Total revenue {direction} by {abs(yoy_total):.1f}% from 2022 to 2023.")
    
    worst_margin_cat = df.groupby('Product_Category')['Profit_Margin_%'].mean().idxmin()
    worst_margin_val = df.groupby('Product_Category')['Profit_Margin_%'].mean().min()
    insights.append(f"Margin Leak: '{worst_margin_cat}' holds the lowest average profit margin at {worst_margin_val:.1f}%. Consider pricing review.")
    
    disc_corr = df['Discount_%'].corr(df['Profit_Margin_%'])
    insights.append(f"Discount Impact: Discount percentage has a correlation of {disc_corr:.2f} with profit margin, indicating strong margin erosion.")

    top_prod = df.groupby('Product_Name')['Revenue'].sum().idxmax()
    insights.append(f"Top Product: '{top_prod}' generated the highest overall revenue.")
    
    worst_region = df.groupby('Region')['Revenue'].sum().idxmin()
    insights.append(f"Worst Region: '{worst_region}' underperformed compared to all other regions.")
    
    if 'Season' in df.columns:
        season_peak = df.groupby('Season')['Revenue'].sum().idxmax()
        insights.append(f"Seasonal Peak: Most revenue was generated during the '{season_peak}' season.")
        
    if 'Return_Flag' in df.columns:
        return_rate = (df['Return_Flag'].sum() / len(df)) * 100
        insights.append(f"Return Rate: Overall product return rate stands at {return_rate:.1f}%.")
        
    if 'Sales_Rep_Name' in df.columns:
        best_rep = df.groupby('Sales_Rep_Name')['Revenue'].sum().idxmax()
        insights.append(f"Best Sales Rep: '{best_rep}' led the team in total revenue generation.")
        
    insights.append(f"Discounting: The maximum discount given was {df['Discount_%'].max()}%, which correlates with lower profit segments.")

    logger.info("--- AUTO GENERATED INSIGHTS ---")
    for i, ins in enumerate(insights, 1):
        logger.info("%d. %s", i, ins)
        
    with open(f"{output_dir}/automated_insights.txt", "w") as f:
        f.write("\n".join(insights))

    logger.info("Advanced features extraction complete!")

if __name__ == "__main__":
    run_advanced_features()
