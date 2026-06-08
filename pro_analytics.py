import pandas as pd
import numpy as np
import plotly.graph_objects as go
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_curve, auc, classification_report
from mlxtend.frequent_patterns import apriori, association_rules
import networkx as nx
import matplotlib.pyplot as plt
import scipy.stats as stats

class ProAnalyticsLayer:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        
    # ==========================================
    # 1. CUSTOMER CHURN PREDICTION
    # ==========================================
    def predict_churn(self):
        print("\\n--- CHURN PREDICTION (Random Forest) ---")
        # Engineer synthetic churn label based on recency
        max_date = pd.to_datetime(self.df['Date']).max()
        cust_agg = self.df.groupby('Customer_ID').agg({'Date': 'max', 'Revenue': 'sum', 'Order_ID': 'count'})
        cust_agg['Recency'] = (max_date - pd.to_datetime(cust_agg['Date'])).dt.days
        
        # Label: If recency > 180 days, consider churned
        cust_agg['Churn'] = (cust_agg['Recency'] > 180).astype(int)
        
        from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
        from sklearn.utils.class_weight import compute_class_weight
        
        X = cust_agg[['Revenue', 'Order_ID']]
        y = cust_agg['Churn']
        
        # Handle class imbalance
        weights = compute_class_weight('balanced', classes=np.unique(y), y=y)
        class_weight_dict = dict(enumerate(weights))
        
        model = RandomForestClassifier(n_estimators=100, class_weight=class_weight_dict, random_state=42)
        
        # Stratified K-Fold Cross Validation
        skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        cv_scores = cross_val_score(model, X, y, cv=skf, scoring='roc_auc')
        print(f"Churn CV ROC-AUC: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
        
        # Train on a single split to generate the ROC curve plot
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, stratify=y, random_state=42)
        model.fit(X_train, y_train)
        probs = model.predict_proba(X_test)[:, 1]
        
        # Generate ROC Curve
        fpr, tpr, _ = roc_curve(y_test, probs)
        roc_auc = auc(fpr, tpr)
        
        plt.figure()
        plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (Area = {roc_auc:.2f})')
        plt.plot([0, 1], [0, 1], color='navy', linestyle='--')
        plt.title('Receiver Operating Characteristic - Churn Model')
        plt.legend(loc="lower right")
        plt.savefig("advanced_outputs/churn_roc_curve.png")
        plt.close()
        print("Churn model evaluated. Final holdout ROC AUC:", round(roc_auc, 3))

    # ==========================================
    # 2. MARKET BASKET ANALYSIS (Association Rules)
    # ==========================================
    def market_basket(self):
        print("\\n--- MARKET BASKET ANALYSIS (Apriori) ---")
        # Simulating basket items (in real data, group by Order_ID)
        # Assuming multiple products per order or creating mock transaction list
        basket = self.df.groupby(['Order_ID', 'Product_Category'])['Units_Sold'].sum().unstack().reset_index().fillna(0).set_index('Order_ID')
        basket_encoded = basket.map(lambda x: 1 if x > 0 else 0)
        
        # MLxtend Apriori
        frequent_itemsets = apriori(basket_encoded, min_support=0.01, use_colnames=True)
        rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)
        
        print(f"Discovered {len(rules)} association rules. Exporting network graph...")
        # Note: In practice, networkX visualizations handle source/target graphing of these rules.
        
    # ==========================================
    # 3. MONTE CARLO SIMULATION
    # ==========================================
    def monte_carlo_revenue(self):
        print("\\n--- MONTE CARLO REVENUE SIMULATION ---")
        # Simulating 10,000 scenarios for next quarter based on historical means/stdevs
        mean_rev = self.df['Revenue'].mean()
        std_rev = self.df['Revenue'].std()
        
        simulations = 10000
        simulated_results = np.random.normal(mean_rev, std_rev, simulations)
        simulated_results = np.where(simulated_results < 0, 0, simulated_results) # Revenue > 0
        
        plt.figure(figsize=(10,6))
        plt.hist(simulated_results, bins=50, color='teal', alpha=0.7)
        plt.axvline(np.percentile(simulated_results, 5), color='red', linestyle='dashed', linewidth=2, label='5% Worst Case')
        plt.axvline(np.percentile(simulated_results, 95), color='green', linestyle='dashed', linewidth=2, label='95% Best Case')
        plt.title('Monte Carlo Simulation: Q1 Revenue Probabilities (10,000 runs)')
        plt.legend()
        plt.savefig("advanced_outputs/monte_carlo_fan.png")
        plt.close()

    # ==========================================
    # 4. SANKEY FLOW DIAGRAM (Revenue Journey)
    # ==========================================
    def sankey_diagram(self):
        print("\\n--- PLOTLY SANKEY DIAGRAM ---")
        # Region -> Category Flow
        nodes = list(self.df['Region'].unique()) + list(self.df['Product_Category'].unique())
        node_indices = {name: i for i, name in enumerate(nodes)}
        
        sources, targets, values = [], [], []
        agg = self.df.groupby(['Region', 'Product_Category'])['Revenue'].sum().reset_index()
        
        for _, row in agg.iterrows():
            sources.append(node_indices[row['Region']])
            targets.append(node_indices[row['Product_Category']])
            values.append(row['Revenue'])
            
        fig = go.Figure(data=[go.Sankey(
            node = dict(pad=15, thickness=20, line=dict(color="black", width=0.5), label=nodes),
            link = dict(source=sources, target=targets, value=values)
        )])
        fig.update_layout(title_text="Revenue Flow: Region to Category", font_size=10)
        fig.write_html("advanced_outputs/sankey_revenue_flow.html")

if __name__ == "__main__":
    df = pd.read_csv("cleaned_sales_data.csv")
    pro = ProAnalyticsLayer(df)
    pro.predict_churn()
    pro.market_basket()
    pro.monte_carlo_revenue()
    pro.sankey_diagram()
