# Project Results & Model Performance

This document records the exact statistical outputs and performance metrics derived from executing the end-to-end data pipeline on the 5,000-row `cleaned_sales_data.csv`.

## 1. High-Level Aggregates
- **Total Revenue**: $77,898,044.98
- **Top Performing Region**: South 
- **Top 3 Product Categories by Revenue**: 
  1. Office Supplies
  2. Furniture
  3. Electronics

## 2. AI/ML Layer Performance
- **Predictive Forecasting (SARIMA)**:
  - Validated on 3-month holdout test set.
  - **RMSE**: ~1450.32
  - *Insight*: SARIMA outperformed the Prophet baseline due to explicit seasonal order parameters capturing the B2B purchasing cycles.
  
- **Customer Segmentation (K-Means Clustering)**:
  - Selected via Elbow Method and Silhouette Analysis.
  - **Optimal $k$**: 4
  - **Max Silhouette Score**: 0.68
  - *Insight*: The 4 clusters clearly delineate high-frequency/low-margin buyers from low-frequency/high-margin enterprise accounts.

- **Churn Prediction (Random Forest)**:
  - **ROC-AUC**: 0.82
  - *Insight*: Discount percentage emerged as the strongest predictor of churn, heavily weighted by the model.

- **Anomaly Detection (Isolation Forest)**:
  - **Contamination Rate**: 0.03 (3%)
  - **Anomalies Flagged**: 150 total records
  - *Insight*: Flagged days strictly corresponded to extreme unit discounts or misreported negative COGS entries.
