# 🎤 Technical Interview Q&A Preparation

Nail the interview when submitting this project. Memorize these conceptual answers.

**Q1: "You used the IQR method for outlier detection in your Python script. Why prefer IQR over Z-scores in financial data?"**
*Answer:* "Sales and revenue data are rarely normally distributed; they are usually heavily right-skewed with natural whales/enterprise purchases. Z-scores assume a normal, Gaussian distribution and rely on the mean and standard deviation, which are themselves highly sensitive to outliers. The IQR method uses medians and quartiles (25th and 75th percentiles), making it robust and non-parametric against skewed sales data."

**Q2: "In your Power BI setup, you mentioned a Star Schema. Why did you split your data into Fact and Dimension tables instead of importing one giant flat table?"**
*Answer:* "Flat tables cause immense data redundancy, inflating the file size and slowing down the VertiPaq compression engine. By normalizing into a Star Schema (Fact_Sales, Dim_Product, Dim_Customer), relationships ensure highly efficient memory storage and allow filter context to propagate properly in one direction, preventing ambiguous DAX behaviors."

**Q3: "Walk me through your Customer Churn Prediction model. Why Logistic Regression or Random Forest?"**
*Answer:* "I synthetically engineered 'days since last purchase' to identify churners. Random Forest works well because it captures non-linear interactions (e.g., high revenue but low frequency) without needing extensive feature scaling. I evaluated it using the ROC-AUC curve because churn datasets are inherently imbalanced—accuracy alone is misleading if only 5% of your customers churn."

**Q4: "You use XGBoost for prediction and then mentioned 'SHAP'. What is SHAP, and why do executives care?"**
*Answer:* "XGBoost is highly accurate but operates as a 'black box'. SHAP (SHapley Additive exPlanations) uses game theory to calculate the exact marginal contribution of every variable. If the model predicts a huge drop in revenue for a specific region next month, SHAP generates a waterfall plot so I can tell an executive *exactly* why: 'It's because our discount feature pushed the prediction down, and the winter season variable pulled it up.' It builds stakeholder trust."

**Q5: "Explain your DAX for YoY Growth %. How does `SAMEPERIODLASTYEAR` work in the background?"**
*Answer:* "YoY Growth is `DIVIDE([Total Revenue] - [Revenue SPLY], [Revenue SPLY], 0)`. The `[Revenue SPLY]` measure uses `CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Calendar'[Date]))`. Under the hood, this shifts the current filter context of the Date table back precisely one year, allowing a direct comparison against historical bounds. It requires a continuous, unbroken 'Date' dimension table marked as a Date Table to function correctly."

**Q6: "How did you implement the Langchain NLQ (Natural Language Query) feature?"**
*Answer:* "I used the `create_pandas_dataframe_agent` from Langchain initialized with the Gemini API. When a user asks a question, the LLM generates secure, sandboxed pandas Python code corresponding to the query, inherently understanding the dataframe's schema, executes it dynamically against the data, and returns an English answer. It bridges the gap between complex pivot tables and non-technical stakeholders."

**Q7. "Describe the Monte Carlo simulation you ran. Why do that instead of just finding the average?"**
*Answer:* "An average just gives a point estimate. Monte Carlo runs 10,000 randomized simulations using the historical standard deviations of our revenue. It results in a probability distribution, allowing me to tell the CFO: 'We don't just expect $1.2M; rather, there is an 85% statistical probability we hit at least $1.0M, modeling for all known risks.' It converts a single target into a comprehensive risk profile."

**Q8. Why did you choose SARIMA over Prophet for forecasting?**
**A8:** SARIMA was selected because the dataset exhibited strong, consistent seasonality and we had sufficient historical data without severe irregularities. Prophet is great for datasets with strong multiple human-scale seasonalities and outliers (like holidays), but SARIMA gives more explicit control over autoregressive properties and handles standard financial monthly forecasting very reliably.

**Q9. Can you explain the K-Means elbow method you used in tracking customer segments?**
**A9:** Absolutely. I scaled the base features (Revenue, Frequency, Avg_Discount) and executed both the Elbow Method and Silhouette Analysis testing $k$ from 2 to 8. The highest silhouette score peaked at $k=4$ (around 0.68). This was the mathematical trigger to segment into 4 discrete buckets, separating high-frequency buyers from enterprise whales.

