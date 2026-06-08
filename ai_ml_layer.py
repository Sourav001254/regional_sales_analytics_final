import os
import pandas as pd
import xgboost as xgb
import shap
import matplotlib.pyplot as plt
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_pandas_dataframe_agent
import warnings
from dotenv import load_dotenv

load_dotenv()
warnings.filterwarnings('ignore')

class AI_ML_Layer:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise EnvironmentError("GEMINI_API_KEY not set in environment")
        genai.configure(api_key=api_key)
        
    # ==========================================
    # 1. NATURAL LANGUAGE QUERY (NLQ) ENGINE
    # ==========================================
    def nlq_engine(self, user_query: str):
        """
        Uses Langchain and Gemini to create a 'Text-to-Pandas/SQL' Agent.
        Allows users to type "Show me revenue for North region in Q3 2023" and get answers.
        """
        print(f"\\n--- NLQ ENGINE ---\\nQuery: {user_query}")
        
        # Initialize Gemini Model
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0)
        
        # Create an agent that can write and execute pandas code under the hood
        agent = create_pandas_dataframe_agent(llm, self.df, verbose=False, allow_dangerous_code=True)
        
        response = agent.invoke(user_query)
        print(f"AI Agent Response: {response['output']}")
        return response['output']

    # ==========================================
    # 2. AI-POWERED ANOMALY EXPLAINER
    # ==========================================
    def explain_anomaly_gemini(self, anomaly_row: pd.Series):
        """
        Passes flagged anomalistic records to Gemini to generate human-readable narratives.
        """
        print("\\n--- GENERATING ANOMALY NARRATIVE ---")
        prompt = f"""
        Act as a Senior Financial Analyst. We detected an anomaly in our sales data on {anomaly_row['Date']}.
        Region: {anomaly_row['Region']}
        Revenue: ${anomaly_row['Revenue']}
        Profit: ${anomaly_row['Profit']}
        Margin: {anomaly_row['Profit_Margin_%']}%
        Discount: {anomaly_row['Discount_%']}%
        
        Write a concise, 2-sentence executive explanation linking the discount rate to the margin compression and revenue impact.
        """
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        print(f"Auto-Narrative: {response.text.strip()}")
        return response.text

    # ==========================================
    # 3. XGBOOST PREDICTOR WITH SHAP
    # ==========================================
    def train_xgboost_with_shap(self):
        """
        Trains an XGBoost model to predict Revenue and uses SHAP to interpret feature importance.
        """
        print("\\n--- XGBOOST + SHAP EXPLAINABILITY ---")
        
        # Simple feature engineering for ML
        self.df['Date'] = pd.to_datetime(self.df['Date'])
        self.df['Season_Num'] = self.df['Date'].dt.month % 12 // 3 + 1
        self.df['Product_Category_encoded'] = self.df['Product_Category'].astype('category').cat.codes
        self.df['Region_encoded'] = self.df['Region'].astype('category').cat.codes
        
        features = ['Units_Sold', 'Unit_Price', 'Discount_%', 'Delivery_Days', 'Season_Num', 'Product_Category_encoded', 'Region_encoded']
        X = self.df[features]
        y = self.df['Revenue']
        
        # Train Model
        model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.1)
        model.fit(X, y)
        print("XGBoost Model Trained.")
        
        # SHAP Explainer
        explainer = shap.Explainer(model, X)
        shap_values = explainer(X)
        
        # Generate Waterfall Plot for the first prediction
        shap.plots.waterfall(shap_values[0], show=False)
        plt.title("SHAP Waterfall: Explaining Revenue Prediction for 1 Transaction")
        plt.tight_layout()
        plt.savefig("advanced_outputs/shap_waterfall.png")
        plt.close()
        
        print("SHAP explainer graph generated and saved: shap_waterfall.png")

if __name__ == "__main__":
    # Test execution
    try:
        df = pd.read_csv("cleaned_sales_data.csv")
        ai_layer = AI_ML_Layer(df)
        
        # ai_layer.nlq_engine("What was the highest profit recorded, and in which region?")
        ai_layer.train_xgboost_with_shap()
    except Exception as e:
        print(f"Note: Ensure 'cleaned_sales_data.csv' exists and libraries are installed. Error: {e}")
