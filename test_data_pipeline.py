import pytest
import pandas as pd
import numpy as np

@pytest.fixture(scope="module")
def df():
    # Load the cleaned dataset once for all tests
    return pd.read_csv("cleaned_sales_data.csv")

def test_data_cleaning_no_nulls(df):
    assert df.isnull().sum().sum() == 0, "Cleaned data should not contain null values"

def test_outlier_treatment_bounds(df):
    assert df['Revenue'].min() >= 0, "Revenue cannot be negative"
    assert df['Units_Sold'].min() > 0, "Units sold must be > 0"
    
def test_profit_margin_calculation(df):
    recalc_margin = (df['Profit'] / df['Revenue']) * 100
    assert np.allclose(df['Profit_Margin_%'].fillna(0), recalc_margin.fillna(0), atol=0.1)

def test_feature_engineering_columns_present(df):
    required = ['Revenue_Tier', 'Customer_Lifetime_Value_Score', 'Season', 'High_Value_Flag', 'Rolling_7day_Revenue']
    for col in required:
        assert col in df.columns, f"Missing engineered column: {col}"

def test_profit_equals_revenue_minus_cogs(df):
    calc = (df['Revenue'] - df['COGS']).round(2)
    assert np.allclose(df['Profit'].round(2), calc, atol=0.5), "Profit != Revenue - COGS"

def test_no_future_dates(df):
    dates = pd.to_datetime(df['Date'])
    assert dates.max() <= pd.Timestamp('2024-12-31')

def test_revenue_tier_labels(df):
    valid_labels = {'Low', 'Medium', 'High'}
    unique_labels = set(df['Revenue_Tier'].dropna().unique())
    assert unique_labels.issubset(valid_labels), f"Found invalid Revenue_Tier labels: {unique_labels - valid_labels}"

def test_rolling_7day_revenue_not_nan(df):
    assert not df['Rolling_7day_Revenue'].isna().any(), "Rolling_7day_Revenue contains NaN values"

def test_season_values(df):
    valid_seasons = {'Winter', 'Spring', 'Summer', 'Autumn'}
    unique_seasons = set(df['Season'].dropna().unique())
    assert unique_seasons.issubset(valid_seasons), "Found invalid Season values"

def test_no_order_id_duplicates(df):
    assert df['Order_ID'].is_unique, "Found duplicate Order_IDs in cleaned data"

def test_yoy_growth_is_numeric(df):
    if 'YoY_Growth_%' in df.columns:
        assert pd.api.types.is_numeric_dtype(df['YoY_Growth_%']), "YoY_Growth_% should be numeric"

def test_rfm_scores_valid(df):
    if 'RFM_Score' in df.columns:
        valid_digits = {'1', '2', '3', '4'}
        for score in df['RFM_Score'].dropna():
            assert len(str(score)) == 3, f"RFM Score {score} must be 3 digits"
            assert set(str(score)).issubset(valid_digits), f"RFM Score {score} contains invalid digits"

def test_discount_bounds(df):
    assert df['Discount_%'].between(0, 100).all(), "Discount_% is outside 0-100 bounds"

def test_region_values(df):
    valid_regions = {"North", "South", "East", "West", "Central"}
    assert set(df['Region'].unique()).issubset(valid_regions), "Found invalid Region values"

def test_positive_cogs(df):
    assert df['COGS'].min() >= 0, "COGS cannot be negative"