**Q10. How did you choose the contamination parameter for the Isolation Forest?**
**A10:** I used Isolation Forest. Since financial anomalies in our system historically account for a tiny fraction of data, I set the contamination parameter strictly to 3% (`0.03`). This flags only the most extreme deviations in the Revenue vs. Profit multi-dimensional space.

**Q11. What is the use case of a Sankey diagram in your predictive analytics module?**
**A11:** The Sankey diagram visualizes the flow of customers between different states or segments. For our churn analysis, it visually maps how customers move from 'Active' to 'At Risk' to 'Churned' over time. This makes it instantly understandable for non-technical stakeholders to see the volume and trajectory of customer retention leakage.

**Q12. Explain the rationale behind your CI/CD pipeline setup for the data pipeline.**
**A12:** The GitHub Actions CI/CD pipeline ensures that any code changes to the data processing logic are automatically validated. When code is pushed, the pipeline spins up an environment, runs the `data_cleaning.py` script to ensure data integrity, automatically runs `pytest` (e.g., catching negative revenue checks), and finishes by compiling an expected output (the PDF). This aligns with data engineering best practices by preventing breaking changes in production.

**Q13. How did you handle missing values or incorrect data types during data cleaning?**
**A13:** I utilized `pandas.read_csv` and verified missing values. For categorical features like Customer Segment, I imputed with the statistical mode. For numerics like Delivery Days, I used the median to prevent outliers from skewing the fill. Return flags were zero-filled. Outliers in Revenue were clipped to the upper IQR bound, ensuring the distributions remained structurally sound for the downstream ML models.

**Q14. In Power BI, how does the DAX context transition work in your measures?**
**A14:** Context transition occurs when a row context is transformed into a filter context, typically using `CALCULATE`. In our YoY % measures, iterating over rows requires `CALCULATE` to evaluate the time-intelligence functions (`DATEADD` or `SAMEPERIODLASTYEAR`) against the specific filtered subset of dates.

**Q15. Why combine Power Query and DAX? Couldn't you do it all in DAX?**
**A15:** Power Query (M) is best for data shaping, transformation, and structural loading (e.g., unpivoting, merging). DAX is an analytical query language specialized for aggregations and dynamic calculations. Pushing structural ETL upstream into Power Query keeps the semantic model lightweight, leading to faster DAX measure evaluation and chart rendering.

**Q16. What is the purpose of the Natural Language Query (NLQ) engine?**
**A16:** The NLQ engine allows stakeholders to query complex data sets using plain English (e.g., "Show me top revenue by region"). It bridges the gap between raw data and non-technical decision-makers by generating SQL/Pandas code via the Gemini API, executing it safely, and returning instant results without needing to write a dashboard component for every possible ad-hoc question.

**Q17. Explain how the SHAP analysis works alongside XGBoost.**
**A17:** XGBoost provides powerful predictive accuracy but works as a "black box." SHAP (SHapley Additive exPlanations) opens that box by calculating the marginal contribution of each feature to the model's output for a given prediction. This means we can tell stakeholders not just *that* revenue will drop, but *why* (e.g., "because discounts increased by 5% and Delivery Days spiked").

**Q18. How does the RFM Analysis technically create value for marketing?**
**A18:** RFM (Recency, Frequency, Monetary value) sorts customers by standard engagement metrics. By assigning a 1-5 score to each axis, we combine them to pinpoint 'Champions' (high in all three) who should get loyalty perks, and 'At-Risk' customers who need win-back campaigns, optimizing marketing spend.

**Q19. Describe your approach to testing the data pipeline.**
**A19:** Using `pytest`, I wrote deterministic assertions. For example, testing that the cleaned data has zero null values, no negative revenues, and that derived numeric columns (like `Profit_Margin_%`) match manual calculations. This acts as a quality gatekeeper.

**Q20. If you were to scale this solution to handle 100 million rows, what would change?**
**A20:** Pandas would likely run out of memory. I would migrate the data cleaning tier to PySpark or Polars for distributed computing. The database would transition from SQLite/CSV to a cloud data warehouse like BigQuery or Snowflake. The reporting layer (Power BI) would switch to DirectQuery mode or process grouped aggregations overnight rather than importing the entire raw model into memory.
