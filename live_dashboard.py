import streamlit as st
import pandas as pd
import numpy as np
import time
import sqlite3
import plotly.express as px

st.set_page_config(page_title="Live Regional Sales DB", layout="wide")

# ==========================================
# 1. SQLITE DATABASE INTEGRATION
# ==========================================
import os
import itertools

@st.cache_resource
def init_db():
    """ Load CSV into SQLite on startup to power advanced SQL analytics """
    conn = sqlite3.connect('sales_data.db', check_same_thread=False)
    try:
        df = pd.read_csv("cleaned_sales_data.csv")
        df.to_sql("sales", conn, if_exists="replace", index=False)
        
        # Create and load targets table
        if not os.path.exists("data/sales_targets.csv"):
            os.makedirs("data", exist_ok=True)
            regions = ["North", "South", "East", "West", "Central"]
            years = [2021, 2022, 2023, 2024]
            months = list(range(1, 13))
            
            targets = []
            for r, y, m in itertools.product(regions, years, months):
                target = np.random.normal(1000000, 150000)
                targets.append({"Region": r, "Year": y, "Month": m, "Target_Revenue": round(target, 2)})
            
            targets_df = pd.DataFrame(targets)
            targets_df.to_csv("data/sales_targets.csv", index=False)
        else:
            targets_df = pd.read_csv("data/sales_targets.csv")
            
        targets_df.to_sql("Targets", conn, if_exists="replace", index=False)
    except Exception as e:
        print(f"DB init error: {e}")
    return conn

conn = init_db()

# ==========================================
# 2. LIVE DASHBOARD STREAMING SIMULATION
# ==========================================
st.title("🔴 Live Streaming Analytics & Database")
st.markdown("Automated dashboard simulation with live KPI updates. Demonstrates **Streamlit real-time reactivity**.")

# Placeholders for live updates
kpi_col1, kpi_col2, kpi_col3 = st.columns(3)
kpi_rev = kpi_col1.empty()
kpi_orders = kpi_col2.empty()
kpi_margin = kpi_col3.empty()

chart_placeholder = st.empty()

if 'stream_active' not in st.session_state:
    st.session_state.stream_active = False

col_btn1, col_btn2 = st.columns(2)
start_button = col_btn1.button("Start Live Stream")
stop_button = col_btn2.button("Stop Stream")

if start_button:
    st.session_state.stream_active = True
if stop_button:
    st.session_state.stream_active = False

if st.session_state.stream_active:
    # Load base data
    df = pd.read_sql("SELECT * FROM sales", conn)
    
    # Simulate streaming by trickling data in over time
    for i in range(10, len(df), 15):
        if not st.session_state.stream_active:
            break
        
        current_data = df.iloc[:i]
        
        # Calculate Live KPIs
        total_rev = current_data['Revenue'].sum()
        total_orders = len(current_data)
        margin = current_data['Profit_Margin_%'].mean()
        
        # Update UI placeholders
        kpi_rev.metric(label="Live Revenue", value=f"${total_rev:,.0f}", delta=f"+${np.random.randint(100, 5000)}")
        kpi_orders.metric(label="Live Orders", value=total_orders, delta=1)
        kpi_margin.metric(label="Live Average Margin", value=f"{margin:.1f}%", delta=f"{np.random.uniform(-0.5, 0.5):.1f}%")
        
        # Update Chart
        fig = px.bar(
            current_data.groupby('Region')['Revenue'].sum().reset_index(),
            x='Region', y='Revenue', color='Region', 
            title="Real-Time Revenue by Region"
        )
        chart_placeholder.plotly_chart(fig, use_container_width=True)
        
        # Sleep to simulate real-time influx (0.5s for demo, normally 5s)
        time.sleep(0.5)

# Usage Note:
# To run this file, install streamlit and run: `streamlit run live_dashboard.py`
